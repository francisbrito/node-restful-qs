'use strict';
var parseRESTfulQuery = require('./');

var qs = 'age=29&name=Sabrina&link=friends&embed=hobbies,adventures';
var parsed = parseRESTfulQuery(qs);

console.log(JSON.stringify(parsed, null, 2));
