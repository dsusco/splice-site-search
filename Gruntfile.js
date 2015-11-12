'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
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
        src: ['index.js', 'lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
};
