export interface IQueryResult {
  path: string[];
  value: string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: IQueryResult[];
}

function querySorter(a: IQueryResult, b: IQueryResult): number {
  if (a.value < b.value) {
    return -1;
  } else if (a.value > b.value) {
    return 1;
  } else {
    return 0;
  }
}

export function referenceCheck(keyrefs: IQueryResult[], keys: IQueryResult[]): IValidationResult {
  keyrefs.sort(querySorter);
  keys.sort(querySorter);

  let isValid = true;
  const errors: IQueryResult[] = [];
  let keyIndex = 0;

  for (const reference of keyrefs) {
    if (reference.value === keys[keyIndex].value) {
      continue;
    } else if (reference.value < keys[keyIndex].value) {
      if (keyIndex < keys.length) {
        keyIndex++;
      } else {
        isValid = false;
        errors.push(reference);
      }
    } else {
      isValid = false;
      errors.push(reference);
    }
  }

  return {
    isValid,
    errors,
  };
}
