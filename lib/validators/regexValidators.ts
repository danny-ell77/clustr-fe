/**
 * Emails must match a standard email format and contain no more than 100
 * characters.
 */
const validateEmailRegex = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLocaleLowerCase()) && email.length <= 100;
};

/**
 * Names (firstName, lastName) must be no more than  30 characters,
 * no single character can repeat more than 2 times and must contain
 * alphabetical characters only.
 */
const validateNameRegex = (name: string) => {
  const reAlpha = /^[a-zA-Z]{2}(([',. -][a-zA-Z])?[a-zA-Z]*)*$/;
  const reRepeating = /(.)\1{2}/;
  return reAlpha.test(name) && !reRepeating.test(name) && name.length <= 30;
};

/**
 * Verify that a name contains alphanumeric characters only and no one character
 * repeats more than twice. Total number of characters shall not exceed 100.
 * Common symbols used in company/entity names ([',. -]) are also allowed.
 */
const validateGenericNameRegex = (name: string) => {
  const reAlpha = /^[a-zA-Z0-9]{2}(([a-zA-Z0-9\s])?[a-zA-Z0-9\s]*)*$/;
  const reRepeating = /(.)\1{2}/;
  return reAlpha.test(name) && !reRepeating.test(name) && name.length <= 100;
};

/**
 * URL used primary as company website url (in the Business Information) of an
 * an account must match standard URL format and be no more than 200 characters.
 */
const validateURLRegex = (url: string) => {
  const re = /^(https?:\/\/(?:www\.)?[^\s.]+\.\S{2,}|www\.[^\s.]+\.\S{2,})$/;
  return re.test(url.toLocaleLowerCase()) && url.length <= 200;
};

/**
 * Validates that a string matches standard domain name format.
 */
const validateDomainNameRegex = (domainName: string) => {
  const re = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
  return re.test(domainName.toLocaleLowerCase()) && domainName.length <= 30;
};

/**
 * Checks if a string contains at least one uppercase character.
 * Required for validating user passwords during new account registration or
 * password change.
 */
const hasUppercase = (password: string) => {
  const re = /(?=.*[A-Z])/;
  return re.test(password);
};

/**
 * Checks if a string contains at least one lowercase character.
 * Required for validating user passwords during new account registration or
 * password change.
 */
const hasLowercase = (password: string) => {
  const re = /(?=.*[a-z])/;
  return re.test(password);
};

/**
 * Checks if a string contains at least one number.
 * Required for validating user passwords during new account registration or
 * password change.
 */
const hasNumber = (password: string) => {
  const re = /(?=.*[0-9])/;
  return re.test(password);
};

/**
 * Checks if a string contains at least one special  character.
 * Required for validating user passwords during new account registration or
 * password change.
 */
const hasSpecialCharacter = (password: string) => {
  const re = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;
  return re.test(password);
};

/**
 * Checks if a string is at least 8 characters.
 * Required for validating user passwords during new account registration or
 * password change.
 */
const hasAtLeastEightChar = (password: string) => {
  const re = /(?=.{8,})/;
  return re.test(password);
};

/**
 * Password must not contain any one character repeating more than 3 times or
 * a substring of 01234567890 of length greater than or equal to 4.
 */
const hasNoRepeatingOrConsecutiveChar = (password: string) => {
  if (password === '') {
    return false;
  }

  const reRepeating = /(.)\1{3}/;
  const reConsecutive = /(?=.*(0123|1234|2345|3456|4567|5678|6789|7890)+)/;

  return !reRepeating.test(password) && !reConsecutive.test(password);
};

/**
 * Verify that a string meets BigCommand strong password policy. A password must
 * have at least one uppercase, one lowercase, one number, one special character.
 * In additional, it must be at least eight characters in length with no repeating
 * or consecutive numerical characters.
 */
const validatePassword = (password: string) => (
  !(!hasUppercase(password)
    || !hasLowercase(password)
    || !hasNumber(password)
    || !hasSpecialCharacter(password)
    || !hasAtLeastEightChar(password)
    || !hasNoRepeatingOrConsecutiveChar(password)));

/**
 * Validates that a string is a valid IPV4 Address.
 */
const validateIPAddressRegex = (ip: string) => {
  const re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return re.test(ip) && ip.length <= 15;
};

export {
  validateEmailRegex,
  validateNameRegex,
  validatePassword,
  validateGenericNameRegex,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialCharacter,
  hasAtLeastEightChar,
  hasNoRepeatingOrConsecutiveChar,
  validateURLRegex,
  validateDomainNameRegex,
  validateIPAddressRegex,
};
