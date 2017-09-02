"use strict";

var express = require('express'),					          	  // 加载express模块
    path = require('path'),                             // 引入路径核心模块
    bodyParser = require('body-parser'),                // 将表单post提交的body初始化成对象
    mongoose = require('mongoose'),                     // 引入mongoose模块
    logger = require('morgan'),                         // HTTP请求记录中间件
    fs = require('fs'),       							            // 文件读写模块
    cookieParser = require('cookie-parser'),
    session = require('express-session'),  				      // session依赖cookie模块
    mongoStore = require('connect-mongo')(session),		  // 对session进行持久化
    http = require('http'),
    // env = process.env.NODE_ENV || 'development'

    port = process.env.PORT || 3001,                    // 设置监听端口
    app = express(),                                    // 生成Web服务器实例
    dbUrl = 'mongodb://127.0.0.1/douban';               // 连接本地数据库及数据库名称

    // if (env === 'development') {
    //   dbUrl = 'mongodb://127.0.0.1/douban';               
    // }

mongoose.connect(dbUrl);                                // 连接本地数据库

app.set('views','./app/views/pages');                   // 视图文件根目录
app.set('view engine','jade');                          // 设置模板引擎
app.use(express.static(path.join(__dirname,'public'))); // 设置静态文件目录
app.locals.moment = require('moment'); // 引入moment模块并设置为app.locals属性,用来格式化时间

// 对application/x-www-form-urlencoded格式内容进行解析
app.use(bodyParser.urlencoded({ extended: true }));

// 对application/json格式进行解析
app.use(bodyParser.json());

// models loading
var models_path = __dirname + '/app/models';            // 模型所在路径

// 路径加载函数，加载各模型的路径,所以可以直接通过mongoose.model加载各模型 这样即使模型路径改变也无需更改路径
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);
      // 如果是文件
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      // 如果是文件夹则继续遍历
      }else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
};
walk(models_path);                                  // 加载模型所在路径

app.use(session({
	secret:'douban',                          // 设置的secret字符串，来计算hash值并放在cookie中
	resave: false,                                    // session变化才进行存储
	saveUninitialized: true,
	// 使用mongo对session进行持久化，将session存储进数据库中
	store: new mongoStore({
		url: dbUrl,                                     // 本地数据库地址
		collection: 'sessions'                          // 存储到mongodb中的字段名
	})
}));

var env = process.env.NODE_ENV || 'development';    // 获取当前环境

// 如果是开发环境
if (env === 'development') {
	app.set('showStackError',true);                   // 在屏幕上将错误信息打印出来
	app.use(logger(':method :url :status'));          // 显示请求的类型、路径和状态
	app.locals.pretty = true;                         // 源码格式化，不要压缩
	// mongoose.set('debug',true);                    // 显示数据库查询信息
}

require('./route/router')(app);                     // 路由控制

app.listen(port);	                                  // 服务器监听端口

console.log('douban started on port:' + port);
