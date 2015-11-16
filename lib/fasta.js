'use strict';

// A Fasta object is constructed from the contents of a FASTA file. The contents are tokenized by newline and carriage returns, the first token is the header and everything else is the body.
function Fasta(string) {
  string = string.trim().split(/[\n\r]+/);

  this.header = string.shift();
  this.body = string.join('');
}

module.exports = Fasta;
