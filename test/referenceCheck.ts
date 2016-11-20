import test from 'ava';
import {IKeyKeyrefPair, IQueryResult, IValidationResult, referenceCheck} from '../src';

function referenceCheckMacro(t: any, input: IKeyKeyrefPair<IQueryResult[]>, expected: IValidationResult) {
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
  },
);

test(
  'keys can be found in ordered lists',
  referenceCheckMacro,
  {
    keyrefs: [
      {
        path: [],
        value: 'a',
      },
      {
        path: [],
        value: 'b',
      },
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
      {
        path: [],
        value: 'c',
      },
    ],
  },
  {
    errors: [],
    isValid: true,
  },
);

test(
  'keys can be found in opposting ordered lists',
  referenceCheckMacro,
  {
    keyrefs: [
      {
        path: [],
        value: 'a',
      },
      {
        path: [],
        value: 'b',
      },
      {
        path: [],
        value: 'c',
      },
    ],
    keys: [
      {
        path: [],
        value: 'c',
      },
      {
        path: [],
        value: 'b',
      },
      {
        path: [],
        value: 'a',
      },
    ],
  },
  {
    errors: [],
    isValid: true,
  },
);

test(
  'keys can be found in random order lists',
  referenceCheckMacro,
  {
    keyrefs: [
      {
        path: [],
        value: 'b',
      },
      {
        path: [],
        value: 'a',
      },
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
        value: 'c',
      },
      {
        path: [],
        value: 'b',
      },
    ],
  },
  {
    errors: [],
    isValid: true,
  },
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
  },
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
  },
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
  },
);
