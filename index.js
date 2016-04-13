'use strict';
const querystring = require('querystring');

const DEFAULT_QUERY = {
  sort: '',
  fields: '',
  pagination: {
    skip: 0,
    page: 1,
    limit: 0,
  },
};

function parseQuery(qs) {
  const rawQuery = Object.assign({}, DEFAULT_QUERY, querystring.parse(qs));
  rawQuery.pagination = Object.assign({}, DEFAULT_QUERY.pagination, rawQuery.pagination);

  const parsedQuery = [
    parseSortingFrom,
    parseFieldsFrom,
    parsePaginationFrom,
  ]
  .map(transform => transform(rawQuery))
  .reduce((query, field) => Object.assign({}, query, field), {});

  return parsedQuery;
}

function parseSortingFrom(q) {
  const sortFields = q.sort.split(',');
  const sort = sortFields.map(
    sf => {
      const sortFieldName = getFieldName(sf);
      const sortFieldDirection = getSortDirection(sf);

      return { [sortFieldName]: sortFieldDirection };
    }
  )
  .reduce((query, f) => Object.assign({}, query, f), {});

  return { sort };
}

function getFieldName(sf) {
  return sf[0] === '-' ? sf.slice(1) : sf;
}

function getSortDirection(sf) {
  return sf[0] === '-' ? 'descending' : 'ascending';
}

function parseFieldsFrom(q) {
  const fields = q.fields.split(',');

  return { fields };
}

function parsePaginationFrom(q) {
  const skip = parseInt(q.skip, 10) || DEFAULT_QUERY.pagination.skip;
  const page = parseInt(q.page, 10) || DEFAULT_QUERY.pagination.page;
  const limit = parseInt(q.limit, 10) || DEFAULT_QUERY.pagination.limit;

  return { pagination: { skip, page, limit } };
}

module.exports = parseQuery;
