'use strict';

function isInList(list) {
  return function (item) {
    return !!list.filter(function (li) {
      return li === item;
    })[0];
  };
}

module.exports = isInList;
