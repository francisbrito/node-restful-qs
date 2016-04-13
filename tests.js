'use strict';
var test = require('tape');

var parseQuery = require('./');

test('it can parse `sort` query parameter.', function (t) {
  var queryString = 'sort=-foo,bar,-baz';
  var expectedSorting = {
    foo: 'descending',
    bar: 'ascending',
    baz: 'descending',
  };
  var subject = parseQuery(queryString);
  var actualSorting = subject.sort;

  t.ok(actualSorting, 'parsed query should have `sort` field.');
  t.deepEqual(actualSorting, expectedSorting, '`sort` should equal expected sorting.');

  t.end();
});

test('it can parse `fields` query parameter.', function (t) {
  var queryString = 'fields=foo,bar,baz';
  var expectedFields = [
    'foo', 'bar', 'baz',
  ];
  var subject = parseQuery(queryString);
  var actualFields = subject.fields;

  t.ok(actualFields, 'parsed query should have `fields` field.');
  t.deepEqual(actualFields, expectedFields, '`fields` should equal expected projection.');

  t.end();
});

test('it can parse `pagination` query parameters.', function (t) {
  var queryString = 'skip=1&page=2&limit=3';
  var expectedPagination = {
    skip: 1,
    page: 2,
    limit: 3,
  };
  var subject = parseQuery(queryString);
  var actualPagination = subject.pagination;

  t.ok(actualPagination, 'parsed query should have `pagination` field.');
  t.deepEqual(
    actualPagination, expectedPagination, '`pagination` should equal expected pagination.'
  );

  t.end();
});

test('it can parse `embed` query parameter.', function (t) {
  var queryString = 'embed=foo,bar,baz';
  var expectedEmbed = [
    'foo', 'bar', 'baz',
  ];
  var subject = parseQuery(queryString);
  var actualEmbed = subject.embed;

  t.ok(actualEmbed, 'parsed query should have `embed` field.');
  t.deepEqual(actualEmbed, expectedEmbed, '`embed` should equal expected embedding.');

  t.end();
});

test('it can parse `link` query parameter.', function (t) {
  var queryString = 'link=foo,bar,baz';
  var expectedLink = [
    'foo', 'bar', 'baz',
  ];
  var subject = parseQuery(queryString);
  var actualLink = subject.link;

  t.ok(actualLink, 'parsed query should have `link` field.');
  t.deepEqual(actualLink, expectedLink, '`link` should equal expected linking.');

  t.end();
});

test('it can parse all other query parameters as `filter`.', function (t) {
  var queryString = 'name=sabrina&description=free+spirit&limit=10';
  var expectedFilter = {
    name: 'sabrina',
    description: 'free spirit',
  };
  var subject = parseQuery(queryString);
  var actualFilter = subject.filter;

  t.ok(actualFilter, 'parsed query should have `filter` field.');
  t.deepEqual(actualFilter, expectedFilter, '`filter` should equal expected filter.');

  t.end();
});

test('it can parse an object.', function (t) {
  var q = {
    age: '29',
    name: 'sabrina',
    link: 'foo',
    page: '0',
    skip: '0',
    sort: '-foo,bar,-baz',
    embed: 'foo',
    limit: '0',
    fields: 'foo,bar,baz',
  };
  var expectedQuery = {
    link: ['foo'],
    sort: {
      foo: 'descending',
      bar: 'ascending',
      baz: 'descending',
    },
    embed: ['foo'],
    fields: ['foo', 'bar', 'baz'],
    filter: {
      age: '29',
      name: 'sabrina',
    },
    pagination: {
      page: 0,
      skip: 0,
      limit: 0,
    },
  };
  var actualQuery = parseQuery(q);

  t.ok(actualQuery, 'should be able to parse object query.');
  t.deepEqual(actualQuery, expectedQuery, 'object query should equal expected query.');

  t.end();
});

test('it throws if neither an object or a string is provided.', function (t) {
  t.throws(
    parseQuery, /`qs` parameter is missing/, 'it should throw if `qs` parameter is missing.'
  );

  t.throws(
    function () {
      parseQuery(42);
    },
    /`qs` parameter must be either a string or an object/,
    'it should throw if `qs` parameter is not a string or object.'
  );

  t.end();
});
