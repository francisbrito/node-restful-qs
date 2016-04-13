'use strict';
function chain(fn1, fn2) {
  return function () {
    return fn2(fn1.apply(null, arguments));
  };
}

module.exports = chain;
