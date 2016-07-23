import {PathComponent, nodes} from 'jsonpath';

/**
 * Stores a pairing of keys and keyrefs
 *
 * @typeparam U - Object like or Array like structure  
 */
export interface IKeyKeyrefPair<U> {
  /**
   * References to keys
   */
  keyrefs: U;

  /**
   * Indentifier keys
   */
  keys: U;
}

/**
 * A single result from jsonpath node search 
 */
export interface IQueryResult {
  /**
   * Trace of nodes followed to find value
   */
  path: PathComponent[];

  /**
   * Value that exists at path location
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
   * Property is an identifier, value is a json path
   */
  [identifier: string]: string;
}

/**
 * Keeps list of [[IQueryResult]] associated with identifiers
 */
export interface IQueryListing {
  /**
   * Property is an identifier, value is a list of all associated [[IQueryResult]]
   */
  [identifier: string]: IQueryResult[];
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
 * @param keyrefs - references to a key
 * @param keys - identifier keys
 * @return validity status and any errors found
 */
export function referenceCheck(keyrefs: IQueryResult[], keys: IQueryResult[]): IValidationResult {
  keyrefs.sort(querySorter);
  keys.sort(querySorter);

  let isValid = true;
  const errors: IQueryResult[] = [];
  let keyIndex = 0;
  let keyrefIndex = 0;

  while (keyrefIndex < keyrefs.length) {
    const key = keys[keyIndex];
    const reference = keyrefs[keyrefIndex];

    if (keyIndex >= keys.length || reference.value < key.value) {
      keyrefIndex++;
      isValid = false;
      errors.push(reference);
    } else if (reference.value === key.value) {
      keyrefIndex++;
    } else {
      keyIndex++;
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
export function lookup(schema: IKeyKeyrefPair<ISchemaDefinition>, document: Object): IKeyKeyrefPair<IQueryListing> {
  const keys: IQueryListing = {};
  const keyrefs: IQueryListing = {};

  Object.keys(schema.keys).forEach(key => keys[key] = nodes(document, schema.keys[key]));
  Object.keys(schema.keyrefs).forEach(key => keyrefs[key] = nodes(document, schema.keyrefs[key]));

  return {
    keys,
    keyrefs,
  };
}
