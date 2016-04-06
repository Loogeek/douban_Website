'use strict';

var mongoose = require('mongoose'),
    City = mongoose.model('City'),                    // 引入电影院模型
    CityCategory = mongoose.model('CityCategory'),    // 电影院分类模型
    CityProgramme = mongoose.model('CityProgramme');  // 电影院分类归类

// 电影院录入页面渲染控制器
exports.new = function(req, res) {
  City.find({},function(err,cities) {
    CityCategory.find({},function(err, cityCategories) {
      if(err) {
        console.log(err);
      }else {
        CityProgramme.find({},function(err, cityProgrammes) {
          if(err) {
            console.log(err);
          }else {
            res.render('movie/movie_city_admin', {
              title:'豆瓣电影后台影院录入页',
              logo:'movie',
              city:{},
              cities:cities || [],
              cityCategories:cityCategories || [],
              cityProgrammes:cityProgrammes || []
            });
          }
        });
      }
    });
  });
};

// 数据存储控制器
exports.save = function(req, res) {
  var cityObj = req.body.city,                      // 获取城市录入页发送的数据
      cityId = cityObj.cityId,                      // 所选城市名称
      cityName = cityObj.name,                      // 新建城市名称
      cinemas = cityObj.cinemas,                    // 新建电影院名称
      cityCategoryName = cityObj.cityCategoryName,  // 新建城市分类名称
      cityCategoryId = cityObj.cityCategoryId,      // 所选城市ID
      cityProgrammeName = cityObj.cityProgrammeName,// 新建城市分类归类名称
      cityProgrammeId = cityObj.cityProgrammeId;    // 所选分类归类的ID

  // 如果输入了城市归类名称
  if(cityProgrammeName) {
    CityProgramme.findOne({name:cityProgrammeName}, function(err,_cityProgramme) {
      if(err) {
        console.log(err);
      }
      // 如果归类已存在
      if(_cityProgramme) {
        console.log('城市分类归类已存在');
        res.redirect('/admin/movie/city/new');
      // 新建分类归类
      }else {
        var newCityProgramme = new CityProgramme({
          name:cityProgrammeName,               // 城市分类名称
        });
        newCityProgramme.save(function(err) {
          if(err) {
            console.log(err);
          }
          res.redirect('/admin/movie/city/new');
        });
      }
    });
  // 如果选择了分类归类
  }else if (cityProgrammeId) {
    CityProgramme.findById(cityProgrammeId, function(err, _oldCityProgramme) {
      // 如果输入了城市分类名称
      if(cityCategoryName) {
        CityCategory.findOne({name:cityCategoryName}, function(err,_cityCategory) {
          if(err) {
            console.log(err);
          }
          // 城市分类已存在
          if(_cityCategory) {
            console.log('城市分类已存在');
            res.redirect('/admin/movie/city/new');          // 重定向到电影院输入页
          }else {
            // 新建城市分类
            var newCityCategory = new CityCategory({
              name:cityCategoryName                         // 城市分类名称
            });
            newCityCategory.cityProgramme = cityProgrammeId;// 分类归类属性指向当前归类
            _oldCityProgramme.cityCategories.push(newCityCategory._id);
            newCityCategory.save(function(err) {
              if(err) {
                console.log(err);
              }
              _oldCityProgramme.save(function(err) {
                if(err) {
                  console.log(err);
                }
                res.redirect('/admin/movie/city/list');
              });
            });
          }
        });
      }
      // 如果没有创建或选择城市分类则创建失败 重定向到当前页面
      else {
        console.log('需要添加城市分类');
        res.redirect('/admin/movie/city/new');
      }
    });
  // 如果选择了城市分类ID
  }else if (cityCategoryId) {
    // 如果输入了城市名称
    if (cityName) {
      City.findOne({name:cityName}, function(err,_city) {
        if (err) {
          console.log(err);
        }
        if (_city) {
          console.log('城市已存在');
          res.redirect('/admin/movie/city/new');
        }else {
          var newCity = new City({
            name:cityName
          });
          var cityCategoryArray = [];
          // 判断选择了几个城市分类，如果只选择一个，则cityCategoryId值为String，否则为Array
          if(typeof cityCategoryId === 'string') {
            cityCategoryArray.push(cityCategoryId);
          }else {
            cityCategoryArray = cityCategoryId;
          }
          for(var i = 0; i < cityCategoryArray.length; i++) {
            CityCategory.findById(cityCategoryArray[i], function(err, _oldCityCategory) {
              if(_oldCityCategory) {
                newCity.cityCategories.push(_oldCityCategory._id);
                _oldCityCategory.cities.push(newCity._id);
                _oldCityCategory.save(function(err) {
                  if(err) {
                    console.log(err);
                  }
                  newCity.save(function(err) {
                    if(err) {
                      console.log(err);
                    }
                  });
                });
              }
            });
          }
          res.redirect('/admin/movie/city/list');
        }
      });
    // 需要输入城市名
    }else {
      console.log('需要添加城市名称');
      res.redirect('/admin/movie/city/new');
    }
  // 如果选择了城市名
  }else if (cityId) {
    // 如果输入了电影院名称
    if (cinemas) {
      City.findById(cityId,function(err,_city) {
        // 如果该城市中电影院不存在 则添加到该城市的cinemas属性中并保存
        if(_city.cinemas.indexOf(cinemas) === -1) {
          _city.cinemas.push(cinemas);
          _city.save(function(err) {
            if (err) {
              console.log(err);
            }
            res.redirect('/admin/movie/city/list');
          });
        }else {
          console.log('电影院已存在');
          res.redirect('/admin/movie/city/new');
        }
      });
    }else {
      console.log('需要输入电影院名称');
      res.redirect('/admin/movie/city/new');
    }
  // 其余操作均无法添加数据
  }else {
    console.log('录入电影院数据失败');
    res.redirect('/admin/movie/city/new');
  }
};

