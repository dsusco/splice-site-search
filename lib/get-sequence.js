'use strict';

var
  command = require('./command'),
  cheerio = require('cheerio'),
  Fasta = require('./fasta'),
  request = require('request'),
  templates = require('./templates');

function getSequence(site, callback) {
  // Get the contents of the FASTA file and add a new `Fasta` object to the `site` object. Add the `sequence` as well, which is a number of characters starting at `site.position`.
  function exportFastaCallback(error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(error, null);
    } else {
      var fasta = new Fasta(body);

      site.fasta = fasta;
      site.sequence = fasta.body.slice(
        site.position + command.positionOffset,
        site.position + command.positionOffset + command.sequenceLength
      );

      callback(null, site);
    }
  }

  // Get the `g`, `r` and `t` values from the transcript's Ensembl summary HTML (see below) and add them to the `site` object. These are used to generate the FASTA file URL, which is derived by passing in the `site` object to a Handelbars template. Determine if the transcript is on the forward or reverse strand, setting the `site.direction` value as appropriate. If it's indeterminable, callback with an error.
  function transcriptSummaryCallback(error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(error, null);
    } else {
      var $ = cheerio.load(body);

      site.g = $('#core_params input[name=g]').val();
      site.r = $('#core_params input[name=r]').val();
      site.t = $('#core_params input[name=t]').val();

      if ($('#main .rhs:contains("forward strand")').length) {
        site.direction = 'f';
      } else if ($('#main .rhs:contains("reverse strand")').length) {
        site.direction = 'r';
      } else {
        callback(new Error('Could not determine the direction of the transcript.'), null);
      }

      request(templates.export_fasta_url(site), exportFastaCallback);
    }
  }

  // Get the transcript's Ensembl summary with an HTTP request. The URL for this is derived by passing in the `site` object to a Handelbars template.
  request(templates.transcript_summary_url(site), transcriptSummaryCallback);
}

module.exports = getSequence;
