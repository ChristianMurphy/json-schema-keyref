import { nodes, PathComponent } from "jsonpath";

/**
 * Stores a pairing of keys and keyrefs
 *
 * @typeparam U - Object like or Array like structure
 *
 * Example:
 * ``` json
 * {
 *   "keyrefs": {},
 *   "keys": {}
 * }
 * ```
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
  value: string | number | boolean;
}

/**
 * Feedback format
 *
 * Example:
 * ``` json
 * {
 *   "errors": [
 *     {
 *       "path": ["$", "propery"],
 *       "value": "example"
 *     }
 *   ],
 *   "isValid": false
 * }
 * ```
 */
export interface IValidationResult {
  /**
   * Any errors found
   */
  errors: IQueryResult[];

  /**
   * Overall validity status of document
   */
  isValid: boolean;
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
 *
 * Example:
 * ``` js
 * querySorter({"path": [], "value": "a"}, {"path": [], "value": "b"}); //=> -1
 * querySorter({"path": [], "value": true}, {"path": [], "value": true}); //=> 0
 * querySorter({"path": [], "value": 2}, {"path": [], "value": 1}); //=> 1
 * ```
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
 *
 * Example:
 * ``` js
 * var keyrefs = [{"path": ["$", "some", "path"], "value": "example"}];
 * var keys = [{"path": ["$", "some", "other", "path"], "value": "example"}];
 *
 * var result = referenceCheck(keyrefs, keys);
 *
 * console.log(result); //=> {"isValid": true, "errors": []}
 * ```
 */
export function referenceCheck(
  keyrefs: IQueryResult[],
  keys: IQueryResult[]
): IValidationResult {
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
    errors,
    isValid,
  };
}

/**
 * Searches for a set of jsonpath queries.
 *
 * @param queries - identifier and jsonpath pairings to look up
 * @param document - JSON document that will be searched
 * @return identifier and results pairings found in the document
 *
 * Example:
 * ``` js
 * var queries = [{"one": "$.a"}, {"two": "$.b"}];
 * var document = {"a": "something", "b": "something else"};
 *
 * var result = lookup(queries, document);
 *
 * console.log(result);
 * // {
 * //   "one": [{"path": ["$", "a"], "value": "something"}],
 * //   "two": [{"path": ["$", "b"], "value": "something else"}]
 * // }
 * ```
 */
export function lookup(
  queries: ISchemaDefinition,
  document: Record<string, unknown>
): IQueryListing {
  const results: IQueryListing = {};
  Object.keys(queries).forEach(
    (identifier) => (results[identifier] = nodes(document, queries[identifier]))
  );
  return results;
}

/**
 * Validates a JSON document against a JSON schema with keyref and key constraints defined
 *
 * @param document - document to be validated
 * @param schema - schema with keyref and key groups defined
 *
 * Example:
 * ``` js
 * var document = {"a": "value", "b": "value"};
 * var schema = {
 *   "keyrefs": {"identifier": "$.a"},
 *   "keys": {"identifier": "$.b"}
 * };
 *
 * var result = validate(document, schema);
 *
 * console.log(result); //=> {"errors": [], "isValid": true}
 * ```
 */
export function validate(
  document: Record<string, unknown>,
  schema: IKeyKeyrefPair<ISchemaDefinition>
): IValidationResult {
  const keyrefs = lookup(schema.keyrefs, document);
  const keys = lookup(schema.keys, document);

  return (
    Object.keys(keyrefs)
      // Check keyrefs and keys for a single identifier group
      .map((identifier) => {
        // Ensure keyrefs identifier has a matching keys identifier
        if (!keys[identifier]) {
          return {
            errors: [{ path: ["$"], value: identifier }],
            isValid: false,
          };
        }
        // Check that keyrefs have matching keys
        return referenceCheck(keyrefs[identifier], keys[identifier]);
      })
      // Merge results from all identifiers together
      .reduce(
        (overall, current) => {
          return {
            errors: overall.errors.concat(current.errors),
            isValid: overall.isValid && current.isValid,
          };
        },
        {
          errors: [],
          isValid: true,
        }
      )
  );
}
