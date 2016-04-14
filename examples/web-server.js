'use strict';
var url = require('url');
var http = require('http');

var parseRESTfulQuery = require('../');

http.createServer(function (request, response) {
  var query = url.parse(request.url).query || 'sort=foo';
  var restfulQuery = parseRESTfulQuery(query);
  var out = JSON.stringify(restfulQuery, null, 2);

  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(out),
  });
  response.end(out);
})
.listen(3000);

console.log('listening at http://localhost:3000/');
