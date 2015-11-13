# Splice Site Search

This is a time-saving/automation tool for searching for potential splice sites in files (such as SAM files). Given a transcript and a position (or a delimited file containing a set of these per row) it searches the [December 2013 archive of the Ensembl Genome Browser](//dec2013.archive.ensembl.org/) for the transcript and gets its cDNA FASTA sequence. The sequence found at the given position is then searched for in the files, any matching lines are written to a new file.

## Installation

This application is written in JavaScript and requires [Node.js](//nodejs.org/) to be installed in order to run. If Node isn't installed the easiest thing to do is download the binaries for your operating system and place them somewhere in your path.

With Node.js installed you can either clone this repository, or download and extract the [ZIP](https://github.com/dsusco/splice-site-search/archive/master.zip):

    $ git clone https://github.com/dsusco/splice-site-search.git

Next, install the module globally with:

    $ npm install -g splice-site-search/

If you run into problems here you might to run the command with `sudo`. If you don't have sudo access you either install Node.js yourself, place a symbolic link to `splice-site-search/index.js` somewhere in your path, or use the program with `node splice-site-search/index.js` instead.

To confirm that the program is working, run the following to display the help information:

    $ splice-site-search -h

## Usage

The program can be run in two ways:

### Single Transcript and Position

This searches the files given for the sequence found for the given transcript and position.

    $ splice-site-search [options] -t <transcript> -p <integer> <files...>

### Delimited File of Transcripts and Positions

This searches the files given for the sequences found for each of the given transcripts and positions in the potential splice sites file.

    $ splice-site-search [options] -s <file> <files...>

### Options

Additional options are described in the command's help information:

    $ splice-site-search -h
