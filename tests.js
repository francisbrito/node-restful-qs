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
  const subject = parseQuery(queryString);
  const actualSorting = subject.sort;

  t.ok(actualSorting, 'parsed query should have `sort` field.');
  t.deepEqual(actualSorting, expectedSorting, '`sort` should equal expected sorting.');

  t.end();
});

test('it can parse `fields` query parameter.', t => {
  const queryString = 'fields=foo,bar,baz';
  const expectedFields = [
    'foo', 'bar', 'baz',
  ];
  const subject = parseQuery(queryString);
  const actualFields = subject.fields;

  t.ok(actualFields, 'parsed query should have `fields` field.');
  t.deepEqual(actualFields, expectedFields, '`fields` should equal expected projection.');

  t.end();
});

test('it can parse `pagination` query parameters.', t => {
  const queryString = 'skip=1&page=2&limit=3';
  const expectedPagination = {
    skip: 1,
    page: 2,
    limit: 3,
  };
  const subject = parseQuery(queryString);
  const actualPagination = subject.pagination;

  t.ok(actualPagination, 'parsed query should have `pagination` field.');
  t.deepEqual(
    actualPagination, expectedPagination, '`pagination` should equal expected pagination.'
  );

  t.end();
});
