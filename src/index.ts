export interface QueryResult {
  path: string[],
  value: string
}

export interface ValidationResult {
  isValid: boolean,
  errors: QueryResult[]
}

function querySorter(a: QueryResult, b: QueryResult): number {
  if (a.value < b.value) {
    return -1;
  } else if (a.value > b.value) {
    return 1;
  } else {
    return 0;
  }
}

export function referenceCheck(keyrefs: QueryResult[], keys: QueryResult[]): ValidationResult {
  keyrefs.sort(querySorter);
  keys.sort(querySorter);
  
  let isValid = true;
  const errors: QueryResult[] = []; 
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
    errors
  };
}