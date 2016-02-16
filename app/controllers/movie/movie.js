var Movie = require('../../models/movie/movie'),       				  // 电影数据模型
		CommentMovie = require('../../models/movie/movie_comment'), // 电影评论模型
		Category = require('../../models/movie/movie_category'), 	  // 电影分类模型
		_ = require('underscore'),   														// 该模块用来对变化字段进行更新
		fs = require('fs'),																			// 读写文件模块
		path = require('path');																	// 路径模块

// 详细页面路由
exports.detail = function(req,res) {
	var _id = req.params.id;
	// 电影用户访问统计，每次访问电影详情页，PV增加1
	Movie.update({_id: _id},{$inc: {pv: 1}},function(err) {
		if(err) {
			console.log(err);
		}
	});
	// CommentMovie存储到数据库中的_id值与相应的Movie _id值相同
	Movie.findById(_id, function(err,movie) {
		// 查找该_id值所对应的评论信息
		CommentMovie
			.find({movie: _id})
			.populate('from','name')
			.populate('reply.from reply.to','name')// 查找评论人和回复人的名字
			.exec(function(err,comments){
				res.render('movie/movie_detail', {
					title: '豆瓣电影详情页',
					movie: movie,
					comments: comments
				});
			});
	});
};

// 后台录入路由
exports.new = function(req,res) {
	Category.find({},  function(err,categories) {
		res.render('movie/movie_admin', {
			title: '豆瓣电影后台录入页',
			categories: categories,
			movie: {}
		});
	});
};

// 存储海报路由
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster,    								// 上传文件
			filePath = posterData.path,															// 文件路径
			originalFilename = posterData.originalFilename;					// 原始名字

	if(originalFilename) {
		fs.readFile(filePath,function(err,data) {
			var timestamp = Date.now(),  														// 获取时间
					type = posterData.type.split('/')[1], 							// 获取图片类型 如jpg png
					poster = timestamp + '.' + type,   									// 上传海报新名字
					// 将新创建的海报图片存储到/public/upload 文件夹下
					newPath = path.join(__dirname,'../../../','/public/upload/' + poster);
			// 写入文件
			fs.writeFile(newPath,data,function(err) {
				req.poster = poster;
				next();
			});
		});
	}else {
		// 没有自定义上传海报
		next();
	}
};

// 后台录入路由
exports.save = function(req,res) {
	var id = req.body.movie._id,
			movieObj = req.body.movie,
			_movie;
	// 如果有自定义上传海报  将movieObj中的海报地址改成自定义上传海报的地址
	if(req.poster) {
		movieObj.poster = req.poster;
	}
	// 如果数据已存在，则更新相应修改的字段
	if(id) {
		Movie.findById(id,function(err,movie) {
			if(err) {
				console.log(err);
			}
			// 使用_模块的extend函数更新变化的字段
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	// 数据不存在，创建新的电影
	}else {
		var categoryId = movieObj.category,							// 获取电影分类ID
				categoryName = movieObj.categoryName;				// 获取新创建的电影分类名称

		_movie = new Movie(movieObj);
		_movie.save(function(err,movie) {
			if(err) {
				console.log(err);
			}
			// 如果选取了存在的电影分类
			if(categoryId) {
				Category.findById(categoryId,function(err,category) {
					category.movies.push(movie._id);
					category.save(function(err,category) {
						res.redirect('/movie/' + movie._id);
					});
				});
			// 输入新的电影分类
			}else if(categoryName) {
				// 判断新创建的电影分类是否已存在，避免重复输入
				Category.findOne({name: categoryName}, function(err, _category) {
					if(_category) {
						console.log('电影分类已存在');
						res.redirect('/admin/movie/category/list');
					}else {
						var category = new Category({
							name:  categoryName,
							movies:  [movie._id]
						});
						category.save(function(err,category) {
							movie.category = category._id;
							movie.save(function(err,movie) {
								res.redirect('/movie/' + movie._id);
							});
						});
					}
				});
			}
		});
	}
};

// 更新电影路由
exports.update = function(req,res) {
	var _id = req.params.id;

	Movie.findById(_id,function(err,movie) {
		Category.find({},function(err,categories) {
			if(err){
				console.log(err);
			}
			res.render('movie/movie_admin', {
				title: '豆瓣电影后台更新页',
				movie: movie,
				categories: categories
			});
		});
	});
};

// 电影列表路由
exports.list = function(req,res) {
	Movie.find({})
		.populate('category','name')
		.exec(function(err,movies) {
			if(err){
				console.log(err);
			}
			return res.render('movie/movie_list', {
				title: '豆瓣电影列表页',
				movies: movies
			});
		});
};

// 电影列表删除电影路由
exports.del = function(req,res) {
	// 获取客户端Ajax发送的URL值中的id值
	var id  = req.query.id;
	if(id) {
		// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		Movie.remove({_id: id}, function(err,movie) {
			if(err) {
				console.log(err);
			}
			res.json({success: 1});
		});
	}
};
