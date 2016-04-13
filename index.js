'use strict';
var assign = require('object-assign');
var querystring = require('querystring');

var DEFAULT_QUERY = {
  sort: '',
  fields: '',
  pagination: {
    skip: 0,
    page: 1,
    limit: 0,
  },
};

function parseQuery(qs) {
  var rawQuery = assign({}, DEFAULT_QUERY, querystring.parse(qs));
  var parsedQuery;

  rawQuery.pagination = assign({}, DEFAULT_QUERY.pagination, rawQuery.pagination);

  parsedQuery = [
    parseSortingFrom,
    parseFieldsFrom,
    parsePaginationFrom,
  ]
  .map(function (transform) { return transform(rawQuery); })
  .reduce(function (query, field) { return assign({}, query, field); }, {});

  return parsedQuery;
}

function parseSortingFrom(q) {
  var sortFields = q.sort.split(',');
  var sort = sortFields.map(
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

function parseFieldsFrom(q) {
  var fields = q.fields.split(',');

  return { fields: fields };
}

function parsePaginationFrom(q) {
  var skip = parseInt(q.skip, 10) || DEFAULT_QUERY.pagination.skip;
  var page = parseInt(q.page, 10) || DEFAULT_QUERY.pagination.page;
  var limit = parseInt(q.limit, 10) || DEFAULT_QUERY.pagination.limit;

  return { pagination: { skip, page, limit } };
}

module.exports = parseQuery;
