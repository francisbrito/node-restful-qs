'use strict';
var except = require('../helpers/except');

function parseFilter(opts) {
  return function parseFilterFrom(q) {
    return except(opts.blackList, q);
  };
}

module.exports = parseFilter;
