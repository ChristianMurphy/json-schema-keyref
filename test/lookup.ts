import {IKeyKeyrefPair, IQueryListing, ISchemaDefinition, lookup} from '../src';
import test from 'ava';

interface IDocumentAndSchema {
    document: any;
    schema: IKeyKeyrefPair<ISchemaDefinition>;
}

function lookupMacro(t, input: IDocumentAndSchema, expected: IKeyKeyrefPair<IQueryListing>) {
    const result = lookup(input.schema, input.document);
    t.deepEqual(result, expected);
}

const input1: IDocumentAndSchema = {
    document: {
        a: 'b',
    },
    schema: {
        keyrefs: {
            a: '$.a',
        },
        keys: {
            a: '$.a',
        },
    },
};
const expected1: IKeyKeyrefPair<IQueryListing> = {
    keyrefs: {
        a: [
            {
                path: ['$', 'a'],
                value: 'b',
            },
        ],
    },
    keys: {
        a: [
            {
                path: ['$', 'a'],
                value: 'b',
            },
        ],
    },
};

test(
    'basic lookup',
    lookupMacro,
    input1,
    expected1
);
