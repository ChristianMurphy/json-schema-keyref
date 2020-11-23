import { IQueryListing, ISchemaDefinition, lookup } from "../src";

describe.each<[string, unknown, ISchemaDefinition, IQueryListing]>([
  [
    "basic lookup",
    {
      a: "b"
    },
    {
      a: "$.a"
    },
    {
      a: [
        {
          path: ["$", "a"],
          value: "b"
        }
      ]
    }
  ],
  [
    "nested lookup",
    {
      a: "b",
      b: {
        a: "c",
        b: {
          a: "d"
        }
      }
    },
    {
      a: "$..a"
    },
    {
      a: [
        {
          path: ["$", "a"],
          value: "b"
        },
        {
          path: ["$", "b", "a"],
          value: "c"
        },
        {
          path: ["$", "b", "b", "a"],
          value: "d"
        }
      ]
    }
  ]
])("%s", (description, document, schema, expected) => {
  test(description, () => {
    expect(lookup(schema, document)).toEqual(expected);
  });
});
