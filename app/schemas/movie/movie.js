'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId;
// 电影数据类型
var MovieSchema = new Schema({
	doctor: String,											// 导演
	title: String,											// 标题
	country: String, 										// 上映城市
	summary: String, 										// 简介
	flash: String,	 										// 片源地址
	poster: String,	 										// 电影海报
	year: Number,    										// 上映时间
	aka: String,		 										// 又名
	casts: String,		 									// 主演
	genres: String,											// 类型
	rating: String,											// 豆瓣评分
	pv:{																// 访问量
		type:Number,
		default:0
	},
	category: {													// 电影分类
		type: ObjectId,
		ref: 'Category'
	},
  meta: {
  	createAt: {												// 创建时间
    	type: Date,
    	default: Date.now()
  	},
	  updateAt: {												// 更新时间
	    type: Date,
	    default: Date.now()
	  }
	}
});

// 模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
MovieSchema.pre('save',function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

// 定义查询静态方法
MovieSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById: function(id,cb) {
		return this
			.findOne({_id: id})
			.exec(cb);
	}
};

module.exports = MovieSchema;
