'use strict';
var assert = require('assert');
var querystring = require('querystring');

var assign = require('object-assign');

var chain = require('./lib/helpers/chain');
var isEitherStringOrObject = require('./lib/helpers/is-either-string-or-object');

var parseFilter = require('./lib/parsers/filter');
var parsePagination = require('./lib/parsers/pagination');
var parseSortingFrom = require('./lib/parsers/sorting');
var parseQueryParamAsArray = require('./lib/parsers/as-array');

var DEFAULT_QUERY = {
  link: '',
  sort: '',
  embed: '',
  fields: '',
  pagination: {
    skip: 0,
    page: 1,
    limit: 0,
  },
};

var BLACK_LISTED_FILTERS = [
  'skip',
  'link',
  'page',
  'sort',
  'embed',
  'limit',
  'fields',
  'pagination',
];

function parseQuery(qs) {
  var rawQuery;
  var parsedQuery;
  var transformations = [
    chain(parseQueryParamAsArray('sort'), parseSortingFrom),
    parseQueryParamAsArray('fields'),
    parsePagination({ default: DEFAULT_QUERY.pagination }),
    parseQueryParamAsArray('embed'),
    parseQueryParamAsArray('link'),
    parseFilter({ blackList: BLACK_LISTED_FILTERS }),
  ];

  assert(qs, '`qs` parameter is missing.');
  assert(isEitherStringOrObject(qs), '`qs` parameter must be either a string or an object.');

  qs = typeof qs === 'string' ? querystring.parse(qs) : qs;

  rawQuery = assign({}, DEFAULT_QUERY, qs);
  rawQuery.pagination = assign({}, DEFAULT_QUERY.pagination, rawQuery.pagination);

  parsedQuery = transformations
  .map(function (transform) { return transform(rawQuery); })
  .reduce(function (query, field) { return assign({}, query, field); }, {});

  return parsedQuery;
}

module.exports = parseQuery;
