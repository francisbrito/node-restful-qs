'use strict';
const querystring = require('querystring');

const DEFAULT_QUERY = {
  sort: '',
  fields: '',
};

function parseQuery(qs) {
  const rawQuery = Object.assign({}, DEFAULT_QUERY, querystring.parse(qs));
  const parsedQuery = [
    parseSortingFrom,
    parseFieldsFrom,
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

module.exports = parseQuery;
