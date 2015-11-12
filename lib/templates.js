'use strict';

var
  fs = require('fs'),
  path = require('path'),
  handlebars = require('handlebars'),
  templateDir = __dirname + '/templates/',
  templates = {};

fs.readdirSync(templateDir).forEach(function (template) {
  templates[path.basename(template, path.extname(template))] =
    handlebars.compile(
      fs.readFileSync(path.resolve(templateDir, template), { encoding: 'utf8' }),
      { noEscape: true }
    );
});

module.exports = templates;
