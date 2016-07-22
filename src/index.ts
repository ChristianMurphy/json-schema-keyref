import {PathComponent, nodes} from 'jsonpath';

/**
 * Stores a pairing of keys and refences to keys
 *
 * @typeparam U - Object like or Array like structure  
 */
export interface IKeyKeyrefPair<U> {
  /**
   * references to keys
   */
  keyrefs: U;

  /**
   * indentifier keys
   */
  keys: U;
}

/**
 * A single result from jsonpath node search 
 */
export interface IQueryResult {
  /**
   * trace of nodes followed to find value
   */
  path: PathComponent[];

  /**
   * value that exists at path location
   */
  value: any;
}

/**
 * Feedback format
 */
export interface IValidationResult {
  /**
   * Overall validity status of document
   */
  isValid: boolean;

  /**
   * Any errors found
   */
  errors: IQueryResult[];
}

/**
 * Describes how keys and key references can be declared in a schema
 *
 * Example:
 * ``` json
 * {
 *   "keys": {
 *     "identifier": "jsonpath",
 *     "anotherIdentifier": "jsonpath"
 *   }
 * }
 * ```
 */
export interface ISchemaDefinition {
  /**
   * property is an identifier, value is a json path
   */
  [key: string]: string;
}

/**
 * Sorting mechanism for [[IQueryResult]]
 *
 * @param a - first element
 * @param b - second element
 * @return -1 for a less than b, 0 for a equals b, 1 for a greater than b
 */
function querySorter(a: IQueryResult, b: IQueryResult): number {
  if (a.value < b.value) {
    return -1;
  } else if (a.value > b.value) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Checks that all keyrefs have an associated key
 *
 * @param keyref - references to a key
 * @param key - identifier keys
 * @return validity status and any errors found
 */
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

/**
 * Extracts key and keyref paths from schema, and locates values in document.
 *
 * @param schema - JSON schema with key and keyref set at top level
 * @param document - JSON document that will be searched
 * @return all keys and keyrefs in document
 */
export function lookup(schema: IKeyKeyrefPair<ISchemaDefinition>, document: Object): IKeyKeyrefPair<IQueryResult[][]> {
  const keys = Object
    .keys(schema.keys)
    .map(key => nodes(document, schema.keys[key]));
  const keyrefs = Object
    .keys(schema.keyrefs)
    .map(keyref => nodes(document, schema.keyrefs[keyref]));

  return {
    keys,
    keyrefs,
  };
}
