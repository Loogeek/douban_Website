var User = require('../models/user');		  //用户数据模型

// signup  用户注册路由
exports.signup = function(req,res){
	var _user = req.body.user;    
	//使用findOne对数据库中user进行查找
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		//如果用户名已存在
		if(user){
			return res.redirect('/signin');
		}else{
			//数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
			user = new User(_user);  //生成用户数据
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/');
			});
		}
	});
};

exports.showSignup = function(req,res){
	res.render('signup',{
		title:'注册页面'
	});	
};

// signin  用户登陆路由
exports.signin = function(req,res){
	var _user = req.body.user;    
	var name = _user.name;
	var password = _user.password;

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			console.log('用户不存在');
			return res.redirect('/signup');
		}
		//使用user实例方法对用户名密码进行比较
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			//密码匹配
			if(isMatch){
				req.session.user = user;   //将当前登录用户名保存到session中
				res.redirect('/');
			}else{
				//账户名和密码不匹
				res.redirect('/signin');
			}
		});		
	});
};

exports.showSignin = function(req,res){
	res.render('signin',{
		title:'登录页面'
	});	
};

// logout  用户登出路由
exports.logout = function(req,res){
	delete req.session.user;
	res.redirect('/');
};

//userlist page 用户列表路由
exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'imooc 用户列表页',
			users:users
		});		
	});	
};

// midware for user
// 用户登录控制
exports.signinRequired = function(req,res,next){
	var _user = req.session.user;

	if(!_user){
		res.redirect('/signin');
	}
	next();
};

// 用户权限控制
exports.adminRequired = function(req,res,next){
	var _user = req.session.user;

	if(_user.role <= 10){
		res.redirect('/signin');
	}
	next();
};

//list delete user 用户列表删除电影路由
exports.del = function(req,res){
	//获取客户端Ajax发送的URL值中的id值
	var id  = req.query.id;
	if(id){
		//如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		User.remove({_id:id},function(err,user){
			if(err){
				console.log(err);
			}
			res.json({success:1});
		});
	}
};