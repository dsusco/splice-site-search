'use strict';

var
  fs = require('fs'),
  path = require('path'),
  handlebars = require('handlebars'),
  templateDir = __dirname + '/templates/',
  templates = {};

// For each file in `lib/templates/` compile a Handlebars template with that file's contents. Add a method to the module's exports, named as the file's basename with the compiled template as its function.
fs.readdirSync(templateDir).forEach(function forEachTemplate(template) {
  templates[path.basename(template, path.extname(template))] =
    handlebars.compile(
      fs.readFileSync(path.resolve(templateDir, template), { encoding: 'utf8' }),
      { noEscape: true }
    );
});

module.exports = templates;
