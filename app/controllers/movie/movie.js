"use strict";

var mongoose = require('mongoose'),
		Movie = mongoose.model('Movie'),       				  			// 电影数据模型
		MovieComment = mongoose.model('MovieComment'), 				// 电影评论模型
		Category = mongoose.model('Category'), 	  						// 电影分类模型
		_ = require('underscore'),   													// 该模块用来对变化字段进行更新
		fs = require('fs'),																		// 读写文件模块
		path = require('path');																// 路径模块

// 详细页面路由
exports.detail = function(req,res) {
	var _id = req.params.id;
	// 电影用户访问统计，每次访问电影详情页，PV增加1
	Movie.update({_id:_id},{$inc:{pv:1}},function(err) {
		if(err) {
			console.log(err);
		}
	});
	// MovieComment存储到数据库中的_id值与相应的Movie _id值相同
	Movie.findById(_id, function(err,movie) {
		// 查找该_id值所对应的评论信息
		MovieComment
			.find({movie:_id})
			.populate('from','name')
			.populate('reply.from reply.to','name')// 查找评论人和回复人的名字
			.exec(function(err,comments){
				res.render('movie/movie_detail', {
					title:'豆瓣电影详情页',
					logo:'movie',
					movie:movie,
					comments:comments
				});
			});
	});
};

// 后台录入路由
exports.new = function(req,res) {
	Category.find({},  function(err,categories) {
		res.render('movie/movie_admin', {
			title:'豆瓣电影后台录入页',
			logo:'movie',
			categories:categories,
			movie:{}
		});
	});
};

