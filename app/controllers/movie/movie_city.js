var City = require('../../models/movie/movie_city'),                  // 电影影院数据模型
    CityCategory = require('../../models/movie/movie_cityCategory'),  // 电影院分类模型
    CityProgramme = require('../../models/movie/movie_cityProgramme');// 电影院分类股归类
// 电影院录入页面渲染控制器
exports.new = function(req, res) {
  CityCategory.find({})
    .exec(function(err, cityCategories) {
      if(err) {
        console.log(err);
      }else {
        CityProgramme.find({}).exec(function(err, cityProgrammes) {
          if(err) {
            console.log(err);
          }else {
            res.render('movie/movie_city_admin', {
              title: '豆瓣电影后台影院录入页',
              city: {},
              cityCategories: cityCategories || [],
              cityProgrammes: cityProgrammes || []
            });
          }
        });
      }
  });
};

// 数据存储控制器
exports.save = function(req, res) {
  var cityObj = req.body.city,                      // 获取城市录入页发送的数据
      cityName = cityObj.name,                      // 新建城市名称
      cinemas = cityObj.cinemas,                    // 新建电影院名称
      cityCategoryName = cityObj.cityCategoryName,  // 新建城市分类名称
      cityCategoryId = cityObj.cityCategoryId,      // 所选城市ID
      cityProgrammeName = cityObj.cityProgrammeName,// 新建城市分类归类名称
      cityProgrammeId = cityObj.cityProgrammeId;    // 所选分类归类的ID
  // 建立城市分类和归类之间的联系  比如A <-> A-G
  if(!cityName && cityProgrammeId && cityCategoryId) {
    CityProgramme.findById(cityProgrammeId, function(err,_oldCityProgramme) {
      CityCategory.findById(cityCategoryId, function(err, _oldCityCategory) {
        _oldCityCategory.cityProgramme = _oldCityProgramme._id;
        _oldCityProgramme.cityCategories.push(_oldCityCategory._id);
        _oldCityProgramme.save(function(err) {
          if(err) {
            console.log(err);
          }
          _oldCityCategory.save(function(err) {
            if(err) {
              console.log(err);
            }
            res.redirect('/admin/movie/city/new');
          });
        });
      });
    });
  }
  // 如果输入了城市归类名称
  if(cityProgrammeName) {
    CityProgramme.findOne({name: cityProgrammeName}, function(err,_cityProgramme) {
      if(err) {
        console.log(err);
      }
      // 如果归类已存在
      if(_cityProgramme) {
        console.log('城市分类归类已存在');
        res.redirect('/admin/movie/city/new');
      // 新建归类
      }else {
        var newCityProgramme = new CityProgramme({
          name: cityProgrammeName,               // 城市分类名称
        });
        newCityProgramme.save(function(err, _newCityProgramme) {
          if(err) {
            console.log(err);
          }
          // 如果没有输入城市分类及城市名称
          if(!cityCategoryName && !cityName) {
            res.redirect('/admin/movie/city/new');
          }
        });
      }
    });
  }
  // 如果输入了城市分类名称
  if(cityCategoryName) {
    CityCategory.findOne({name: cityCategoryName}, function(err, _cityCategory) {
      if(err) {
        console.log(err);
      }
      // 城市分类已存在
      if(_cityCategory) {
        console.log('城市分类已存在');
        res.redirect('/admin/movie/city/new');          // 重定向到电影院列表页
      }else {
        var newCityCategory = new CityCategory({
          name: cityCategoryName,                       // 城市分类名称
        });
        // 保存新建城市分类
        newCityCategory.save(function(err, _newCityCategory) {
          if(err) {
            console.log(err);
          }
          if(!cityName) {
            res.redirect('/admin/movie/city/new');
          }
        });
      }
    });
  }
  // 输入了城市名称
  if(cityName) {
    City.findOne({name: cityName}, function(err, _city) {
      if(err) {
        console.log(err);
      }
      // 如果城市已存在
      if(_city && _city.cinemas) {
        // 若电影院不存在
        if(_city.cinemas.indexOf(cinemas) === -1) {
          _city.cinemas.push(cinemas);                   // 将电影院添加到该城市列表中
          _city.save(function(err, _city) {
            if (err) {
              console.log(err);
            }
            res.redirect('/admin/movie/city/list');    // 重定向到电影院列表页
          });
        // 电影院已存在,重定向到该页面，不能重复输入相同电影院
        }else {
          res.redirect('/admin/movie/city/new');
        }
      // 城市不存在，则新建城市
      }else {
        var newCity = new City(cityObj),
            cityCategoryArray = [],
            n = 0;
        newCity.save(function(err, _newCity) {
          if (err) {
            console.log(err);
          }
          // 判断选择了几个城市分类，如果只选择一个，则cityCategoryId值为String，否则为Array
          if(typeof cityCategoryId === 'string') {
            cityCategoryArray.push(cityCategoryId);
          }else {
            cityCategoryArray = cityCategoryId;
          }
          for(var i = 0; i < cityCategoryArray.length; i++) {
            CityCategory.findById(cityCategoryArray[i], function(err, _oldCityCategory) {
              if(_oldCityCategory) {
                _newCity.cityCategory.push(_oldCityCategory._id);// 新建城市分类指向该分类
                _oldCityCategory.cities.push(_newCity._id);      // 将该新建城市添加到分类中
                _oldCityCategory.save(function(err) {
                  if(err) {
                    console.log(err);
                  }
                  if(n === cityCategoryArray.length - 1) {
                    _newCity.save(function(err) {
                      if(err) {
                        console.log(err);
                      }
                    });
                    res.redirect('/admin/movie/city/list');
                  }
                  n ++;
                });
              }
            });
          }
        });
      }
    });
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
        title: '豆瓣电影影院分类列表页',
        cityCategoryList: cityCategoryList,
      });
    });
};

// 电影院列表删除控制器
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id  = req.query.id;
  if(id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    // 删除该城市分类
    CityCategory.remove({_id: id}, function(err) {
      if(err) {
        console.log(err);
      }
      res.json({success: 1});        // 返回删除成功
    });
  }
};
