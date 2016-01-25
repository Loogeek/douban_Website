var CommentMovie = require('../../models/movie/movie_comment');    //电影数据模型
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
				to:_comment.tid,		 //回复给谁
				content:_comment.content, //回复内容
				meta: {
			    	createAt: Date.now()
			  	}
			};
			comment.reply.push(reply);

			//保存该条评论的回复内容
			comment.save(function(err,comment){
				if(err){
					console.log(err);
				}
				//res.redirect('/movie/' + movieId);
				//在数据库中保存用户评论后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
				CommentMovie
					.findOne({_id:comment._id})
					.populate('from','name')
					.populate('reply.from reply.to','name')//查找评论人和回复人的名字
					.exec(function(err,comments){
						res.json({data:comments});
					});
			});
		});
	//简单的评论，不是对评论内容的回复
	}else{
		//将用户评论创建新对象并保存
		var comment = new CommentMovie(_comment);
		comment.save(function(err,comment){
			if(err){
				console.log(err);
			}
			// res.redirect('/movie/' + movieId);
			//在数据库中保存用户评论后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
			CommentMovie
				.findOne({_id:comment._id})
				.populate('from','name')
				.populate('reply.from reply.to','name')//查找评论人和回复人的名字
				.exec(function(err,comments){
					res.json({data:comments});
				});
		});
	}
};

//comment delete 电影评论删除
exports.del = function(req,res){
    //获取客户端Ajax发送的URL值中的id值
    var cid  = req.query.cid;   //获取该评论的id值
    var did  = req.query.did;   //获取各条回复评论的id值

    //如果点击的是叠楼中的回复评论
    if(did !== 'undefined'){
    	//先查找到该叠楼评论
    	CommentMovie.findOne({_id:cid},function(err,comment){
    		var len = comment.reply.length; //获取该叠楼评论中回复评论的条数

    		for(var i=0;i<len;i++){
    			//如果找到该叠楼中点击删除的回复评论，将其评论删除并保存数据库

    			if(comment.reply[i] && comment.reply[i]._id.toString() === did){
    				comment.reply.splice(i,1);
    			}
    		}
			comment.save(function(err,com){
				if(err){
		            console.log(err);
		        }
			});
			res.json({success:1});
    	});
    }else{
	    //点击的是叠楼的楼主评论，即第一条评论
	    CommentMovie.remove({_id:cid},function(err,comment){
	        if(err){
	            console.log(err);
	        }
	        res.json({success:1});
	    });
    }
};
