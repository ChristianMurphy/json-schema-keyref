import {PathComponent, nodes} from 'jsonpath';

export interface IKeysAndKeyrefPair<U> {
  keyrefs: U;
  keys: U;
}

export interface IQueryResult {
  path: PathComponent[];
  value: any;
}

export interface IValidationResult {
  isValid: boolean;
  errors: IQueryResult[];
}

export interface ISchemaDefinition {
  [key: string]: string;
}

export interface IJSONSchema extends IKeysAndKeyrefPair<ISchemaDefinition> {}
export interface IReferenceTable extends IKeysAndKeyrefPair<IQueryResult[][]> {}

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

export function lookup(schema: IJSONSchema, data: Object): IReferenceTable {
  const keys = Object
    .keys(schema.keys)
    .map(key => nodes(data, schema.keys[key]));
  const keyrefs = Object
    .keys(schema.keyrefs)
    .map(keyref => nodes(data, schema.keyrefs[keyref]));

  return {
    keys,
    keyrefs,
  };
}
