/* 与首页进行交互 */
var Movie = require('../../models/movie/movie');							// 引入电影模型
var Category = require('../../models/movie/movie_category');	// 引入电影分类模型
var City = require('../../models/movie/movie_city');					// 引入电影院模型

/* 电影首页控制器 */
exports.index = function(req,res){
	var _galleryName = req.query.galleryName,	// 获取正在上映和即将上映播放标题名
			_fliterName = req.query.fliterName,   // 选电影/选电视剧区电影分类标题名称
			_cityName = req.query.cityName,	    	// 电影院所在城市
			_searchName = req.query.search;    	  // 影院搜索框输入的电影院名称
	// 如果搜索框中输入了电影院名称
	if(_searchName && _cityName) {
		City.findOne({cityName: _cityName})
			.exec(function(err,searchName) {
				var results = [];
				if(searchName) {
					console.log(11);
					var searchArr = searchName.name;
					// 通过正则获取影院名，其中先将对象转换成字符串后使用字符串的match方法
					// [^\u0000-\u00FF]{0,}表示匹配零或多个中文字符
					results = searchArr.toString().match(new RegExp('[^\\u0000-\\u00FF]{0,}'+_searchName+'[^\\u0000-\\u00FF]{0,}','g'));
					if(err) {
						console.log(err);
					}
					res.json(results);
				}
			});
	// 如果在只选择了电影院所在城市，没有输入电影院名称
	}else if(_cityName){
		City.findOne({cityName:_cityName})
			.exec(function(err,name){
				console.log(name);
				if(err){
					console.log(err);
				}
				res.json({data: name});
			});
	// 如果是选电影/选电视剧区发送的分类切换请求
	}else if(_fliterName){
		Category
			.findOne({name: _fliterName})
			.populate({
				path:'movies',
				select:'title poster',
				option:{limit: 6}        					//限制最多6条数据
			})
			.exec(function(err,category){
				if(err){
					console.log(err);
				}
				res.json({data: category});
			});
	// 顶部正在上映和即将上映电影展示区切换
	}else if(_galleryName){
		Category
			.findOne({name: _galleryName})
			.populate({
				path:'movies',
				select:'title poster',
				option:{limit: 6}        					//限制最多6条数据
			})
			.exec(function(err,category) {
				if(err){
					console.log(err);
				}
				res.json({data: category});
			});
	// 渲染豆瓣电影主页
	}else {
		Category
			.find({})
			.populate({
				path:'movies',
				select:'title poster',
				option:{limit: 6}        //限制最多6条数据
			})
			.exec(function(err,categories) {
				if(err){
					console.log(err);
				}
				res.render('movie/movie_index',{
					title:'豆瓣电影首页',
					categories: categories
				});
			});
		}
};

/* 首页电影分类及电影搜索 */
exports.search = function(req,res) {
	var catId = req.query.cat || '',					// 获取电影分类查询串ID
			q = req.query.q || '',   							// 获取搜索框提交内容
			page = req.query.p || 0,     					// 获取页面
			count = 6,
			index = page * count; 								// 每页展示6条数据
	page = parseInt(req.query.p, 10) || 0;
	// 如果包含catId，则是点击了相应的电影分类标题，进入results页面显示相应电影分类的电影
	if(catId) {
		// 电影分类功能
		Category
			.find({_id: catId})
			.populate({
				path: 'movies',
				select: 'title poster'
		})
		.exec(function(err, categories) {
			if (err) {
				console.log(err);
			}
			var category = categories[0] || {},						// 查询到的电影分类
					movies = category.movies || [],						// 分类中包含的电影
					results = movies.slice(index, index + count); // 分类页面每页显示的电影数量

			res.render('movie/movie_results', {
				title: '豆瓣电影分类列表页面',
				keyword: category.name,											// 分类名称
				currentPage: (page + 1),										// 当前页
				query: 'cat=' + catId,											// 切换到另一页
				totalPage: Math.ceil(movies.length / count),// 总页数，需向上取整
				movies: results 														// 查询到电影分类下所含的电影
			});
		});
	}else{
		// 搜索功能
		Movie
			.find({title: new RegExp(q + '.*', 'i')}) 		// 通过正则匹配查询电影的名称
			.exec(function(err, movies) {
				if (err) {
					console.log(err);
				}
				var results = movies.slice(index, index + count);
				res.render('movie/movie_results', {
					title: '豆瓣电影搜索结果列表页面',
					keyword: q,
					currentPage: (page + 1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / count),
					movies: results
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
