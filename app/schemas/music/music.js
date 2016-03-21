'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId;
// 电影数据类型
var MusicSchema = new Schema({
	title: String, 											// 标题
	altTitle: String, 									// 别名
	singer: String, 										// 歌手
	version: String, 										// 专辑类型
	media: String, 											// 介质
	image: String, 											// 海报
	pubdate: String, 										// 发行时间
	summary: String, 										// 歌曲简介
	publisher: String,									// 出版者
	rating: String,											// 豆瓣评分
	src: String,												// 音乐地址
	pv: {																// 访问量
		type:Number,
		default:0
	},
	musicCategory: {											// 歌曲分类
		type: ObjectId,
		ref: 'MusicCategory'
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
MusicSchema.pre('save',function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else {
		this.meta.updateAt = Date.now();
	}
	next();
});

// 静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
MusicSchema.statics = {
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

module.exports = MusicSchema;
