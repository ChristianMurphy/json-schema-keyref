import {IQueryResult, IValidationResult, referenceCheck} from '../src';
import test from 'ava';

interface IRefenceCheckInput {
  key: IQueryResult[];
  keyref: IQueryResult[];
}

function referenceCheckMacro(t, input: IRefenceCheckInput, expected: IValidationResult) {
  const result = referenceCheck(input.keyref, input.key);
  t.deepEqual(result, expected);
}

test(
  'key can be found',
  referenceCheckMacro,
  {
    key: [
      {
        path: [],
        value: 'a',
      },
    ],
    keyref: [
      {
        path: [],
        value: 'a',
      },
    ],
  },
  {
    errors: [],
    isValid: true,
  }
);

test(
  'no keys or references is valid',
  referenceCheckMacro,
  {
    key: [],
    keyref: [],
  },
  {
    errors: [],
    isValid: true,
  }
);

test(
  'missing reference',
  referenceCheckMacro,
  {
    key: [
      {
        path: [],
        value: 'a',
      },
      {
        path: [],
        value: 'b',
      },
    ],
    keyref: [
      {
        path: [],
        value: 'c',
      },
    ],
  },
  {
    errors: [
      {
        path: [],
        value: 'c',
      },
    ],
    isValid: false,
  }
);

test(
  'multiple missing references',
  referenceCheckMacro,
  {
    key: [
      {
        path: [],
        value: 'a',
      },
      {
        path: [],
        value: 'b',
      },
    ],
    keyref: [
      {
        path: [],
        value: 'c',
      },
      {
        path: [],
        value: 'd',
      },
      {
        path: [],
        value: 'e',
      },
    ],
  },
  {
    errors: [
      {
        path: [],
        value: 'c',
      },
      {
        path: [],
        value: 'd',
      },
      {
        path: [],
        value: 'e',
      },
    ],
    isValid: false,
  }
);
