function nullableNumberValidator(value: any): boolean {
  return value === null || typeof value === 'number';
}

function nullableStringValidator(value: any): boolean {
  return value === null || typeof value === 'string';
}

function nullableObjectValidator(value: any): boolean {
  return value === null || typeof value === 'object';
}

function nullableBooleanValidator(value: any): boolean {
  return value === null || typeof value === 'boolean';
}

function nullableSymbolValidator(value: any): boolean {
  return value === null || typeof value === 'symbol';
}

export {
  nullableNumberValidator,
  nullableStringValidator,
  nullableObjectValidator,
  nullableBooleanValidator,
  nullableSymbolValidator,
};
