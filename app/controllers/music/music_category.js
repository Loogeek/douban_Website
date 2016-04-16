'use strict';

var mongoose = require('mongoose'),
    MusicCategory = mongoose.model('MusicCategory'),      // 引入音乐分类模型
    Programme = mongoose.model('Programme'),              // 引入近期热门歌单区域模型
    _ = require('underscore');                            // 该模块用来对变化字段进行更新

// 音乐分类后台录入页控制器
exports.new = function(req, res) {
  // 输出当前全部的音乐榜单
  Programme.find({},function(err, programmes) {
    res.render('music/music_category_admin', {
      title:'豆瓣音乐后台分类录入页',
      logo:'music',
      programmes:programmes,
      musicCategory:{}
    });
  });
};

// 保存音乐分类控制器
exports.save = function(req, res) {
  var musicCategoryObj = req.body.musicCategory,      // 获取当前填写的音乐分类
      musicCatId = musicCategoryObj._id,              // 如果存在则是对已存在音乐分类的更新
      musicCatName = musicCategoryObj.name,           // 输入的分类名称
      programmeId = musicCategoryObj.programme,       // 获取填写的音乐榜单分类ID
      programmeName = musicCategoryObj.programmeName; // 获取榜单分类名
  // 如果musicCatId值存在，则说明是对已存在音乐分类数据进行更新
  if (musicCatId) {
    // 查找原音乐分类
    MusicCategory.findById(musicCatId,function(err,_musicCat) {
      if(err) {
        console.log(err);
      }
      // 如果输入后歌曲榜单与原歌曲榜单不同，则说明更新了音乐榜单
      if (programmeId.toString() !== _musicCat.programme.toString()) {
        // 如果原歌曲榜单存在
        if (_musicCat.programme.length > 0) {
          Programme.findById(_musicCat.programme,function(err,_oldProgramme) {
            if (err) {
              console.log(err);
            }
            // 在原歌曲榜单的musicCategories属性中找到该歌曲分类的musicCatId值并将其删除
            var index = _oldProgramme.musicCategories.indexOf(musicCatId);
            _oldProgramme.musicCategories.splice(index,1);
            _oldProgramme.save(function(err) {
              if (err) {
                console.log(err);
              }
            });
          });
        }
        // 找到音乐分类对应的新歌曲榜单
        Programme.findById(programmeId,function(err,_newProgramme) {
          if (err) {
            console.log(err);
          }
          // 将其musicCatId值添加到musicCategories属性中并保存
          _newProgramme.musicCategories.push(musicCatId);
          _newProgramme.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        });
      }
      // 使用underscore模块的extend函数更新修改的音乐分类字段
      _musicCat = _.extend(_musicCat,musicCategoryObj);
      _musicCat.save(function(err) {
        if(err){
          console.log(err);
        }
        res.redirect('/admin/music/programme/list');
      });
    });
  // 如果不是更新音乐分类，并且输入了音乐分类名称
  }else if(musicCatName) {
    // 查找输入的音乐分类名称是否已存在
    MusicCategory.findOne({name:musicCatName}, function(err,_musicCatName) {
      if(err) {
        console.log(err);
      }
      if (_musicCatName) {
        console.log('音乐分类已存在');
        res.redirect('/admin/music/programme/list');
      }else {
        // 创建一个新音乐分类数据
        var musicCategory = new MusicCategory({
          name:musicCatName
        });
        musicCategory.save(function(err, _newMusicCategory) {
          if (err) {
            console.log(err);
          }
          // 如果选择了热门榜单分类
          if(programmeId) {
            Programme.findById(programmeId,function(err, programme) {
              if(err) {
                console.log(err);
              }
              // 将该音乐分类添加到榜单分类的属性中
              programme.musicCategories.push(_newMusicCategory._id);
              programme.save(function(err) {
                if(err) {
                  console.log(err);
                }
                // 新建音乐分类的programme指向该榜单
                _newMusicCategory.programme = programmeId;
                _newMusicCategory.save(function(err) {
                  if(err) {
                    console.log(err);
                  }
                });
                res.redirect('/admin/music/programme/list');
              });
            });
          // 输入新的音乐榜单分类
          }else if(programmeName) {
            Programme.findOne({name:programmeName}, function(err, _programme) {
              if(err) {
                console.log(err);
              }
              if(_programme) {
                console.log('音乐榜单分类已存在');
                res.redirect('/admin/music/programme/list');
              }else {
                var newProgramme = new Programme({
                  name:programmeName,
                  musicCategories:_newMusicCategory._id
                });
                // 保存新创建的音乐榜单分类
                newProgramme.save(function(err, _newProgramme) {
                  if (err) {
                    console.log(err);
                  }
                  if (_newMusicCategory) {
                    // 将新创建的音乐榜单保存，programme的ID值为对应的分类ID值
                    // 这样可通过populate方法进行相应值的索引
                    _newMusicCategory.programme = _newProgramme._id;
                    _newMusicCategory.save(function(err) {
                      if(err) {
                        console.log(err);
                      }
                    });
                  }
                  res.redirect('/admin/music/programme/list');
                });
              }
            });
          }else {
            res.redirect('/admin/music/programme/list');
          }
        });
      }
    });
  // 如果只输入了榜单名称
  }else if(programmeName) {
    // 查找输入的榜单名称是否已存在
    Programme.findOne({name:programmeName}, function(err, _programme) {
      if(err) {
        console.log(err);
      }
      if(_programme) {
        console.log('音乐榜单分类已存在');
        res.redirect('/admin/music/programme/list');
      }else {
        var newProgramme = new Programme({
          name:programmeName
        });
        // 保存新创建的音乐榜单分类
        newProgramme.save(function(err) {
          if (err) {
            console.log(err);
          }
          res.redirect('/admin/music/programme/list');
        });
      }
    });
  // 其他操作值重定向到list页
  }else {
    res.redirect('/admin/music/programme/list');
  }
};

// 音乐分类列表页控制器
exports.list = function(req, res) {
  MusicCategory
    .find({})
    .populate({
      path:'musics',
      select:'title image singer version summary pv',
    })
    .exec(function(err, musicCategories) {
      if(err) {
        console.log(err);
      }
      res.render('music/music_category_list', {
        title:'豆瓣音乐分类列表页',
        logo:'music',
        musicCategories:musicCategories
      });
    });
};

// 豆瓣音乐分类详细页面控制器
exports.detail = function(req) {
  var _id = req.params.id;
  // 音乐用户访问统计，每次访问音乐详情页，PV增加1
  MusicCategory.update({_id:_id},{$inc:{pv:1}},function(err) {
    if(err) {
      console.log(err);
    }
  });
};

// 更新音乐分类控制器
exports.update = function(req,res) {
  var _id = req.params.id;
  MusicCategory.findById(_id, function(err,musicCategory) {
    Programme.find({}, function(err,programmes) {
      if(err) {
        console.log(err);
      }
      res.render('music/music_category_admin', {
        title:'豆瓣音乐后台更新页',
        logo:'music',
        musicCategory:musicCategory,
        programmes:programmes
      });
    });
  });
};

// 音乐分类列表删除音乐控制器
exports.del = function(req, res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id = req.query.id;
  if(id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    MusicCategory.remove({_id:id}, function(err) {
      if(err) {
        console.log(err);
      }
      res.json({success:1});
    });
  }
};
