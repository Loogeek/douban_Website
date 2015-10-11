var Index = require('../app/controllers/index');  //首页模块路由控制器
var User = require('../app/controllers/user')	  //用户模块路由控制器
var Movie = require('../app/controllers/movie');   //电影模块路由控制器
var Comment = require('../app/controllers/comment'); //电影评论控制器
var Category = require('../app/controllers/category')//电影分类控制器
var City = require('../app/controllers/city')       //电影院分类控制器

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app){
	//pre handle user 预处理用户登录
	app.use(function(req,res,next){
		app.locals.user = req.session.user;   //将session中保存的用户名存储到本地变量中
		next();
	});

	//设置路由
	// index page 主页路由
	app.get('/',Index.index);
	//results
	app.get('/results',Index.search);


	// signup  用户注册路由
	app.get('/signup',User.showSignup);
	app.post('/user/signup/',User.signup);
	// signin  用户登陆路由
	app.get('/signin',User.showSignin);
	app.post('/user/signin',User.signin);
	// logout  用户登出路由
	app.get('/logout',User.logout);
	//userlist page 用户列表路由
	app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list);
	//list delete user 用户列表删除电影路由
	app.delete('/admin/user/list',User.del);

	//detail page 详细页面路由
	app.get('/movie/:id',Movie.detail);
	//admin page 后台录入路由
	/*
	User.signinRequired 用户登录控制
	User.adminRequired 用户权限控制
	 */
	app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
	//admin update movie 更新电影路由
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
	//admin post movie 后台录入路由
	app.post('/admin/movie', multipartMiddleware,User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
	//list page 电影列表路由
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
	//list delete movie 电影列表删除电影路由
	app.delete('/admin/movie/list',Movie.del);


	//Comment 用户评论路由
	app.post('/admin/comment',User.signinRequired,Comment.save);


	//Category 电影分类路由
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
	app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save);
	app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);
	//list delete category 电影分类列表删除电影路由
	app.delete('/admin/category/list',Category.del);	

	//City 城市电影院路由
	app.get('/admin/city/new',User.signinRequired,User.adminRequired,City.new);
	app.post('/admin/city',User.signinRequired,User.adminRequired,City.save);
	app.get('/admin/city/list',User.signinRequired,User.adminRequired,City.list);
	//list delete city 电影院分类列表删除电影院路由
	app.delete('/admin/city/list',City.del);

};

