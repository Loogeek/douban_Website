var mongoose = require('mongoose');
var bcrypt = require('bcrypt');    //用于密码加密
var SALT_WORK_FACTOR = 10; //密码破解需要的强度，越大破解需要时间越长

//电影数据类型
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	/*
		0:nomal user
		1:verified user  邮件激活后的用户
		2:prefessional user 
		>10: admin
		>50:super admin 
	*/
	role:{
		type:Number,
		default:0
	},
    meta: {
    	createAt: {
	    	type: Date,
	    	default: Date.now()
    },
    updateAt: {
	    type: Date,
	    default: Date.now()
    }
  }
});

//模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	//生成随机的盐，和密码混合后再进行加密
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err);

		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err);

			user.password = hash;  //将hash后的密码赋值到当前用户密码
			next();
		});
	});
});

//实例方法，通过实例可以调用
UserSchema.methods = {
	comparePassword : function(password,cb){
		//使用bcrypt的compare方法对用户输入的密码和数据库中保存的密码进行比对
		bcrypt.compare(password,this.password,function(err,isMatch){
			if(err) return cb(err);

			cb(null,isMatch);
		});
	}
};

//静态方法不会与数据库直接交互，模型方法通过模型可以调用
UserSchema.statics = {
	fetch : function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);		
	},
	findById : function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb);
	}
};

module.exports = UserSchema;
