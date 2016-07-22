import {IKeyKeyrefPair, IQueryResult, IValidationResult, referenceCheck} from '../src';
import test from 'ava';

function referenceCheckMacro(t, input: IKeyKeyrefPair<IQueryResult[]>, expected: IValidationResult) {
  const result = referenceCheck(input.keyrefs, input.keys);
  t.deepEqual(result, expected);
}

test(
  'key can be found',
  referenceCheckMacro,
  {
    keyrefs: [
      {
        path: [],
        value: 'a',
      },
    ],
    keys: [
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
    keyrefs: [],
    keys: [],
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
    keyrefs: [
      {
        path: [],
        value: 'c',
      },
    ],
    keys: [
      {
        path: [],
        value: 'a',
      },
      {
        path: [],
        value: 'b',
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
    keyrefs: [
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
    keys: [
      {
        path: [],
        value: 'a',
      },
      {
        path: [],
        value: 'b',
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
