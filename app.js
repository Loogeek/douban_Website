var express = require('express'),					          	// 加载express模块
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    fs = require('fs'),       							          // 文件读写模块
    cookieParser = require('cookie-parser'),
    session = require('express-session'),  				    // session依赖cookie模块
    mongoStore = require('connect-mongo')(session),		// 用来对session进行持久化
    http = require('http'),

    port = process.env.PORT || 3000,                  // 设置监听端口
    app = express(),                                  // 生成Web服务器实例

    dbUrl = 'mongodb://127.0.0.1/imooc';              // 连接本地数据库及数据库名称

mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath);
      }
    })
}
walk(models_path);


app.set('views','./app/views/pages');                   // 视图文件根目录
app.set('view engine','jade');                          // 设置模板引擎
app.use(express.static(path.join(__dirname,'public'))); // 设置静态文件目录
app.locals.moment = require('moment');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(session({
	secret:'imooc',
	resave: false,
	saveUninitialized: true,
	// 使用mongo对session进行持久化，将session存储进数据库中
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

var env = process.env.NODE_ENV || 'development';

if ('development' === env) {
	// 在屏幕上讲信息打印出来
	app.set('showStackError',true);
	// 显示的信息
	app.use(logger(':method :url :status'));
	// 源码格式化，不要压缩
	app.locals.pretty = true;
	// mongoose.set('debug',true);
}


require('./route/router')(app);                     // 路由控制

app.listen(port);	                                  // 服务器监听端口

console.log('douban started on port:' + port);
