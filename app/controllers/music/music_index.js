"use strict";

/* 音乐首页交互 */
var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),                  // 音乐数据模型
    MusicCategory = mongoose.model('MusicCategory'),  // 引入音乐分类模型
    Programme = mongoose.model('Programme'),          // 引入近期热门歌单区域模型
    fs = require('fs'),                               // 读写文件模块
    path = require('path');                           // 路径模块

/* 音乐首页 */
exports.index = function(req,res) {
  var albumName = req.query.albumName,                // 获取新碟榜区分类请求名称
      hotProName = req.query.hotProName,              // 获取近期热门歌单分类请求名称
      hotSongs = req.query.hotSongs;                  // 获取本周单曲榜区分类请求名称
  // 如果是新碟榜部分发送Ajax请求
  if(albumName) {
    MusicCategory
      .findOne({name:albumName})
      .populate({
        path:'musics',
        select:'title image singer',
        options:{limit:8}                               //限制最多8条数据
      })
      .exec(function(err,musicCategory) {
        if(err){
          console.log(err);
        }
        res.json({data:musicCategory});
      });
  // 如果是热门歌单部分发送Ajax请求
  }else if(hotProName) {
    Programme
      .findOne({name:hotProName})
      .populate({
        path:'musicCategories',
        select:'name musics',
        options:{limit:6}                               //限制最多6条数据
      })
      .exec(function(err,programme) {
        if(err){
          console.log(err);
        }
        // 获取近期热门歌单最热、流行、摇滚等歌曲分类
        if(programme) {
          var musicCategories = programme.musicCategories, // 查找该榜单包含的歌曲分类
              dataMusics = [],
              count = 0,
              len = musicCategories.length;
          for(var i = 0; i < len; i++) {
            // 查找每个歌曲分类下对应的音乐
            MusicCategory
              .findOne({_id:musicCategories[i]._id})
              .populate({
                path:'musics',
                select:'title image',
                options:{limit:3}                               //限制最多3条数据
              })
              .exec(function(err,musics) {
                if(err){
                  console.log(err);
                }
                count++;
                dataMusics.push(musics);
                // 如果查询完毕则返回查找到的榜单和歌曲分类数据
                if(count === len){
                  res.json({data:dataMusics,dataPro:programme});
                }
              });
          }
        }else {
          res.json({data:programme});
        }
      });
  // 如果是本周单曲榜部分发送Ajax请求
  }else if(hotSongs) {
    MusicCategory
      .findOne({name:hotSongs})
      .populate({
        path:'musics',
        select:'title image singer pv',
        options:{limit:10}                               //限制最多10条数据
      })
      .exec(function(err,musicCategory){
        if(err){
          console.log(err);
        }
        res.json({data:musicCategory});
      });
  // 没有Ajax请求，则是渲染整个音乐首页
  }else{
    // 获取豆瓣音乐顶部轮播图文件夹中图片数量
    var newPath = path.join(__dirname,'../../../public/libs/images/music/gallery'),
        dirList = fs.readdirSync(newPath),
        fileList = [],
        reg = /^(.+)\.(jpg|bmp|gif|png)$/i;  // 通过正则匹配图片
    // 获取音乐首页轮播图文件夹下图片
    dirList.forEach(function(item) {
      if(reg.test(item)){
        fileList.push(item);
      }
    });
    // 音乐分类查找
    MusicCategory
      .find({})
      .populate('musics')
      .exec(function(err,musicCategories){
        if(err){
          console.log(err);
        }
        // 歌单区域歌曲分类查找
        Programme
          .find({})
          .populate({
            path:'musicCategories',
            select:'name musics',
          })
          .exec(function(err,programmes) {
            if(err){
              console.log(err);
            }
            res.render('music/music_index',{
              title:'豆瓣音乐首页',
              logo:'music',                         // 显示音乐logo
              musicCategories:musicCategories,      // 返回查询到的全部歌曲分类
              programmes:programmes,                // 返回查询到的近期热门歌单数量
              fileList:fileList                     // 首页轮播图图片数量
            });
          });
      });
  }
};

/* 音乐分类及音乐搜索 */
exports.search = function(req,res) {
  var catId = req.query.cat || '',                  // 获取音乐分类更多查询串ID
      proId = req.query.pro || '',                  // 近期热门歌单部分更多查询串ID
      q = req.query.q || '',                        // 获取搜索框提交内容
      page = parseInt(req.query.p, 10) || 0,        // 获取页面
      count = 6,
      index = page * count;                         // 每页展示6条数据

  // 如果包含catId，则是点击了相应的音乐分类标题，进入results页面显示相应音乐分类的音乐
  if(catId) {
    // 音乐分类功能
    MusicCategory
      .find({_id:catId})
      .populate({
        path:'musics',
        select:'title image'
    })
    .exec(function(err, musicCategories) {
      if(err) {
        console.log(err);
      }
      if(musicCategories) {
        var musicCategory = musicCategories[0] || {},  // 查询到的音乐分类
        musics = musicCategory.musics || [],           // 分类中包含的音乐
        results = musics.slice(index, index + count);  // 分类页面每页显示的音乐数量

        res.render('music/music_results', {
          title:'豆瓣音乐分类列表页面',                   // HTML文件标题
          logo:'music',                                // 搜索页logo图标名称
          keyword:musicCategory.name,                  // 歌曲分类名称
          currentPage:(page + 1),                      // 当前页
          query:'cat=' + catId,                        // 切换到另一页
          totalPage:Math.ceil(musics.length / count),  // 总页数，需向上取整
          musics:results                               // 查询到音乐分类下所含的音乐
        });
      }
    });
  // 近期热门歌单区歌单分类功能
  }else if(proId) {
    Programme
      .find({_id:proId})
      .populate({
        path:'musicCategories',
        select:'name musics'
    })
    .exec(function(err, musicCategories) {
      if(err) {
        console.log(err);
      }
      if(musicCategories) {
        // 查询这个歌单下所包含的歌曲分类
        var musicCats = musicCategories[0].musicCategories || {},
            dataMusics = [],
            count = 0,
            len = musicCats.length;
        for(var i = 0; i < len; i++) {
          MusicCategory
            .findOne({_id:musicCats[i]._id})
            .populate({
              path:'musics',
              select:'title image',
            })
            .exec(function(err,musics) {
              count ++;
              if(err) {
                console.log(err);
              }
              dataMusics.push(musics);

              if(count === len) {
                // 分类页面每页显示的音乐数量
                res.render('music/music_results', {
                  title:'近期热门歌单分类列表页面',
                  logo:'music',
                  keyword:musicCategories[0].name,               // 分类名称
                  currentPage:(page + 1),                        // 当前页
                  query:'pro=' + proId,                          // 切换到另一页
                  totalPage:Math.ceil(dataMusics.length / count),// 总页数，需向上取整
                  musicCats:dataMusics                           // 查询到音乐分类下所含的音乐
                });
              }
            });
        }
      }
    });
  }else {
    // 音乐搜索功能
    Music
      .find({title: new RegExp(q + '.*', 'i')})     // 通过正则匹配查询音乐的名称
      .exec(function(err, musics) {
        if (err) {
          console.log(err);
        }
        var results = musics.slice(index, index + count);
        res.render('music/music_results', {
          title:'豆瓣音乐搜索结果列表页面',
          logo:'music',
          keyword:q,
          currentPage:(page + 1),
          query:'q=' + q,
          totalPage:Math.ceil(musics.length / count),
          musics:results
        });
      });
  }
};
