'use strict';

var
  command = require('commander'),
  path = require('path'),
  pkg = require('../package.json');

function errorMessage(message) {
  console.log('');
  console.log('  error: %s', message);
  console.log('');
  process.exit(1);
}

// Add command line parsing, with options and arguments, to the module's exports.
command
  .version(pkg.version)
  .arguments('<files...>')
  .option('-t, --transcript <transcript>', 'single transcript')
  .option('-p, --position <integer>', 'position of single transcript',
    function positionOption(val) {
      val = parseInt(val, 10);

      if (isNaN(val) || val < 0) {
        errorMessage('position must be 0 or a positive integer.');
      }

      return val;
    })
  .option('-s, --sites <file>', 'potential splice sites file')
  .option('-d, --site-delimiter <delimiter>', 'potential splice sites file delimiter', String, '\t')
  .option('-o, --position-offset <integer>', "offset applied to a site's position",
    function positionOffsetOption(val) {
      val = parseInt(val, 10);

      if (isNaN(val)) {
        errorMessage('position offset must be an integer.');
      }

      return val;
    }, 2)
  .option('-l, --sequence-length <integer>', "length of sequence from a site's position",
    function sequenceLengthOption(val) {
      val = parseInt(val, 10);

      if (isNaN(val) || val < 1) {
        errorMessage('sequence length must be a positive integer.');
      }

      return val;
    }, 15)
  .option('-m, --matches-dir <directory>', 'directory to write matching reads files', path.normalize, '.');

// Provide some examples of how the command line program can be used.
command.on('--help', function onCommanderHelp() {
  console.log('  Examples:');
  console.log('');
  console.log('Search the file(s) for a given transcript at its position.');
  console.log('');
  console.log('    $ %s [options] -t <transcript> -p <integer> <files...>', pkg.name);
  console.log('');
  console.log('Search the file(s) for each of the transcripts and their respective positions in a delimited potential splice sites file.');
  console.log('');
  console.log('    $ %s [options] -s <file> <files...>', pkg.name);
  console.log('');
});

command.parse(process.argv);

// If a command is not valid, display the help text and exit the program.
if (command.args.length < 1 ||
    !(command.sites !== undefined ||
      (command.transcript !== undefined && command.position !== undefined))) {
  command.help();
}

module.exports = command;
