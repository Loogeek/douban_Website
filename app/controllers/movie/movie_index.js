'use strict';

/* 与首页进行交互 */
var mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),                // 电影数据模型
    Category = mongoose.model('Category'),          // 电影分类模型
    City = mongoose.model('City'),                  // 引入电影院模型
    CityCategory = mongoose.model('CityCategory'),  // 电影院分类模型
    CityProgramme = mongoose.model('CityProgramme');// 电影院分类股归类

/* 电影首页控制器 */
exports.index = function(req,res){
  var _galleryName = req.query.galleryName,         // 获取正在上映和即将上映播放标题名
      _fliterName = req.query.fliterName,           // 选电影/选电视剧区电影分类标题名称
      _cityName = req.query.cityName,               // 电影院所在城市
      _searchName = req.query.search;               // 影院搜索框输入的电影院名称

  // 如果是电影院搜索框中发送了Ajax请求
  if(_cityName) {
    // 通过城市名查找该城市对应的电影院
    City.findOne({name:_cityName})
      .exec(function(err,searchResults) {
        if(err) {
          console.log(err);
        }
        var results = [];
        if(searchResults) {
          var searchCinemas = searchResults.cinemas;  // 获取该城市的电影院列表
          // 如果用户输入了电影院名称
          if(_searchName) {
            // 通过循环将输入的影院名与该城市所有的电影院进行对比，返回匹配成功的影院
            // 其中匹配成功的如[ '广州', index: 0, input: '广州飞扬影城正佳店' ]所示
            searchCinemas.forEach(function(each) {
              if(each.match(_searchName) && each.match(_searchName).input) {
                results.push(each);
              }
            });
          // 返回该城市对应的全部电影院列表
          }else {
            results = searchCinemas;
          }
          res.json(results);
        }
      });
  // 如果是选电影/选电视剧区发送的分类切换请求
  }else if(_fliterName) {
    Category
      .findOne({name:_fliterName})
      .populate({
        path:'movies',
        select:'title poster'
      })
      .exec(function(err,category){
        if(err){
          console.log(err);
        }
        res.json({data:category});
      });
  // 顶部正在上映和即将上映电影展示区切换
  }else if(_galleryName) {
    Category
      .findOne({name:_galleryName})
      .populate({
        path:'movies',
        select:'title poster'
      })
      .exec(function(err,category) {
        if(err){
          console.log(err);
        }
        res.json({data:category});
      });
  // 没有发送上面请求的则渲染豆瓣电影主页
  }else {
    Category
      .find({})
      .populate({
        path:'movies',
        select:'title poster'
      })
      .exec(function(err,categories) {
        if(err){
          console.log(err);
        }
        City.find({})
          .exec(function(err,cinemas) {
            if(err){
              console.log(err);
            }
            CityProgramme.find({})
              .populate('cityCategories', 'name')
              .exec(function(err, cityProgrammeList) {
                if(err){
                  console.log(err);
                }
                CityCategory.find({})
                  .populate('cities','name')
                  .populate('cityProgramme','name')
                  .exec(function(err,cityCategoryList) {
                    if(err){
                      console.log(err);
                    }
                    res.render('movie/movie_index',{
                      title:'豆瓣电影首页',
                      logo:'movie',
                      categories:categories,
                      cinemas:cinemas,
                      cityProgrammeList:cityProgrammeList,
                      cityCategoryList:cityCategoryList
                    });
                  });
              });
          });
      });
    }
};

/* 首页电影分类及电影搜索 */
exports.search = function(req,res) {
  var catId = req.query.cat || '',           // 获取电影分类查询串ID
      q = req.query.q || '',                 // 获取搜索框提交内容
      page = parseInt(req.query.p, 10) || 0, // 获取页面
      count = 6,
      index = page * count;                  // 每页展示6条数据
  // 如果包含catId，则是点击了相应的电影分类标题，进入results页面显示相应电影分类的电影
  if(catId) {
    // 电影分类功能
    Category
      .find({_id:catId})
      .populate({
        path:'movies',
        select:'title poster'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err);
        }
        var category = categories[0] || {},            		// 查询到的电影分类
            movies = category.movies || [],            		// 分类中包含的电影
            results = movies.slice(index, index + count); // 分类页面每页显示的电影数量

        res.render('movie/movie_results', {
          title:'豆瓣电影分类列表页面',
          logo:'movie',                                   // 显示电影logo
          keyword:category.name,                      		// 分类名称
          currentPage:(page + 1),                       	// 当前页
          query:'cat=' + catId,                        		// 分类名称
          totalPage:Math.ceil(movies.length / count),  		// 总页数，需向上取整
          movies:results                               		// 查询到电影分类下所含的电影
        });
      });
  }else{
    // 搜索功能
    Movie
      .find({title:new RegExp(q + '.*', 'i')})            // 通过正则匹配查询电影的名称
      .exec(function(err, movies) {
        if (err) {
          console.log(err);
        }
        var results = movies.slice(index, index + count);
        res.render('movie/movie_results', {
          title:'豆瓣电影搜索结果列表页面',
          logo:'movie',
          keyword:q,
          currentPage:(page + 1),
          query:'q=' + q,
          totalPage:Math.ceil(movies.length / count),
          movies:results
        });
      });
  }
};

//电影首页广告链接页面
exports.fullpage = function(req,res){
  res.render('movie/movie_fullpage',{
    title:'豆瓣电影广告页面'
  });
};
