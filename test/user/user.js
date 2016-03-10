'use strict';

var crypto = require('crypto'),                    // 用户随机生成字符串
    bcrypt = require('bcrypt');                    // 对密码加密

// 获取随机字符串，用来测试user
function getRandomString(len) {
  if (!len) {
    len = 16; // 默认长度为16
  }
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

var should = require('should'),                     // 测试框架
    app = require('../../app'),                     // 入口文件
    mongoose = require('mongoose'),
    // 通过app文件中的walk函数加载了各模型的路径,所以可以直接通过mongoose.model加载用户模型，这样即使模型路径改变也无需更改路径
    User = mongoose.model('User'),
    user;

// 测试用例
describe('<Unit Test', function() {
  describe('Model User:', function() {
  	// 测试用例开始前
  	before(function(done) {
  	  user = {
    		name: getRandomString(),// 长度16的字符串
    		password: 'password'
  	  };
  	  done();
  	});
	  // 测试前确认用户getRandomString是不存在的
  	describe('Before Method save', function() {
  	  // it代表一个测试用例，测试随机生成一个未存储用户名
  	  it('should begin without test user', function(done) {
    		User.find({name: user.name}, function(err, users) {
    		  users.should.have.length(0);
    		  done();
    		});
  	  });
  	});
  	// 测试用户保存时不会出问题
  	describe('User save', function() {
  	  it('should save without problems', function(done) {
    		var _user = new User(user);

    		_user.save(function(err) {            // 对新生成的用户保存
    		  should.not.exist(err);              // 判断保存过程不存在错误
    		  _user.remove(function(err) {        // 保存成功后删除该用户
      			should.not.exist(err);
      			done();
    		  });
    		});
  	  });
  	  // 确认生成的密码没有问题
  	  it('should password be hashed correctly', function(done) {
    		var password = user.password,
    		    _user = new User(user);

    		_user.save(function(err) {
    		  should.not.exist(err);
    		  _user.password.should.not.have.length(0);    // 用户密码不为零
    		  // 对密码进行比对
    		  bcrypt.compare(password, _user.password, function(err, isMatch) {
      			should.not.exist(err);
      			isMatch.should.equal(true);                // 保存前后密码相对
      			_user.remove(function(err) {
      			  should.not.exist(err);
      			  done();
      			});
    		  });
    		});
	    });
	  // 测试用户权限是否是默认0
	  it('should have default role 0', function(done) {
  		var _user = new User(user);

  		_user.save(function(err) {
        if(err) {
          console.log(err);
        }
  		  _user.role.should.equal(0);
  		  _user.remove(function(err) {
          if(err) {
            console.log(err);
          }
  			  done();
  		  });
  		});
  	});
    // 无法保存已存在的用户
	  it('should fail to save an existing user', function(done) {
		  var _user1 = new User(user);
  		_user1.save(function(err) {
  		  should.not.exist(err);
  		  var _user2 = new User(user);
  		  _user2.save(function(err) {
  			  should.exist(err);
    			_user1.remove(function(err) {
    			  if (!err) {
      				_user2.remove(function(err) {
                if(err) {
                  console.log(err);
                }
      				  done();
      				});
    			  }
    			});
  		  });
  		});
	  });
	});

  	after(function(done) {
  	  // clear user info
  	  done();
  	});
  });
});
