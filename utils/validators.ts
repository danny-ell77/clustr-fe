import type { ValidationRule, RuleBuilder } from "~/types/validation";
import {
  validateNameRegex,
  validateEmailRegex,
  validatePassword,
  validateGenericNameRegex,
  validateURLRegex,
  validateDomainNameRegex,
  validateIPAddressRegex,
} from "~/lib/validators/regexValidators";

// Core validation function
export function validateField(value: any, rules: ValidationRule[]): string[] {
  return rules
    .map((rule) => {
      const isValid =
        rule.constraint !== undefined
          ? rule.validator(value, rule.constraint)
          : rule.validator(value);

      return isValid ? "" : rule.message;
    })
    .filter((message) => message !== "");
}

// Basic validators
const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

const isNumber = (value: any): boolean => {
  if (typeof value === "number") return !isNaN(value);
  if (typeof value === "string") return !isNaN(parseFloat(value));
  return false;
};

// Rule builder with common validations
export const rules: RuleBuilder = {
  required(message = "This field is required"): ValidationRule {
    return {
      validator: (value) => !isEmpty(value),
      message,
    };
  },

  email(message = "Please enter a valid email"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validateEmailRegex(value),
      message,
    };
  },

  password(message = "Password does not meet requirements"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validatePassword(value),
      message,
    };
  },

  name(message = "Please enter a valid name"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validateNameRegex(value),
      message,
    };
  },

  minLength(length: number, message?: string): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || String(value).length >= length,
      message: message || `Must be at least ${length} characters`,
      constraint: length,
    };
  },

  maxLength(length: number, message?: string): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || String(value).length <= length,
      message: message || `Must not exceed ${length} characters`,
      constraint: length,
    };
  },

  number(message = "Please enter a valid number"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || isNumber(value),
      message,
    };
  },

  genericName(message = "Please enter a valid name"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validateGenericNameRegex(value),
      message,
    };
  },

  lenientURL(message = "Please enter a valid URL"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validateURLRegex(value),
      message,
    };
  },

  domainName(message = "Please enter a valid domain name"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validateDomainNameRegex(value),
      message,
    };
  },

  ipAddress(message = "Please enter a valid IP address"): ValidationRule {
    return {
      validator: (value) => isEmpty(value) || validateIPAddressRegex(value),
      message,
    };
  },

  custom(validator: (value: any) => boolean, message: string): ValidationRule {
    return { validator, message };
  },
};
