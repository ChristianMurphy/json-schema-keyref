# JSON Schema KeyRef

[![npm version](https://img.shields.io/npm/v/json-schema-keyref.svg)](https://www.npmjs.com/package/json-schema-keyref)
[![build status](https://github.com/ChristianMurphy/json-schema-keyref/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/ChristianMurphy/json-schema-keyref/actions/workflows/CI.yml)

## About

This is an extension to the standard JSON Schema. It allows for validating the
references to remote values, actually have the value that is being referenced.

See [Example](#example) for a sample use case.

## Installation

Install from npm

``` sh
npm install --save json-schema-keyref
```

## Usage

``` js
const fs = require('fs');
const jsonSchemaKeyref = require('json-schema-keyref');

const document = JSON.parse(fs.readSync('document.json'));
const schema = JSON.parse(fs.readSync('schema.json'));

// Validate document against standard JSON schema using tv4 or another library

const result = jsonSchemaKeyref.validate(document, schema);

console.log(result); //=> {"errors": [], "isValid": true}
```

## Example

Below is a User and Transaction database. Where users have an `id` and `name`.
And transactions are `from` one user `id`, `to` another user `id`, with an
`amount`.

Using key reference validator, transaction 2 would be flagged because user 3
does not exist in the data.

Data:

``` json
{
  "users": [
    {
      "id": 1,
      "name": "user 1"
    },
    {
      "id": 2,
      "name": "user 2"
    }
  ],
  "transactions": [
    {
      "from": 1,
      "to": 2,
      "amount": 1.00
    },
    {
      "from": 3,
      "to": 1,
      "amount": 99.99
    }
  ]
}
```

Schema:

``` json
{
  "key": {
    "to": "$.users[*].id",
    "from": "$.users[*].id"
  },
  "keyref": {
    "to": "$.transactions[*].to",
    "from": "$.transactions[*].from"
  },

  "title": "Employee and Transaction Database",
  "type": "object",
  "properties": {
    "users": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "name"
      ]
    },
    "transactions": {
      "type": "object",
      "properties": {
        "to": {
          "type": "integer"
        },
        "from": {
          "type": "integer"
        },
        "amount": {
          "type": "number"
        }
      }
    }
  },
  "required": [
    "users",
    "transactions"
  ]
}
```
