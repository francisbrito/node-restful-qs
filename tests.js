'use strict';
const test = require('tape');

const parseQuery = require('./');

test('it can parse `sort` query parameter', t => {
  const queryString = 'sort=-foo,bar,-baz';
  const expectedSorting = {
    foo: 'descending',
    bar: 'ascending',
    baz: 'descending',
  };
  const query = parseQuery(queryString);
  const actualSorting = query.sort;

  t.ok(actualSorting, 'parsed query should have `sort` field.');
  t.deepEqual(actualSorting, expectedSorting, '`sort` should equal expected sorting.');

  t.end();
});
