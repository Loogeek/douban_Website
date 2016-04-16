'use strict';

var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),                       // 音乐数据模型
    MusicComment = mongoose.model('MusicComment'),         // 音乐评论模型
    MusicCategory = mongoose.model('MusicCategory'),       // 音乐分类模型
    _ = require('underscore'),                             // 该模块用来对变化字段进行更新
    fs = require('fs'),                                    // 读写文件模块
    path = require('path');                                // 路径模块

/* 详细页面控制器 */
exports.detail = function(req,res) {
  var _id = req.params.id;
  // 音乐用户访问统计，每次访问音乐详情页，PV增加1
  Music.update({_id:_id},{$inc:{pv:1}},function(err) {
    if(err){
      console.log(err);
    }
  });
  // MusicComment存储到数据库中的_id值与相应的Music _id值相同
  Music.findById(_id,function(err,music) {
    // 查找该_id值所对应的评论信息
    MusicComment
      .find({music:_id})
      .populate('from','name')
      .populate('reply.from reply.to','name')              // 查找评论人和回复人的名字
      .exec(function(err,comments) {
        res.render('music/music_detail', {
          title:'豆瓣音乐详情页',
          logo:'music',
          music:music,
          comments:comments
        });
      });
  });
};

/* 后台录入控制器 */
exports.new = function(req,res) {
  MusicCategory.find({},function(err,musicCategories) {
    if (err) {
      console.log(err);
    }
    res.render('music/music_admin', {
      title:'豆瓣音乐后台录入页',
      logo:'music',
      musicCategories:musicCategories,
      music:{}
    });
  });
};

/* 存储海报控制器 */
exports.savePoster = function(req, res, next) {
  var imageData = req.files.uploadMusicImage,                 // 上传文件
      filePath = imageData.path,                              // 文件路径
      originalFilename = imageData.originalFilename;          // 原始名字

  if(originalFilename) {
    fs.readFile(filePath, function(err,data) {
      if(err) {
        console.log(err);
      }
      var timestamp = Date.now(),                             // 获取时间
          type = imageData.type.split('/')[1],                // 获取图片类型 如jpg png
          image = timestamp + '.' + type,                     // 上传海报新名字
          // 将新创建的海报图片存储到/public/upload 文件夹下
          newPath = path.join(__dirname,'../../../','/public/upload/music/' + image);

      // 写入文件
      fs.writeFile(newPath,data,function(err) {
        if(err){
          console.log(err);
        }
        req.image = image;
        next();
      });
    });
  }else {
    // 没有自定义上传海报
    next();
  }
};