// 电影院列表控制器
exports.list = function(req, res) {
  CityCategory.find({})
    .populate('cities','name cinemas')
    .populate('cityProgramme','name')
    .exec(function(err, cityCategoryList) {
      if (err) {
        console.log(err);
      }
      res.render('movie/movie_city_list', {
        title:'豆瓣电影影院分类列表页',
        logo:'movie',
        cityCategoryList:cityCategoryList,
      });
    });
};

// 电影院列表删除控制器
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id  = req.query.id;
  if(id) {
    // 查找该条城市分类
    CityCategory.findById(id, function(err,_cityCategory) {
      if (err) {
        console.log(err);
      }
      // 查找该城市分类所对应的归类
      CityProgramme.findById(_cityCategory.cityProgramme, function(err,_cityProgramme) {
        if (_cityProgramme) {
          if (err) {
            console.log(err);
          }
          // 将该分类从归类的数组中删除并保存
          var index = _cityProgramme.cityCategories.indexOf(id);
          _cityProgramme.cityCategories.splice(index,1);
          _cityProgramme.save(function(err){
            if (err) {
              console.log(err);
            }
          });
        }
      });
      var cityArray = [];
      // 判断删除城市分类中包含几个城市，如果只有一个，则_cityCategory.cities值为String，否则为Array
      if(typeof _cityCategory.cities === 'string') {
        cityArray.push(_cityCategory.cities);
      }else {
        cityArray = _cityCategory.cities;
      }
      // 将该分类下存储的城市都删除
      for(var i = 0; i < cityArray.length; i++) {
        City.remove({_id:cityArray[i]}, function(err) {
          if(err) {
            console.log(err);
          }
        });
      }
      // 删除该城市分类
      CityCategory.remove({_id:id}, function(err) {
        if(err) {
          console.log(err);
        }
        res.json({success:1});        // 返回删除成功
      });
    });
  }
};
