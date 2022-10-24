import test, { ExecutionContext } from "ava";
import {
  IKeyKeyrefPair,
  ISchemaDefinition,
  IValidationResult,
  validate,
} from "../src/index.js";

interface IDocumentAndSchema {
  document: Record<string, unknown>;
  schema: IKeyKeyrefPair<ISchemaDefinition>;
}

async function validateMacro(
  t: ExecutionContext,
  input: IDocumentAndSchema,
  expected: IValidationResult
) {
  t.deepEqual(await validate(input.document, input.schema), expected);
}

const input1: IDocumentAndSchema = {
  document: {
    a: "b",
  },
  schema: {
    keyrefs: {
      one: "$.a",
    },
    keys: {
      one: "$.a",
    },
  },
};
const expected1: IValidationResult = {
  errors: [],
  isValid: true,
};

test("basic passing document", validateMacro, input1, expected1);

const input2: IDocumentAndSchema = {
  document: {
    a: "b",
  },
  schema: {
    keyrefs: {
      one: "$.a",
    },
    keys: {},
  },
};
const expected2: IValidationResult = {
  errors: [{ path: ["$"], value: "one" }],
  isValid: false,
};

test("schema with missing key", validateMacro, input2, expected2);

const input3: IDocumentAndSchema = {
  document: {
    a: "b",
  },
  schema: {
    keyrefs: {
      one: "$.a",
    },
    keys: {
      one: "$.b",
    },
  },
};
const expected3: IValidationResult = {
  errors: [{ path: ["$", "a"], value: "b" }],
  isValid: false,
};

test("document with keyref and missing key", validateMacro, input3, expected3);
