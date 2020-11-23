import {
  IKeyKeyrefPair,
  IQueryResult,
  IValidationResult,
  referenceCheck
} from "../src";

function referenceCheckMacro(
  t: any,
  input: IKeyKeyrefPair<IQueryResult[]>,
  expected: IValidationResult
) {
  const result = referenceCheck(input.keyrefs, input.keys);
  t.deepEqual(result, expected);
}

describe.each<[string, IKeyKeyrefPair<IQueryResult[]>, IValidationResult]>([
  [
    "key can be found",
    {
      keyrefs: [
        {
          path: [],
          value: "a"
        }
      ],
      keys: [
        {
          path: [],
          value: "a"
        }
      ]
    },
    {
      errors: [],
      isValid: true
    }
  ],
  [
    "keys can be found in ordered lists",
    {
      keyrefs: [
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "b"
        },
        {
          path: [],
          value: "c"
        }
      ],
      keys: [
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "b"
        },
        {
          path: [],
          value: "c"
        }
      ]
    },
    {
      errors: [],
      isValid: true
    }
  ],
  [
    "keys can be found in opposting ordered lists",
    {
      keyrefs: [
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "b"
        },
        {
          path: [],
          value: "c"
        }
      ],
      keys: [
        {
          path: [],
          value: "c"
        },
        {
          path: [],
          value: "b"
        },
        {
          path: [],
          value: "a"
        }
      ]
    },
    {
      errors: [],
      isValid: true
    }
  ],
  [
    "keys can be found in random order lists",
    {
      keyrefs: [
        {
          path: [],
          value: "b"
        },
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "c"
        }
      ],
      keys: [
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "c"
        },
        {
          path: [],
          value: "b"
        }
      ]
    },
    {
      errors: [],
      isValid: true
    }
  ],
  [
    "no keys or references is valid",
    {
      keyrefs: [],
      keys: []
    },
    {
      errors: [],
      isValid: true
    }
  ],
  [
    "missing reference",
    {
      keyrefs: [
        {
          path: [],
          value: "c"
        }
      ],
      keys: [
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "b"
        }
      ]
    },
    {
      errors: [
        {
          path: [],
          value: "c"
        }
      ],
      isValid: false
    }
  ],
  [
    "multiple missing references",
    {
      keyrefs: [
        {
          path: [],
          value: "c"
        },
        {
          path: [],
          value: "d"
        },
        {
          path: [],
          value: "e"
        }
      ],
      keys: [
        {
          path: [],
          value: "a"
        },
        {
          path: [],
          value: "b"
        }
      ]
    },
    {
      errors: [
        {
          path: [],
          value: "c"
        },
        {
          path: [],
          value: "d"
        },
        {
          path: [],
          value: "e"
        }
      ],
      isValid: false
    }
  ]
])("%s", (description, input, expected) => {
  test(description, () => {
    expect(referenceCheck(input.keyrefs, input.keys)).toEqual(expected);
  });
});
