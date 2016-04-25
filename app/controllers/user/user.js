'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),                // 用户数据模型
    ccap = require('ccap')(),                     // 加载验证码模块
    captcha;                                      // 申明验证码变量

/* 用户注册及登录框中验证码生成器控制器 */
exports.captcha = function(req,res) {
  if(req.url === '/favicon.ico') {
    return res.end('');
  }
  var ary = ccap.get();
  captcha = ary[0];                               // 生成验证码
  res.end(captcha);
};

/* 用户注册控制器 */
exports.signup = function(req,res) {
  var user = req.body.user,                       // 获取post请求中的用户数据
      _user = {};
  user = user.split('&');
  for(var i = 0; i < user.length; i++) {
    var p = user[i].indexOf('='),
        name = user[i].substring(0,p),
        value = user[i].substring(p+1);
    _user[name] = value;
  }

  var _name = _user.name || '',
      _captcha = _user.captcha || '';

  // 使用findOne对数据库中user进行查找
  User.findOne({name:_name},function(err,user) {
    if(err) {
      console.log(err);
    }
    // 如果用户名已存在
    if(user) {
      return res.json({data:0});
    }else{
      // 验证码存在
      if (captcha) {
        if(_captcha.toLowerCase() !== captcha.toLowerCase()) {
          res.json({data:1});                // 输入的验证码不相等
        }else {
          // 数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
          user = new User(_user);            // 生成用户数据
          user.save(function(err,user) {
            if(err){
              console.log(err);
            }
            req.session.user = user;         // 将当前登录用户名保存到session中
            return res.json({data:2});       // 注册成功
          });
        }
      }
    }
  });
};

/* 用户注册页面渲染控制器 */
exports.showSignup = function(req,res) {
  res.render('user/signup', {
    title:'注册页面',
    logo:'movie'
  });
};

/* 用户登陆控制器 */
exports.signin = function(req,res) {
  var user = req.query.user || '',        // 获取get请求中的用户数据
      _user = {};
  user = user.split('&');
  for(var i = 0; i < user.length; i++) {
    var p = user[i].indexOf('='),
        name = user[i].substring(0,p),
        value = user[i].substring(p+1);
    _user[name] = value;
  }
  var _name = _user.name || '',
      _password = _user.password || '',
      _captcha = _user.captcha || '';
  User.findOne({name:_name},function(err,user) {
    if(err){
      console.log(err);
    }
    if(!user) {
      return res.json({data:0});                  // 用户不存在
    }
    // 使用user实例方法对用户名密码进行比较
    user.comparePassword(_password,function(err,isMatch) {
      if(err) {
        console.log(err);
      }
      // 密码匹配
      if(isMatch) {
        // 验证码存在
        if (captcha) {
          if(_captcha.toLowerCase() !== captcha.toLowerCase()) {
            res.json({data:2});                     // 输入的验证码不相等
          }else {
            req.session.user = user;                // 将当前登录用户名保存到session中
            return res.json({data:3});              // 登录成功
          }
        }
      }else {
        // 账户名和密码不匹
        return res.json({data:1});
      }
    });
  });
};

/* 用户登录页面渲染控制器 */
exports.showSignin = function(req,res)  {
  res.render('user/signin',{
    title:'登录页面',
    logo:'movie'
  });
};

/* 用户登出控制器 */
exports.logout = function(req,res) {
  delete req.session.user;
  res.redirect('/');
};

/* 用户列表页面渲染控制器 */
exports.list = function(req,res) {
  User.fetch(function(err,users) {
    if(err) {
      console.log(err);
    }
    res.render('user/user_list', {
      title:'豆瓣电影用户列表页',
      logo:'movie',
      users:users
    });
  });
};

/* 用户列表删除电影控制器 */
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id  = req.query.id;
  if(id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    User.remove({_id:id},function(err) {
      if(err){
        console.log(err);
      }
      res.json({success:1});              // 删除成功
    });
  }
};

/* 用户是否登陆判断中间件 */
exports.signinRequired = function(req,res,next) {
  var _user = req.session.user;
  if(!_user) {
    return res.redirect('/signin');
  }
  next();
};

/* 用户权限中间件 */
exports.adminRequired = function(req,res,next) {
  var _user = req.session.user;
  if(_user && _user.role <= 10){
    return res.redirect('/signin');
  }
    next();
};
