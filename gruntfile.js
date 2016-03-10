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
        tasks: ['sass', 'cssmin']
      },
      uglify: {
        files: ['public/scripts/js/**'],
        tasks: ['uglify']
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
          sourcemap: 'none',                       // 取消sourcemap
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
        options: {
          report: 'gzip'                            // 采用gzip压缩
        },
        files: [{
          expand: true,
          cwd: 'public/scripts/js/',
          src: ['*.js', '**/*.js'],
          dest: 'public/libs/scripts/js/',
          ext: '.min.js'
        }]
      }
    },
    // css压缩
    cssmin: {
      options: {
        report: 'gzip'                            // 采用gzip压缩
      },
      target: {
        files: [{
          expand: true,
          cwd: 'public/css/',
          src: ['*.css', '**/*.css'],
          dest: 'public/libs/css',
          ext: '.min.css'
        }]
      }
    },
    // 图片压缩
    imagemin: {
      dist: {
        options: {
            optimizationLevel: 3          //定义 PNG 图片优化水平
        },
        files: [{
            expand: true,
            cwd: 'public/images/',
            src: ['**/*.{png,jpg,jpeg,ico}'], // 优化 img 目录下所有 png/jpg/jpeg/ico 图片
            dest: 'public/libs/images'
        }]
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',                      // 执行文件
        options: {
          ignore: ['README.md', 'node_modules/**', '.DS_Store'],
          ext: 'js',
          debug: true,
          delay: 1,
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
      tasks: ['jshint', 'sass', 'uglify', 'cssmin', 'imagemin', 'watch', 'nodemon'],
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
