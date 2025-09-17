// Core field validation types
export interface ValidationRule {
  validator: (value: any, constraint?: any) => boolean;
  message: string;
  constraint?: any;
}

export interface FieldValidation {
  /** Current value to validate */
  value: any;
  /** Rules to apply */
  rules: ValidationRule[];
  /** Optional field name for error messages */
  name?: string;
  /** Whether to validate on input */
  validateOnInput?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
}

export interface ValidationState {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: string[];
}

// Common validator types that match our existing validators
export type ValidatorType =
  | "required"
  | "email"
  | "password"
  | "name"
  | "genericName"
  | "number"
  | "minLength"
  | "maxLength"
  | "exactLength"
  | "minValue"
  | "maxValue"
  | "exactValue"
  | "domainName"
  | "url"
  | "ipAddress";

// Rule builder interface for better DX
export interface RuleBuilder {
  required(message?: string): ValidationRule;
  email(message?: string): ValidationRule;
  password(message?: string): ValidationRule;
  name(message?: string): ValidationRule;
  minLength(length: number, message?: string): ValidationRule;
  maxLength(length: number, message?: string): ValidationRule;
  number(message?: string): ValidationRule;
  genericName(message?: string): ValidationRule;
  lenientURL(message?: string): ValidationRule;
  domainName(message?: string): ValidationRule;
  ipAddress(message?: string): ValidationRule;
  custom(validator: (value: any) => boolean, message: string): ValidationRule;
}

// Optional form-level types for convenience
export interface FormValidation {
  fields: Record<string, FieldValidation>;
  onSubmit?: (valid: boolean) => void;
}
