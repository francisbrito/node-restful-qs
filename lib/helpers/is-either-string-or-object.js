'use strict';
function isEitherStringOrObject(qs) {
  return typeof qs === 'string' || typeof qs === 'object';
}

module.exports = isEitherStringOrObject;