/* 后台录入控制器 */
exports.save = function(req,res) {
  var id = req.body.music._id,                        // 如果是更新音乐则获取到该音乐ID值
      musicObj = req.body.music,                      // 获取音乐新建表单发送的数据
      musicCategoryId = musicObj.musicCategory,       // 获取音乐所属分类ID值
      musicCategoryName = musicObj.musicCategoryName; // 获取音乐所属分类名称
  // 如果有自定义上传海报  将musicObj中的海报地址改成自定义上传海报的地址
  if(req.image){
    musicObj.image = req.image;
  }
  // 如果id值存在，则说明是对已存在的数据进行更新
  if(id) {
    Music.findById(id,function(err,_music) {
      if(err) {
        console.log(err);
      }
      // 如果输入后歌曲分类与原歌曲分类不同，则说明更新了音乐分类
      if (musicObj.musicCategory.toString() !== _music.musicCategory.toString()) {
        // 找到音乐对应的原歌曲分类
        MusicCategory.findById(_music.musicCategory,function(err,_oldCat) {
          if (err) {
            console.log(err);
          }
          // 在原歌曲分类的musics属性中找到该歌曲的id值并将其删除
          var index = _oldCat.musics.indexOf(id);
          _oldCat.musics.splice(index,1);
          _oldCat.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        });
        // 找到音乐对应的新歌曲分类
        MusicCategory.findById(musicObj.musicCategory,function(err,_newCat) {
          if (err) {
            console.log(err);
          }
          // 将其id值添加到musics属性中并保存
          _newCat.musics.push(id);
          _newCat.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        });
      }
      // 使用underscore模块的extend函数更新音乐变化的属性
      _music = _.extend(_music,musicObj);
      _music.save(function(err,_music) {
        if(err){
          console.log(err);
        }
        res.redirect('/music/' + _music._id);
      });
    });
  // 如果表单中填写了音乐名称 则查找该音乐名称是否已存在
  }else if(musicObj.title) {
    Music.findOne({title:musicObj.title},function(err,_music) {
      if (err) {
        console.log(err);
      }
      if (_music) {
        console.log('音乐已存在');
        res.redirect('/admin/music/list');
      }else {
        // 创建一个音乐新数据
        var newMusic = new Music(musicObj);
        newMusic.save(function(err,_newMusic) {
          if(err){
            console.log(err);
          }
          // 选择了音乐所属的音乐分类
          if(musicCategoryId) {
            MusicCategory.findById(musicCategoryId,function(err,_musicCategory) {
              if(err){
                console.log(err);
              }
              _musicCategory.musics.push(_newMusic._id);
              _musicCategory.save(function(err) {
                if(err){
                  console.log(err);
                }
                res.redirect('/music/' + _newMusic._id);
              });
            });
          // 输入新的音乐分类
          }else if(musicCategoryName) {
            // 查找音乐分类是否已存在
            MusicCategory.findOne({name:musicCategoryName}, function(err, _musicCategoryName) {
              if(err) {
                console.log(err);
              }
              if(_musicCategoryName) {
                console.log('音乐分类已存在');
                res.redirect('/admin/music/musicCategory/list');
              }else {
                //创建新的音乐分类
                var musicCategory = new MusicCategory({
                  name:musicCategoryName,
                  musics:[_newMusic._id]
                });
                // 保存新创建的音乐分类
                musicCategory.save(function(err,musicCategory) {
                  if (err) {
                    console.log(err);
                  }
                  // 将新创建的音乐保存，musicCategory的ID值为对应的分类ID值
                  // 这样可通过populate方法进行相应值的索引
                  _newMusic.musicCategory = musicCategory._id;
                  _newMusic.save(function(err,music) {
                    if (err) {
                      console.log(err);
                    }
                    res.redirect('/music/' + music._id);
                  });
                });
              }
            });
          }else {
            res.redirect('/admin/music/list');
          }
        });
      }
    });
  // 没有输入音乐名称 而只输入了歌曲分类名称
  }else if(musicCategoryName) {
    // 查找音乐分类是否已存在
    MusicCategory.findOne({name:musicCategoryName}, function(err, _musicCategoryName) {
      if(err) {
        console.log(err);
      }
      if(_musicCategoryName) {
        console.log('音乐分类已存在');
        res.redirect('/admin/music/musicCategory/list');
      }else {
        // 创建新的音乐分类
        var musicCategory = new MusicCategory({
          name:musicCategoryName
        });
        // 保存新创建的音乐分类
        musicCategory.save(function(err) {
          if (err) {
            console.log(err);
          }
          res.redirect('/admin/music/musicCategory/list');
        });
      }
    });
  // 没有输入音乐名称或分类则重定向到该页
  }else {
    console.log('需要输入音乐分类或音乐名称');
    res.redirect('/admin/music/new');
  }
};

/* 更新音乐控制器 */
exports.update = function(req,res) {
  var _id = req.params.id;

  Music.findById(_id,function(err,music) {
    MusicCategory.find({},function(err,musicCategories) {
      if(err){
        console.log(err);
      }
      res.render('music/music_admin',{
        title:'豆瓣音乐后台更新页',
        logo:'music',
        music:music,
        musicCategories:musicCategories
      });
    });
  });
};

/* 音乐列表控制器 */
exports.list = function(req,res)  {
  Music.find({})
    .populate('musicCategory','name')
    .exec(function(err,musics){
      if(err){
        console.log(err);
      }
      res.render('music/music_list',{
        title:'豆瓣音乐列表页',
        logo:'music',
        musics:musics
      });
    });
};

/* 音乐列表删除音乐控制器 */
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id = req.query.id;
  // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
  if(id) {
    Music.findById(id, function(err,music) {        // 查找该条音乐信息
      if(err) {
        console.log(err);
      }
      // 查找包含这条音乐的音乐分类
      MusicCategory.findById(music.musicCategory, function(err, musicCategory) {
        if(err) {
          console.log(err);
        }
        // 在音乐分类musics数组中查找该值所在位置
        if(musicCategory) {
          var index = musicCategory.musics.indexOf(id);
          musicCategory.musics.splice(index,1);          // 从分类中删除该数据
          musicCategory.save(function(err) {             // 对变化的音乐分类数据进行保存
            if(err) {
              console.log(err);
            }
          });
        }
        Music.remove({_id:id}, function(err) {    			 // 音乐模型中删除该电影数据
          if(err) {
            console.log(err);
          }
          res.json({success:1});                  			 // 返回删除成功的json数据给游览器
        });
      });
    });
  }
};
