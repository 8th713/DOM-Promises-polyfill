'use strict';

module.exports = function(grunt) {
  var banner = '/*! <%= pkg.name %> <%= pkg.version %>\n' +
               ' * (c) 2013 8th713 <https://github.com/8th713>\n' +
               ' * License: MIT \n' +
               ' */\n';

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      development: {
        options: {
          banner: banner
        },
        src: 'src/Promise.js',
        dest: 'dist/Promise-<%= pkg.version %>.js'
      },
      references: {
        src: 'references/*.md',
        dest: 'reference.md'
      }
    },
    uglify: {
      production: {
        options: {
          preserveComments: 'some'
        },
        src: 'dist/Promise-<%= pkg.version %>.js',
        dest: 'dist/Promise-<%= pkg.version %>.min.js'
      }
    }
  });

  grunt.registerTask('doc', ['concat:references']);
  grunt.registerTask('build', ['concat:development', 'uglify']);
  grunt.registerTask('default', ['build']);
};
