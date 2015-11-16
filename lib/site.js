'use strict';

var
  moment = require('moment'),
  path = require('path');

// A Site object is constructed from command line options or each row from a potential splice sites file.
function Site(obj) {
  this.date = moment().format('YYYYMMDDHHmmss');
  this.file = path.basename(obj.file);
  this.position = +obj.position;
  this.transcript = obj.transcript;
}

module.exports = Site;
