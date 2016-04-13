'use strict';

function not(fn) {
  return function () {
    return !fn.apply(null, arguments);
  };
}

module.exports = not;
