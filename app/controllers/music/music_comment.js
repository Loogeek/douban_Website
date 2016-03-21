'use strict';

var MusicComment = require('../../models/music/music_comment');    // 音乐数据模型
// 音乐评论后台录入控制器
exports.save = function(req,res) {
  var _comment = req.body.comment;        // 获取Ajax发送的数据
  // 如果存在cid说明是对评论人进行回复
  if(_comment.cid) {
    // 通过点击回复一条音乐评论的id，找到这条评论的内容
    MusicComment.findById(_comment.cid,function(err,comment) {
      var reply = {
        from:_comment.from,              // 回复人
        to:_comment.tid,                 // 被回复人
        content:_comment.content,        // 回复内容
        meta:{
          createAt:Date.now()
        }
      };
      comment.reply.push(reply);          // 添加到评论的数组中
      // 保存该条评论的回复内容
      comment.save(function(err,comment) {
        if(err) {
          console.log(err);
        }
        // 在数据库中保存用户回复后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
        MusicComment
          .findOne({_id:comment._id})
          .populate('from','name')
          .populate('reply.from reply.to','name')// 查找评论人和回复人的名字
          .exec(function(err,comments) {
            res.json({data:comments});
          });
      });
    });
  // 简单的评论，不是对评论内容的回复
  }else{
    // 将用户评论创建新对象并保存
    var comment = new MusicComment(_comment);
    comment.save(function(err,comment) {
      if(err){
        console.log(err);
      }
      // 在数据库中保存用户评论后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
      MusicComment
        .findOne({_id:comment._id})
        .populate('from','name')
        .populate('reply.from reply.to','name')    // 查找评论人和回复人的名字
        .exec(function(err,comments) {
          res.json({data:comments});
        });
    });
  }
};

// 删除音乐评论控制器
exports.del = function(req,res) {
    // 获取客户端Ajax发送的URL值中的id值
    var cid = req.query.cid,                     // 获取该评论的id值
        did = req.query.did;                     // 获取各条回复评论的id值
    // 如果点击的是叠楼中的回复评论的删除按钮
    if(did !== 'undefined') {
      // 先查找到该叠楼评论
      MusicComment.findById(cid,function(err,comment) {
        var len = comment.reply.length;           // 获取该叠楼评论中回复评论的条数
        for(var i = 0; i < len; i++) {
          // 如果找到该叠楼中点击删除的评论，则将其评论删除
          if(comment.reply[i] && comment.reply[i]._id.toString() === did) {
            comment.reply.splice(i,1);
          }
        }
        // 保存评论
        comment.save(function(err) {
          if(err){
            console.log(err);
          }
        });
        res.json({success:1});
      });
    // 若是点击第一条评论中的删除
    }else {
      MusicComment.remove({_id:cid},function(err) {
        if(err){
          console.log(err);
        }
        res.json({success:1});
      });
    }
};
