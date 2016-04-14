'use strict';

function parseQueryParamAsArray(p) {
  return function parseQueryParameter(q) {
    var query = {};
    query[p] = (q && q[p]) ? q[p].split(',') : [];

    return query;
  };
}

module.exports = parseQueryParamAsArray;
