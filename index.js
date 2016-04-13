'use strict';
var assign = require('object-assign');
var querystring = require('querystring');

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
    parseSortingFrom,
    parseFieldsFrom,
    parsePaginationFrom,
    parseEmbeddingFrom,
    parseLinkFrom,
    parseFilterFrom,
  ];

  qs = typeof qs === 'string' ? querystring.parse(qs) : qs;

  rawQuery = assign({}, DEFAULT_QUERY, qs);
  rawQuery.pagination = assign({}, DEFAULT_QUERY.pagination, rawQuery.pagination);

  parsedQuery = transformations
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
  var parsedSkip = parseInt(q.skip, 10);
  var parsedPage = parseInt(q.page, 10);
  var parsedLimit = parseInt(q.limit, 10);

  var skip = isNaN(parsedSkip) ? DEFAULT_QUERY.pagination.skip : parsedSkip;
  var page = isNaN(parsedPage) ? DEFAULT_QUERY.pagination.page : parsedPage;
  var limit = isNaN(parsedLimit) ? DEFAULT_QUERY.pagination.limit : parsedLimit;

  return { pagination: { skip: skip, page: page, limit: limit } };
}

function parseEmbeddingFrom(q) {
  var embed = q.embed.split(',');

  return {
    embed: embed,
  };
}

function parseLinkFrom(q) {
  var link = q.link.split(',');

  return {
    link: link,
  };
}

function parseFilterFrom(q) {
  return except(BLACK_LISTED_QUERY_PARAMETERS, q);
}

function except(blackListedKeys, q) {
  var keys = Object.keys(q);
  var keysWithoutBlacklisted = keys.filter(not(isInList(blackListedKeys)));
  var queryWithoutBlacklisted = keysWithoutBlacklisted.reduce(function (result, k) {
    var query = {};
    query[k] = q[k];

    return assign({}, result, query);
  }, {});

  return { filter: queryWithoutBlacklisted };
}

function not(fn) {
  return function () {
    return !fn.apply(null, arguments);
  };
}

function isInList(list) {
  return function (item) {
    return !!list.filter(function (li) {
      return li === item;
    })[0];
  };
}

module.exports = parseQuery;
