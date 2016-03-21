'use strict';

/* 热门歌单控制器 */
var mongoose = require('mongoose'),
    Programme = mongoose.model('Programme');                  // 引入近期热门歌单区域模型

// 豆瓣音乐热门歌单列表页面渲染函数
exports.list = function(req, res) {
  Programme
    .find({})
    .populate({
      path:'musicCategories',
      select:'name',
    })
    .exec(function(err,programmes) {
      if(err){
        console.log(err);
      }
      res.render('music/music_programme_list',{
        title:'豆瓣音乐热门歌单列表页',
        logo:'music',
        programmes:programmes
      });
    });
};

// 豆瓣音乐热门歌单列表页删除相应榜单名处理函数
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id  = req.query.id;
  if(id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    Programme.remove({_id:id},function(err) {
      if(err){
        console.log(err);
      }
      res.json({success:1});
    });
  }
};
