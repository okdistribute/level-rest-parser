module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    complexity: {
      generic: {
        src: ['app/**/*.js'],
        options: {
          errorsOnly: false,
          cyclometric: 6,       // default is 3
          halstead: 16,         // default is 8
          maintainability: 100  // default is 100
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'app/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      js: {
        files: ['**/*.js'],
        tasks: ['default'],
        options: {
          nospawn: true
        }
      }
    },
    jssemicoloned: {
      files: ['*.js', 'lib/**/*.js', 'test/**/*.js']
    },
  });

  grunt.loadNpmTasks('grunt-jssemicoloned');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['complexity', 'jshint']);
  grunt.registerTask('ci', ['complexity', 'jshint']);
};