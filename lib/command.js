'use strict';

var
  command = require('commander'),
  path = require('path'),
  pkg = require('../package.json');

command
  .version(pkg.version)
  .arguments('<file...>')
  .option('-t, --transcript <transcript>', 'single transcript')
  .option('-p, --position <integer>', 'position of single transcript',
    function (val) {
      val = parseInt(val, 10);

      return isNaN(val) ? 0 : val;
    })
  .option('-s, --sites <file>', 'potential splice sites file')
  .option('-d, --site-delimiter <delimiter>', 'potential splice sites file delimiter', String, '\t')
  .option('-o, --position-offset <integer>', "offset applied to a site's position",
    function (val, def) {
      val = parseInt(val, 10);

      return isNaN(val) ? def : val;
    }, 2)
  .option('-l, --sequence-length <integer>', "length of sequence from a site's position",
    function (val, def) {
      val = parseInt(val, 10);

      return isNaN(val) ? def : val;
    }, 15)
  .option('-m, --matches-dir <directory>', 'directory for matching reads files', path.normalize, '.');

command.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('Search the file(s) for a given transcript at its position.');
  console.log('');
  console.log('    $ %s [options] -t <transcript> -p <integer> <file...>', pkg.name);
  console.log('');
  console.log('Search the file(s) for each of the transcripts and their respective positions in a delimited potential splice sites file.');
  console.log('');
  console.log('    $ %s [options] -s <file> <file...>', pkg.name);
  console.log('');
});

command.parse(process.argv);

if (command.args.length < 1 ||
    !(command.sites !== undefined ||
      (command.transcript !== undefined &&
       command.position !== undefined))) {
  command.help();
}

module.exports = command;
