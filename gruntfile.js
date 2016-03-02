'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);       // 加载全部grunt插件

  grunt.initConfig({                        // 定义的任务
    watch: {
      jade: {
        files: ['views/**']
      },
      js: {
        files: ['public/scripts/**', 'test/**', 'app/**/*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: ['public/sass/**'],
        tasks: ['sass']
      }
    },
    // 检查文件语法等问题
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['node_modules/**']
      },
      build: ['public/scripts/**', 'test/**', 'app/**/*.js']
    },
    // Sass编译
    sass: {
      dist: {                                      // 编译任务
        options: {
          style: 'compact',                        // CSS输出格式
          update: true,                            // 仅对改变的Sass执行编译
          cacheLocation: 'public/sass/.sass-cache' // sass编译缓存存储路径
        },
        files: [{
          expand: true,
          cwd: 'public/sass/',                     // sass路径
          src: ['*.scss', '**/*.scss'],            // 执行编译sass文件
          dest: 'public/css/',                     // 输出CSS路径
          ext: '.css'                              // CSS文件格式
        }]
      }
    },
    // js压缩
    uglify: {
      development: {
        files: {
          'public/build/admin.min.js': 'public/js/admin.js',
          'public/build/detail.min.js': [
            'public/js/detail.js'
          ]
        }
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',  // Script that nodemon runs and restarts when changes are detected.
        options: {
          // file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    // 测试任务
    mochaTest:{
      options:{
        reporter:'spec',                      // 测试报告的格式
      },
      src:['test/**/*.js']
    },
    // 并行执行任务
    concurrent: {
      tasks: ['jshint', 'watch', 'nodemon', 'sass', 'uglify'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.option('force', true)                 // 便于开发时不要因为某些语法错误中断整个任务

  // 注册默认任务
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('test', ['mochaTest']);  // 单元测试任务
}
