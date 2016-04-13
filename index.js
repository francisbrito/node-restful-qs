'use strict';
var assert = require('assert');
var querystring = require('querystring');

var assign = require('object-assign');

var chain = require('./lib/helpers/chain');
var except = require('./lib/helpers/except');
var isEitherStringOrObject = require('./lib/helpers/is-either-string-or-object');

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

var BLACK_LISTED_QUERY_PARAMETERS = [
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
    parsePaginationFrom,
    parseQueryParamAsArray('embed'),
    parseQueryParamAsArray('link'),
    parseFilterFrom,
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

function parseSortingFrom(q) {
  var sort = q.sort.map(
    function (sf) {
      var sortFieldName = getFieldName(sf);
      var sortFieldDirection = getSortDirection(sf);
      var sorting = {};
      sorting[sortFieldName] = sortFieldDirection;

      return sorting;
    }
  )
  .reduce(function (query, f) { return assign({}, query, f); }, {});

  return { sort: sort };
}

function getFieldName(sf) {
  return sf[0] === '-' ? sf.slice(1) : sf;
}

function getSortDirection(sf) {
  return sf[0] === '-' ? 'descending' : 'ascending';
}

function parseQueryParamAsArray(p) {
  return function parseQueryParameter(q) {
    var query = {};
    query[p] = q[p].split(',');

    return query;
  };
}

function parsePaginationFrom(q) {
  var parsedSkip = parseInt(q.skip, 10);
  var parsedPage = parseInt(q.page, 10);
  var parsedLimit = parseInt(q.limit, 10);

  var skip = isNaN(parsedSkip) ? DEFAULT_QUERY.pagination.skip : parsedSkip;
  var page = isNaN(parsedPage) ? DEFAULT_QUERY.pagination.page : parsedPage;
  var limit = isNaN(parsedLimit) ? DEFAULT_QUERY.pagination.limit : parsedLimit;

  return { pagination: { skip: skip, page: page, limit: limit } };
}

function parseFilterFrom(q) {
  return except(BLACK_LISTED_QUERY_PARAMETERS, q);
}

module.exports = parseQuery;
