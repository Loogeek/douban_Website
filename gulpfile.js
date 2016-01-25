var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    minifycss = require('gulp-minify-css'),           //压缩css
    del = require('del');                              //清除文件
    // sass = require('gulp-ruby-sass'),                 //sass的编译
    // autoprefixer = require('gulp-autoprefixer'),      //自动添加css前缀
    // jshint = require('gulp-jshint'),                  //js代码校验
    // uglify = require('gulp-uglify'),                  //压缩js代码
    // imagemin = require('gulp-imagemin'),              //压缩图片
    // rename = require('gulp-rename'),                  //给文件重命名
    // concat = require('gulp-concat'),                  //合并js文件
    // notify = require('gulp-notify'),                  //更改提醒
    // cache = require('gulp-cache'),                    //图片缓存，只有图片替换了才压缩
    // livereload = require('gulp-livereload'),          //自动刷新页面
    // nodemon = require('gulp-nodemon')                 //实时监听库

var path = {
  src: {
    scripts: ['public/scripts/**/**/*.js','app/**/**/*.js'],
    sass: ['public/sass/*.scss','public/sass/**/*.scss'],
    images: ['public/images/**'],
    build: ['public/build/**']
  },
  dest: {
    scripts: 'public/build/scripts',
    sass: 'public/build/css',
    images: 'public/build/images',
  }
};

//将scss文件转成css文件并压缩
gulp.task('sass', function() {
  return plugins.rubySass(path.src.sass,{
           style: 'compressed'
         })
         .pipe(plugins.watch(path.src.sass))
         .on('error', plugins.rubySass.logError)
         // .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
         .pipe(plugins.rename({suffix:'.min'}))
         // .pipe(minifycss())
         .pipe(gulp.dest(path.dest.sass))
         // .pipe(plugins.notify({ message: 'Sass task complete' }));
});

//js代码校验及压缩
gulp.task('scripts', function() {
  return gulp.src(path.src.scripts)
    .pipe(plugins.watch(path.src.scripts))
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(path.dest.scripts))
    // .pipe(plugins.notify({ message: 'Scripts task complete' }));
});

// //图片压缩
gulp.task('images', function() {
  return gulp.src(path.src.images)
    .pipe(plugins.watch(path.src.images))
    .pipe(plugins.cache(plugins.imagemin({ progressive: true, interlaced: true })))
    .pipe(gulp.dest(path.dest.images))
    // .pipe(plugins.notify({ message: 'Images task complete' }));
});

//清除文件
gulp.task('clean', function(cb) {
  del(path.src.build, cb());
});

//实时监听入口文件
gulp.task('nodemon',function() {
  plugins.nodemon({ script: 'app.js',
    ignore: ['README.md', 'node_modules/**'],
    tasks: ['sass','scripts','images']
  })
});

//默认任务
gulp.task('default',['nodemon']);
