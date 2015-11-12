'use strict';

var
  command = require('./command'),
  cheerio = require('cheerio'),
  Fasta = require('./fasta'),
  request = require('request'),
  templates = require('./templates');

function getSequence(site, callback) {
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

  function transcriptSummaryCallback(error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(error, null);
    } else {
      var $ = cheerio.load(body);

      site.g = $('#core_params input[name=g]').val();
      site.r = $('#core_params input[name=r]').val();
      site.t = $('#core_params input[name=t]').val();

      request(templates.export_fasta_url(site), exportFastaCallback);
    }
  }

  request(templates.transcript_summary_url(site), transcriptSummaryCallback);
}

module.exports = getSequence;
