'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      docs: {
        options: {
          base: 'docs/',
          livereload: true,
          open: true,
          port: 3000
        }
      }
    },
    docco: {
      lib: {
        options: {
          output: 'docs/'
        },
        src: ['lib/**/*.js']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        latedef: true,
        noarg: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        node: true
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      docco: {
        files: ['<%= docco.lib.src %>'],
        tasks: ['docco']
      },
      docs: {
        files: ['docs/**/*'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['<%= jshint.gruntfile.src %>'],
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: ['<%= jshint.lib_test.src %>'],
        tasks: ['jshint:lib_test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('docs', ['docco', 'connect', 'watch']);
};
