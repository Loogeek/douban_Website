module.exports = function(grunt) {

  grunt.initConfig({  //定义的任务
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        //tasks: ['jshint'],
        options: {
          livereload: true   //文件改动重新启动服务
        }
      },
      uglify: {
        files: ['public/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['public/sass/*.scss','public/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          nospawn: true
        }
      }
    },
    //检查文件语法等问题
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/libs/**/*.js']
      },
      all: ['public/js/**/*.js', 'test/**/*.js', 'app/**/*.js']
    },
    sass: {
      dist: {
        files: {
          'public/css/music/music_index.css': 'public/sass/music/music_index.scss',
          'public/css/movie/movie_index.css': 'public/sass/movie/movie_index.scss',
          'public/css/header.css': 'public/sass/header.scss',
        }
      }
    },
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
        script: 'app.js',  //Script that nodemon runs and restarts when changes are detected.
        options: {
          //file: 'app.js',
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

    mochaTest:{
      options:{
        reporter:'spec',
      },
      src:['test/**/*.js']
    },

    concurrent: {
      tasks: ['nodemon', 'watch', 'sass', 'uglify', 'jshint'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  grunt.option('force', true) //便于开发时不要因为某些语法错误中断整个任务

  // 加载插件
  grunt.loadNpmTasks('grunt-contrib-watch');  //监控文件变化，主要检测文件有变化就会重新执行里面监控的任务
  grunt.loadNpmTasks('grunt-nodemon');  //实时监听入口文件（app.js)
  grunt.loadNpmTasks('grunt-concurrent');//针对慢任务  如Sass、优化构建时间，跑多个阻塞任务
  grunt.loadNpmTasks('grunt-mocha-test'); //单元测试模块
  grunt.loadNpmTasks('grunt-contrib-uglify');//JS压缩
  grunt.loadNpmTasks('grunt-contrib-jshint');//用于检测文件格式、语法等问题模块
  grunt.loadNpmTasks('grunt-contrib-sass'); //使用Sass构建模块
  //注册默认任务
  grunt.registerTask('default', ['concurrent']);

  grunt.registerTask('test', ['mochaTest']);   //单元测试任务
}
