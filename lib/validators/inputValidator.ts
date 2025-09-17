import {
  validateNameRegex,
  validateGenericNameRegex,
  validateEmailRegex,
  validatePassword,
  validateDomainNameRegex,
  validateURLRegex,
  validateIPAddressRegex,
} from "./regexValidators";

function noEmpty(data: any) {
  if (!data) return false;
  return data.toString().length > 0;
}

function number(data: any) {
  if (!data) return false;
  /* eslint no-restricted-globals: 0 */
  if (typeof data === "string") return !isNaN(parseFloat(data));
  return typeof data === "number";
}

function minLength(data: any, constraint: number) {
  return (data as string).toString().length >= constraint;
}

function maxLength(data: any, constraint: number) {
  return (data as string).toString().length <= constraint;
}

function exactLength(data: any, constraint: number) {
  return (data as string).toString().length === constraint;
}

function minValue(data: any, constraint: number) {
  if (typeof data === "string") return parseFloat(data) >= constraint;
  return data >= constraint;
}

function maxValue(data: any, constraint: number) {
  if (typeof data === "string") return parseFloat(data) <= constraint;
  return data <= constraint;
}

function exactValue(data: any, constraint: number) {
  const e = 1e9;
  if (typeof data === "string")
    return Math.abs(parseFloat(data) - constraint) <= e;
  return Math.abs(data - constraint) <= e;
}

function name(data: any) {
  if (!data) return false;
  return validateNameRegex(data);
}

function genericName(data: any) {
  if (!data) return false;
  return validateGenericNameRegex(data);
}

function email(data: any) {
  if (!data) return false;
  return validateEmailRegex(data);
}

function password(data: any) {
  if (!data) return false;
  return validatePassword(data);
}

function domainName(data: any) {
  if (!data) return false;
  return validateDomainNameRegex(data);
}

function websiteURL(data: any) {
  if (!data) return false;
  return validateURLRegex(data);
}

function IPAddress(data: any) {
  if (!data) return false;
  return validateIPAddressRegex(data);
}
