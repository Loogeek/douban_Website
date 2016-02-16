var Music = require('../../models/music/music'),       						//音乐数据模型
		CommentMusic = require('../../models/movie/movie_comment'),   //音乐评论模型
		MusicCategory = require('../../models/music/music_category'), //音乐分类模型
		_ = require('underscore'),   													//该模块用来对变化字段进行更新
		fs = require('fs'),																						//读写文件模块
		path = require('path');																				//路径模块

/* 详细页面路由 */
exports.detail = function(req,res) {
	var _id = req.params.id;
	// 音乐用户访问统计，每次访问音乐详情页，PV增加1
	Music.update({_id: _id},{$inc: {pv:1}},function(err) {
		if(err){
			console.log(err);
		}
	});
	// CommentMusic存储到数据库中的_id值与相应的Music _id值相同
	Music.findById(_id,function(err,music) {
		// 查找该_id值所对应的评论信息
		CommentMusic
			.find({music:  _id})
			.populate('from','name')
			.populate('reply.from reply.to','name')							// 查找评论人和回复人的名字
			.exec(function(err,comments) {
				res.render('music/music_detail', {
					title: '豆瓣音乐详情页',
					music: music,
					comments: comments
				});
			});
	});
};

/* 后台录入路由 */
exports.new = function(req,res) {
	MusicCategory.find({},function(err,musicCategories) {
		res.render('music/music_admin', {
			title: '豆瓣音乐后台录入页',
			musicCategories: musicCategories,
			music: {}
		});
	});
};

/* 存储海报路由 */
exports.savePoster = function(req, res, next) {
	var imageData = req.files.uploadMusicImage,    							//上传文件
			filePath = imageData.path,															//文件路径
			originalFilename = imageData.originalFilename;					//原始名字

	if(originalFilename){
		fs.readFile(filePath,function(err,data) {
			var timestamp = Date.now(),  														//获取时间
					type = imageData.type.split('/')[1], 								//获取图片类型 如jpg png
					image = timestamp + '.' + type,  										//上传海报新名字
					//将新创建的海报图片存储到/public/upload 文件夹下
					newPath = path.join(__dirname,'../../','/public/upload/' + image);

			// 写入文件
			fs.writeFile(newPath,data,function(err) {
				req.image = image;
				next();
			});
		});
	}else {
		// 没有自定义上传海报
		next();
	}
};

/* 后台录入路由 */
exports.save = function(req,res) {
	var id = req.body.music._id,
			musicObj = req.body.music,
			_music;
	// 如果有自定义上传海报  将musicObj中的海报地址改成自定义上传海报的地址
	if(req.image){
		musicObj.image = req.image;
	}
	// 如果数据已存在，则更新相应修改字段
	if(id){
		Music.findById(id,function(err,music) {
			if(err) {
				console.log(err);
			}
			// 使用underscore模块的extend函数复制musicObj对象中的所有属性覆盖到music对象
			// 上，并且返回music对象. 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉
			_music = _.extend(music,musicObj);
			_music.save(function(err,music) {
				if(err){
					console.log(err);
				}
				res.redirect('/music/' + music._id);
			});
		});
	}else {
		// 获取音乐所属分类名称和ID值
		var musicCategoryId = musicObj.musicCategory,
				musicCategoryName = musicObj.musicCategoryName;

    // 创建一个音乐新数据
		_music = new Music(musicObj);
		_music.save(function(err,music) {
			if(err){
				console.log(err);
			}
			// 选择了音乐所属的音乐分类
			if(musicCategoryId) {
				MusicCategory.findById(musicCategoryId,function(err,musicCategory) {
					musicCategory.musics.push(music._id);
					musicCategory.save(function(err,musicCategory) {
						res.redirect('/music/' + music._id);
					});
				});
			// 输入新的音乐分类
			}else if(musicCategoryName) {
				MusicCategory.findOne({name: musicCategoryName}, function(err, _musicCategoryName) {
					if(err) {
						console.log(err);
					}
					if(_musicCategoryName) {
						console.log('音乐分类已存在');
						res.redirect('/admin/music/musicCategory/list');
					}else {
						//创建新的音乐分类
						var musicCategory = new MusicCategory({
							name: musicCategoryName,
							musics: [music._id]
						});
						// 保存新创建的音乐分类
						musicCategory.save(function(err,musicCategory) {
							// 将新创建的音乐保存，musicCategory的ID值为对应的分类ID值
							// 这样可通过populate方法进行相应值的索引
							music.musicCategory = musicCategory._id;
							music.save(function(err,music) {
								res.redirect('/music/' + music._id);
							});
						});
					}
				});
			}
		});
	}
};

/* 更新音乐路由 */
exports.update = function(req,res) {
	var _id = req.params.id;

	Music.findById(_id,function(err,music) {
		MusicCategory.find({},function(err,musicCategories) {
			if(err){
				console.log(err);
			}
			res.render('music/music_admin',{
				title: '豆瓣音乐后台更新页',
				music: music,
				musicCategories: musicCategories
			});
		});
	});
};

/* 音乐列表路由 */
exports.list = function(req,res)  {
	Music.find({})
		.populate('musicCategory','name')
		.exec(function(err,musics){
			if(err){
				console.log(err);
			}
			res.render('music/music_list',{
				title: '豆瓣音乐列表页',
				musics: musics
			});
		});
};

/* 音乐列表删除音乐路由 */
exports.del = function(req,res) {
	// 获取客户端Ajax发送的URL值中的id值
	var id  = req.query.id;
	if(id){
		// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		Music.remove({_id: id},function(err,music) {
			if(err) {
				console.log(err);
			}
			res.json({success: 1});
		});
	}
};
