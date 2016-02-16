var MusicCategory = require('../../models/music/music_category'), // 音乐数据模型
    Programme = require('../../models/music/music_programme'), // 音乐榜单分类数据模型
    underscore = require('underscore');                      // 该模块用来对变化字段进行更新

// 音乐分类后台录入页控制器
exports.new = function(req, res) {
  // 输出当前全部的音乐榜单
  Programme.find({},function(err, programmes) {
    res.render('music/music_category_admin', {
      title: '豆瓣音乐后台分类录入页',
      programmes: programmes,
      musicCategory: {}
    });
  });
};

// 保存音乐分类控制器
exports.save = function(req, res) {
  var id = req.body.musicCategory._id,                     // 获取当前分类的id值
      musicCategoryObj = req.body.musicCategory,           // 获取当前填写的音乐分类
      programmeId = musicCategoryObj.programmeId,         // 获取填写的音乐榜单分类ID
      programmeName = musicCategoryObj.programmeName,     // 获取榜单分类名
      musicCategory = new MusicCategory(musicCategoryObj);// 创建一个新音乐分类数据

  musicCategory.save(function(err, _musicCategory) {
    if (err) {
      console.log(err);
    }
    // 选择了热门榜单分类
    if(programmeId) {
      Programme.findById(programmeId,function(err, programme) {
        programme.musicCategories.push(_musicCategory._id);
        programme.save(function(err, programme) {
          res.redirect('/admin/music/programme/list');
        });
      });
    // 输入新的音乐榜单分类
    }else if(programmeName) {
      MusicCategory.findOne({name: programmeName}, function(err, _programme) {
        if(err) {
          console.log(err);
        }
        if(_programme) {
          console.log('音乐榜单分类已存在');
          res.redirect('/admin/music/programme/list');
        }else {
          // 创建新的音乐榜单分类
          var programme = new Programme( {
            name: programmeName,
            musicCategories: [_musicCategory._id]
          });
          // 保存新创建的音乐榜单分类
          programme.save(function(err, programme) {
            // 将新创建的音乐榜单保存，programme的ID值为对应的分类ID值
            // 这样可通过populate方法进行相应值的索引
            _musicCategory.programme = programme._id;
            _musicCategory.save(function(err) {
              res.redirect('/admin/music/programme/list');
            });
          });
        }
      });
    }
  });
};

// 音乐分类列表页控制器
exports.list = function(req, res) {
  MusicCategory
    .find({})
    .populate({
      path: 'musics',
      select: 'title image singer version summary pv',
    })
    .exec(function(err, musicCategories) {
      if(err) {
        console.log(err);
      }
      res.render('music/music_category_list', {
        title: '豆瓣音乐分类列表页',
        musicCategories: musicCategories
      });
    });
};

// 音乐分类列表删除音乐控制器
exports.del = function(req, res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id = req.query.id;
  if(id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    MusicCategory.remove({_id:id}, function(err, musicCategory) {
      if(err) {
        console.log(err);
      }
      res.json({success:1});
    });
  }
};

// 豆瓣音乐分类详细页面控制器
exports.detail = function(req, res) {
  var _id = req.params.id;
  // 音乐用户访问统计，每次访问音乐详情页，PV增加1
  MusicCategory.update({_id:_id},{$inc:{pv:1}},function(err) {
    if(err) {
      console.log(err);
    }
  });
};

// 更新音乐控制器
exports.update = function(req,res) {
  var _id = req.params.id;
  MusicCategory.findById(_id,function(err,music) {
    MusicCategory.find({},function(err,musicCategories) {
      if(err) {
        console.log(err);
      }
      res.render('music/admin', {
        title: '豆瓣音乐后台更新页',
        music: music,
        musicCategories: musicCategories
      });
    });
  });
};
