var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
//电影数据类型
var MusicSchema = new Schema({
	title: String,
	altTitle: String,
	singer: String,
	version: String,
	media: String,
	image: String,
	pubdate: String,
	summary: String,
	pv:{
		type:Number,
		default:0
	},
	musicCategory:{
		type:ObjectId,
		ref:'MusicCategory'
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
MusicSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
MusicSchema.statics = {
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

module.exports = MusicSchema;
