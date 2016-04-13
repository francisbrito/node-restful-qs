'use strict';

function parsePagination(opts) {
  return function parsePaginationFrom(q) {
    var parsedSkip = parseInt(q.skip, 10);
    var parsedPage = parseInt(q.page, 10);
    var parsedLimit = parseInt(q.limit, 10);

    var skip = isNaN(parsedSkip) ? opts.default.skip : parsedSkip;
    var page = isNaN(parsedPage) ? opts.default.page : parsedPage;
    var limit = isNaN(parsedLimit) ? opts.default.limit : parsedLimit;

    return { pagination: { skip: skip, page: page, limit: limit } };
  };
}

module.exports = parsePagination;
