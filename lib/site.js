'use strict';

var moment = require('moment');

// A Site object is constructed from command line options or each row from a potential splice sites file.
function Site(obj) {
  this.date = moment().format('YYYYMMDDHHmmss');
  this.position = +obj.position;
  this.retry = 0;
  this.transcript = obj.transcript;
}

module.exports = Site;
