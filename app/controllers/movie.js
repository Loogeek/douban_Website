var Movie = require('../models/movie');       //电影数据模型
var CommentMovie = require('../models/comment');   //电影评论模型
var Category = require('../models/category'); //电影分类模型
var underscore = require('underscore');   //该模块用来对变化字段进行更新
var fs = require('fs');						//读写文件模块
var path = require('path');					//路径模块

//detail page 详细页面路由
exports.detail = function(req,res){
	var _id = req.params.id;
	//电影用户访问统计，每次访问电影详情页，PV增加1
	Movie.update({_id:_id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
		} 
	});
	//CommentMovie存储到数据库中的_id值与相应的Movie _id值相同
	Movie.findById(_id,function(err,movie){
		//查找该_id值所对应的评论信息
		CommentMovie
			.find({movie:_id})
			.populate('from','name')
			.populate('reply.from reply.to','name')//查找评论人和回复人的名字
			.exec(function(err,comments){
				console.log(comments);
				res.render('detail',{
					title:'imooc 详情页',
					movie:movie,
					comments:comments
				});
			});
	});
};

//admin new page 后台录入路由
exports.new = function(req,res){
	Category.find({},function(err,categories){
		res.render('admin',{
			title:'imooc 后台录入页',
			categories:categories,
			movie:{}
		});
	});
};

//admin Poster 存储海报路由
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster;    //上传文件
	var filePath = posterData.path;			//文件路径
	var originalFilename = posterData.originalFilename;//原始名字

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();  //获取时间
			var type = posterData.type.split('/')[1]; //获取图片类型 如jpg png
			var poster = timestamp + '.' + type;   //上传海报新名字
			//将新创建的海报图片存储到/public/upload 文件夹下
			var newPath = path.join(__dirname,'../../','/public/upload/' + poster);

			//写入文件
			fs.writeFile(newPath,data,function(err){
				req.poster = poster;
				next();
			}); 
		});
	}else{
		//没有自定义上传海报
		next();
	}
};

//admin post movie 后台录入路由
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	//如果有自定义上传海报  将movieObj中的海报地址改成自定义上传海报的地址
	if(req.poster){
		movieObj.poster = req.poster;
	}

	//如果数据已存在，则更新相应修改字段
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			//使用underscore模块的extend函数更新变化的字段
			_movie = underscore.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	}else{
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			if(categoryId){
				Category.findById(categoryId,function(err,category){
					category.movies.push(movie._id);
					category.save(function(err,category){
						res.redirect('/movie/' + movie._id);
					});
				});
			}else if(categoryName){
				var category = new Category({
					name:categoryName,
					movies:[movie._id]
				});
				category.save(function(err,category){
					movie.category = category._id;
					movie.save(function(err,movie){
						res.redirect('/movie/' + movie._id);
					});
				});
			}
		});
	}
};

//admin update movie 更新电影路由
exports.update = function(req,res){
	var _id = req.params.id;

	Movie.findById(_id,function(err,movie){
		Category.find({},function(err,categories){
			if(err){
				console.log(err);
			}
			res.render('admin',{
				title:'imooc后台更新页',
				movie:movie,
				categories:categories
			});
		});
	});
};

//list page 电影列表路由
exports.list = function(req,res){
	Movie.find({})
		.populate('category','name')
		.exec(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title:'imooc 列表页',
				movies:movies
			});		
		});	
};

//list delete movie 电影列表删除电影路由
exports.del = function(req,res){
	//获取客户端Ajax发送的URL值中的id值
	var id  = req.query.id;
	if(id){
		//如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}
			res.json({success:1});
		});
	}
};