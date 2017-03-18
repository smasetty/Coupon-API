module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      compile: {
        options: {},
        files: {
          'public/stylesheets/style.css': 'app/stylesheets/style.styl'
        }
      }
    },
    
    uglify: {
      minify: {
        options: {
          reserveDOMProperties: true,
        },
        files: [{
            expand: true,
            cwd: 'app/js',
            src: '**/*.js',
            dest: 'public/js',
            ext: '.min.js'
        }]
      } 
    },
    
    watch : {
      css: {
        files: ['gruntfile.js', 'app/stylesheets/*'],
        tasks: ['stylus'],
        options: {
          livereload: {
            host: '192.168.1.140',
            port: 10000
          }
        }
      },
      js: {
         files: ['gruntfile.js', 'app/js/*'],
         tasks: ['uglify'],
        options: {
          livereload:{
            host:'192.168.1.140',
            port: 10000
          }
        }
      },
      html: {
         files: ['app/views/*'],
         tasks: [],
        options: {
          livereload:{
            host:'192.168.1.140',
            port: 10000
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['stylus', 'watch']);
  grunt.registerTask('publish', ['stylus', 'uglify']);
};
