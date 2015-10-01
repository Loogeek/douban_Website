var CommentMovie = require('../models/comment');    //电影数据模型

//admin post movie 后台录入路由
exports.save = function(req,res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	//如果存在cid说明是对评论人进行回复
	if(_comment.cid){
		//通过点击一条电影评论的id，找到这条评论的内容
		CommentMovie.findById(_comment.cid,function(err,comment){
			var reply = {
				from:_comment.from,  //回复评论人
				to:_comment.to,		 //回复给谁
				content:_comment.content //回复内容
			};
			comment.reply.push(reply);

			//保存该条评论的回复内容
			comment.save(function(err,comment){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movieId);
			});
		});
	//简单的评论，不是对评论内容的回复
	}else{
		var comment = new CommentMovie(_comment);
		comment.save(function(err,comment){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movieId);
		});	
	}
};
