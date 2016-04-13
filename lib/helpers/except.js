'use strict';
var assign = require('object-assign');

var not = require('./not');
var isInList = require('./is-in-list');

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

module.exports = except;
