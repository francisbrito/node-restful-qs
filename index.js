'use strict';
const querystring = require('querystring');

function parseQuery(qs) {
  const rawQuery = querystring.parse(qs);
  const parsedQuery = parseSortingFrom(rawQuery);

  return parsedQuery;
}

function parseSortingFrom(q) {
  const sortFields = q.sort.split(',');

  return {
    sort: sortFields.map(
      sf => {
        const sortFieldName = getFieldName(sf);
        const sortFieldDirection = getSortDirection(sf);

        return { [sortFieldName]: sortFieldDirection };
      }
    )
    .reduce((query, f) => Object.assign({}, query, f), {}),
  };
}

function getFieldName(sf) {
  return sf[0] === '-' ? sf.slice(1) : sf;
}

function getSortDirection(sf) {
  return sf[0] === '-' ? 'descending' : 'ascending';
}

module.exports = parseQuery;
