'use strict';

function Fasta(string) {
  string = string.trim().split(/[\f\n\r\t\v]+/);

  this.header = string.shift();
  this.body = string.join('');
}

module.exports = Fasta;