// 存储海报路由
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster,    								// 上传文件
			filePath = posterData.path,															// 文件路径
			originalFilename = posterData.originalFilename;					// 原始名字

	if(originalFilename) {
		fs.readFile(filePath, function(err,data) {
			if(err) {
				console.log(err);
			}
			var timestamp = Date.now(),  														// 获取时间
					type = posterData.type.split('/')[1], 							// 获取图片类型 如jpg png
					poster = timestamp + '.' + type,   									// 上传海报新名字
					// 将新创建的海报图片存储到/public/upload 文件夹下
					newPath = path.join(__dirname,'../../../','/public/upload/movie/' + poster);
			// 写入文件
			fs.writeFile(newPath,data,function(err) {
				if(err) {
					console.log(err);
				}
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
			categoryId = movieObj.category,							// 获取电影分类ID
			categoryName = movieObj.categoryName;				// 获取新创建的电影分类名称
	// 如果有自定义上传海报  将movieObj中的海报地址改成自定义上传海报的地址
	if(req.poster) {
		movieObj.poster = req.poster;
	}
	// 如果数据已存在，则更新相应修改的字段
	if(id) {
		Movie.findById(id,function(err,_movie) {
			if(err) {
				console.log(err);
			}
			// 如果输入后电影分类与原电影分类不同，则说明更新了电影分类
			if (movieObj.category.toString() !== _movie.category.toString()) {
				// 找到电影对应的原电影分类
				Category.findById(_movie.category,function(err,_oldCat) {
					if (err) {
						console.log(err);
					}
					// 在原电影分类的movies属性中找到该电影的id值并将其删除
					var index = _oldCat.movies.indexOf(id);
					_oldCat.movies.splice(index,1);
					_oldCat.save(function(err) {
						if (err) {
							console.log(err);
						}
					});
				});
				// 找到电影对应的新电影分类
				Category.findById(movieObj.category,function(err,_newCat) {
					if (err) {
						console.log(err);
					}
					// 将其id值添加到movies属性中并保存
					_newCat.movies.push(id);
					_newCat.save(function(err) {
						if (err) {
							console.log(err);
						}
					});
				});
			}
			// 使用underscore模块的extend函数更新电影变化的属性
			_movie = _.extend(_movie,movieObj);
			_movie.save(function(err,_movie) {
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + _movie._id);
			});
		});
	// 如果不是更新电影 并且输入了电影名称
	}else if(movieObj.title) {
		// 如果表单中填写了电影名称 则查找该电影名称是否已存在
		Movie.findOne({title:movieObj.title},function(err,_movie) {
			if (err) {
				console.log(err);
			}
			if (_movie) {
				console.log('电影已存在');
				res.redirect('/admin/movie/list');
			}else {
				// 创建一个电影新数据
				var newMovie = new Movie(movieObj);
				newMovie.save(function(err,_newMovie) {
					if(err){
						console.log(err);
					}
					// 选择了电影所属的电影分类
					if(categoryId) {
						Category.findById(categoryId,function(err,_category) {
							if(err){
								console.log(err);
							}
							_category.movies.push(_newMovie._id);
							_category.save(function(err) {
								if(err){
									console.log(err);
								}
								res.redirect('/movie/' + _newMovie._id);
							});
						});
					// 输入新的电影分类
					}else if(categoryName) {
						// 查找电影分类是否已存在
						Category.findOne({name:categoryName}, function(err, _categoryName) {
							if(err) {
								console.log(err);
							}
							if(_categoryName) {
								console.log('电影分类已存在');
								res.redirect('/admin/movie/movieCategory/list');
							}else {
								// 创建新的电影分类
								var category = new Category({
									name:categoryName,
									movies:[_newMovie._id]
								});
								// 保存新创建的电影分类
								category.save(function(err,category) {
									if (err) {
										console.log(err);
									}
									// 将新创建的电影保存，category的ID值为对应的分类ID值
									// 这样可通过populate方法进行相应值的索引
									_newMovie.category = category._id;
									_newMovie.save(function(err,movie) {
										if (err) {
											console.log(err);
										}
										res.redirect('/movie/' + movie._id);
									});
								});
							}
						});
					}else {
						res.redirect('/admin/movie/list');
					}
				});
			}
		});
	// 没有输入电影名称 而只输入了电影分类名称
	}else if(categoryName) {
		// 查找电影分类是否已存在
		Category.findOne({name:categoryName}, function(err, _categoryName) {
			if(err) {
				console.log(err);
			}
			if(_categoryName) {
				console.log('电影分类已存在');
				res.redirect('/admin/movie/movieCategory/list');
			}else {
				// 创建新的电影分类
				var newCategory = new Category({
					name:categoryName
				});
				// 保存新创建的电影分类
				newCategory.save(function(err) {
					if (err) {
						console.log(err);
					}
					res.redirect('/admin/movie/movieCategory/list');
				});
			}
		});
	}else {
		res.redirect('/admin/movie/list');
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
				title:'豆瓣电影后台更新页',
				logo:'movie',
				movie:movie,
				categories:categories
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
				title:'豆瓣电影列表页',
				logo:'movie',
				movies:movies
			});
		});
};

// 电影列表删除电影路由
exports.del = function(req,res) {
	// 获取客户端Ajax发送的URL值中的id值
	var id  = req.query.id;
	// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
	if(id) {
		Movie.findById(id, function(err,movie) {				// 查找该条电影信息
			if(err) {
				console.log(err);
			}
			// 查找包含这条电影的电影分类
			Category.findById(movie.category, function(err, category) {
				if(err) {
					console.log(err);
				}
				if (category) {
					var index = category.movies.indexOf(id);	// 在电影分类movies数组中查找该值所在位置
					category.movies.splice(index,1);					// 从分类中删除该数据
					category.save(function(err) {							// 对变化的电影分类数据进行保存
						if(err) {
							console.log(err);
						}
					});
				}
				Movie.remove({_id:id}, function(err) {		// 电影模型中删除该电影数据
					if(err) {
						console.log(err);
					}
					res.json({success:1});									// 返回删除成功的json数据给游览器
				});
			});
		});
	}
};
