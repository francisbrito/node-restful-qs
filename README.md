# RESTful Query String Parser [![Build Status](https://travis-ci.org/francisbrito/node-restful-qs.svg?branch=master)](https://travis-ci.org/francisbrito/node-restful-qs) [![npm version](https://badge.fury.io/js/restful-qs.svg)](https://badge.fury.io/js/restful-qs)
> Parse querystrings into queries for your RESTful services.

## Install

`$ npm i restful-qs`

## Usage

String parsing:
```js
'use strict';
var parseRESTfulQuery = require('./');

var qs = 'age=29&name=Sabrina&link=friends&embed=hobbies,adventures';
var parsed = parseRESTfulQuery(qs);

console.log(JSON.stringify(parsed, null, 2));
```

Inside a web server:
```js
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
```

## API

### `parseRESTfulQuery(qs)`
Parses a string or object into a RESTful query.

#### `qs`
Type: `String|Object`

Query to parse into a RESTful query.
