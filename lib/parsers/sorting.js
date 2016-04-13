'use strict';
var assign = require('object-assign');

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


module.exports = parseSortingFrom;
