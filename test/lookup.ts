import test, {ExecutionContext} from 'ava';
import {IQueryListing, ISchemaDefinition, lookup} from '../src';

interface IDocumentAndSchema {
  document: object;
  queries: ISchemaDefinition;
}

function lookupMacro(t: ExecutionContext, input: IDocumentAndSchema, expected: IQueryListing) {
  const result = lookup(input.queries, input.document);
  t.deepEqual(result, expected);
}

const input1: IDocumentAndSchema = {
  document: {
    a: 'b',
  },
  queries: {
    a: '$.a',
  },
};
const expected1: IQueryListing = {
  a: [
    {
      path: ['$', 'a'],
      value: 'b',
    },
  ],
};

test(
  'basic lookup',
  lookupMacro,
  input1,
  expected1,
);

const input2: IDocumentAndSchema = {
  document: {
    a: 'b',
    b: {
      a: 'c',
      b: {
        a: 'd',
      },
    },
  },
  queries: {
    a: '$..a',
  },
};
const expected2: IQueryListing = {
  a: [
    {
      path: ['$', 'a'],
      value: 'b',
    },
    {
      path: ['$', 'b', 'a'],
      value: 'c',
    },
    {
      path: ['$', 'b', 'b', 'a'],
      value: 'd',
    },
  ],
};

test(
  'nested lookup',
  lookupMacro,
  input2,
  expected2,
);
