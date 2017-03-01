import test from 'ava';
import {IKeyKeyrefPair, ISchemaDefinition, IValidationResult, validate} from '../src';

interface IDocumentAndSchema {
  document: object;
  schema: IKeyKeyrefPair<ISchemaDefinition>;
}

function validateMacro(t: any, input: IDocumentAndSchema, expected: IValidationResult) {
  return validate(input.document, input.schema);
};

const input1: IDocumentAndSchema = {
  document: {
    a: 'b',
  },
  schema: {
    keyrefs: {
      one: '$.a',
    },
    keys: {
      one: '$.a',
    },
  },
};
const expected1: IValidationResult = {
  errors: [],
  isValid: true,
};

test(
  'basic passing document',
  validateMacro,
  input1,
  expected1,
);

const input2: IDocumentAndSchema = {
  document: {
    a: 'b',
  },
  schema: {
    keyrefs: {
      one: '$.a',
    },
    keys: {},
  },
};
const expected2: IValidationResult = {
  errors: [{path: ['$'], value: 'a'}],
  isValid: false,
};

test(
  'document with missing key',
  validateMacro,
  input2,
  expected2,
);

const input3: IDocumentAndSchema = {
  document: {
    a: 'b',
  },
  schema: {
    keyrefs: {
      one: '$.a',
    },
    keys: {
      one: '$.b',
    },
  },
};
const expected3: IValidationResult = {
  errors: [{path: ['$', 'a'], value: 'b'}],
  isValid: false,
};

test(
  'document with keyref and missing key',
  validateMacro,
  input3,
  expected3,
);
