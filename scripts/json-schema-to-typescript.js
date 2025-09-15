#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts snake_case or kebab-case strings to camelCase
 * @param {string} str - The string to convert
 * @returns {string} - The camelCase string
 */
function toCamelCase(str) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

/**
 * Converts strings to PascalCase for type names
 * @param {string} str - The string to convert
 * @returns {string} - The PascalCase string
 */
function toPascalCase(str) {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Maps JSON Schema types to TypeScript types
 * @param {object} property - The JSON Schema property definition
 * @param {Set} enums - Set to collect enum definitions
 * @param {string} propertyName - Name of the property for enum naming
 * @returns {string} - The TypeScript type
 */
function mapJsonSchemaTypeToTS(property, enums, propertyName = "") {
  // Handle $ref references
  if (property.$ref) {
    const refName = property.$ref.split("/").pop();
    return toPascalCase(refName);
  }

  // Handle arrays
  if (property.type === "array") {
    if (property.items) {
      const itemType = mapJsonSchemaTypeToTS(
        property.items,
        enums,
        propertyName
      );
      return `${itemType}[]`;
    }
    return "any[]";
  }

  // Handle enums
  if (property.enum && property.enum.length > 0) {
    const enumName = toPascalCase(propertyName) + "Enum";
    const enumValues = property.enum
      .map((value) => `  ${toCamelCase(value.toString())} = '${value}'`)
      .join(",\n");
    enums.add(`export enum ${enumName} {\n${enumValues}\n}`);
    return enumName;
  }

  // Handle basic types
  switch (property.type) {
    case "string":
      if (property.format === "date-time") return "string"; // Could be Date if preferred
      if (property.format === "date") return "string";
      if (property.format === "uuid") return "string";
      if (property.format === "email") return "string";
      if (property.format === "uri") return "string";
      if (property.format === "decimal") return "string"; // Decimal as string for precision
      return "string";
    case "integer":
      return "number";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      return "Record<string, any>"; // Generic object type
    default:
      return "any";
  }
}

/**
 * Generates TypeScript interface from JSON Schema object definition
 * @param {string} name - The interface name
 * @param {object} definition - The JSON Schema object definition
 * @param {Set} enums - Set to collect enum definitions
 * @returns {string} - The TypeScript interface
 */
function generateInterface(name, definition, enums) {
  const interfaceName = toPascalCase(name);
  const properties = definition.properties || {};
  const required = new Set(definition.required || []);

  let interfaceBody = "";

  for (const [propName, propDef] of Object.entries(properties)) {
    const camelCasePropName = toCamelCase(propName);
    const isOptional =
      !required.has(propName) || propDef["x-nullable"] === true;
    const optionalMarker = isOptional ? "?" : "";

    // Add JSDoc comment if there's a description
    if (propDef.description || propDef.title) {
      const comment = propDef.description || propDef.title;
      interfaceBody += `  /** ${comment} */\n`;
    }

    const tsType = mapJsonSchemaTypeToTS(propDef, enums, propName);
    const nullableType =
      propDef["x-nullable"] === true && !isOptional ? ` | null` : "";

    interfaceBody += `  ${camelCasePropName}${optionalMarker}: ${tsType}${nullableType};\n`;
  }

  return `export interface ${interfaceName} {\n${interfaceBody}}`;
}

/**
 * Processes JSON Schema definitions and converts to TypeScript
 * @param {object} schema - The JSON Schema object
 * @returns {string} - The complete TypeScript definitions
 */
function convertJsonSchemaToTS(schema) {
  const definitions = schema.definitions || schema;
  const interfaces = [];
  const enums = new Set();

  // First pass: Generate all interfaces
  for (const [name, definition] of Object.entries(definitions)) {
    if (definition.type === "object") {
      const tsInterface = generateInterface(name, definition, enums);
      interfaces.push(tsInterface);
    }
  }

  // Combine enums and interfaces
  const enumsArray = Array.from(enums);
  const result = [
    "// Auto-generated TypeScript definitions from JSON Schema",
    "// Generated on: " + new Date().toISOString(),
    "",
    ...enumsArray,
    "",
    ...interfaces,
  ].join("\n\n");

  return result;
}

/**
 * Main function to process the JSON Schema file
 * @param {string} inputFile - Path to the JSON Schema file
 * @param {string} outputFile - Path to the output TypeScript file
 */
function processSchemaFile(inputFile, outputFile) {
  try {
    console.log(`Reading JSON Schema from: ${inputFile}`);

    // Read and parse the JSON Schema file
    const schemaContent = fs.readFileSync(inputFile, "utf8");
    let schema;

    try {
      schema = JSON.parse(schemaContent);
    } catch (parseError) {
      // If the file doesn't start with {, try to wrap it
      const wrappedContent = schemaContent.startsWith("{")
        ? schemaContent
        : `{${schemaContent}}`;
      schema = JSON.parse(wrappedContent);
    }

    console.log(
      `Found ${
        Object.keys(schema.definitions || schema).length
      } type definitions`
    );

    // Convert to TypeScript
    const tsContent = convertJsonSchemaToTS(schema);

    // Write to output file
    fs.writeFileSync(outputFile, tsContent, "utf8");
    console.log(`TypeScript definitions written to: ${outputFile}`);

    // Show some stats
    const enumCount = (tsContent.match(/export enum/g) || []).length;
    const interfaceCount = (tsContent.match(/export interface/g) || []).length;
    console.log(
      `Generated ${interfaceCount} interfaces and ${enumCount} enums`
    );
  } catch (error) {
    console.error("Error processing schema file:", error.message);
    process.exit(1);
  }
}

// Command line interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "Usage: node json-schema-to-typescript.js <input-file> [output-file]"
    );
    console.log("");
    console.log("Example:");
    console.log(
      "  node json-schema-to-typescript.js type-definitions.json types.ts"
    );
    console.log("  node json-schema-to-typescript.js schema.json");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile.replace(/\.(json|js)$/, ".ts");

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" does not exist`);
    process.exit(1);
  }

  processSchemaFile(inputFile, outputFile);
}

// Run if called directly
if (process.argv[1] === __filename) {
  main();
}

export {
  convertJsonSchemaToTS,
  toCamelCase,
  toPascalCase,
  mapJsonSchemaTypeToTS,
  generateInterface,
};
