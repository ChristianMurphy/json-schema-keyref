import test from 'ava';
import {referenceCheck, QueryResult, ValidationResult} from '../src'

interface RefenceCheckInput {
  key: QueryResult[],
  keyref: QueryResult[]
}

function referenceCheckMacro(t, input: RefenceCheckInput, expected: ValidationResult) {
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
        value: 'a'
      }
    ],
    keyref: [
      {
        path: [],
        value: 'a'
      }
    ]
  },
  {
    isValid: true,
    errors: []
  }
);

test(
  'no keys or references is valid',
  referenceCheckMacro,
  {
    key: [],
    keyref: []
  },
  {
    isValid: true,
    errors: []
  }
);

test(
  'missing reference',
  referenceCheckMacro,
  {
    key: [
      {
        path: [],
        value: 'a'
      },
      {
        path: [],
        value: 'b'
      }
    ],
    keyref: [
      {
        path: [],
        value: 'c'
      }
    ]
  },
  {
    isValid: false,
    errors: [
      {
        path: [],
        value: 'c'
      }
    ]
  }
);

test(
  'multiple missing references',
  referenceCheckMacro,
  {
    key: [
      {
        path: [],
        value: 'a'
      },
      {
        path: [],
        value: 'b'
      }
    ],
    keyref: [
      {
        path: [],
        value: 'c'
      },
      {
        path: [],
        value: 'd'
      },
      {
        path: [],
        value: 'e'
      }
    ]
  },
  {
    isValid: false,
    errors: [
      {
        path: [],
        value: 'c'
      },
      {
        path: [],
        value: 'd'
      },
      {
        path: [],
        value: 'e'
      }
    ]
  }
);