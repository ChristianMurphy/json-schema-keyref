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
 * A single result from jsonpath node searched
 * 
 * Example:
 * ``` json
 * {
 *   "path": ["$", "items", 0],
 *   "value": "example"
 * }
 * ```
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
 * 
 * Example:
 * ``` json
 * {
 *   "isValid": false,
 *   "errors": [
 *     {
 *       "path": ["$", "propery"],
 *       "value": "example"
 *     }
 *   ]
 * }
 * ```
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
 *     "identifier": "$.some.query",
 *     "anotherIdentifier": "$.another.query"
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
 * 
 * Example:
 * ``` json
 * {
 *   "identifier": [
 *     {"path": ["$", "property"], "value": "a"}
 *   ],
 *   "anotherIdentifier": [
 *     {"path": ["$", "another", "property"], "value": "b"}
 *   ]
 * }
 * ```
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
 * searches for a set of jsonpath queries.
 *
 * @param queries - identifier and jsonpath pairings to look up
 * @param document - JSON document that will be searched
 * @return identifier and results pairings found in the document
 */
export function lookup(queries: ISchemaDefinition, document: Object): IQueryListing {
  const results: IQueryListing = {};
  Object.keys(queries).forEach(identifier => results[identifier] = nodes(document, queries[identifier]));
  return results;
}
