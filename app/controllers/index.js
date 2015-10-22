//和首页进行交互
var Movie = require('../models/movie');
var Category = require('../models/category');
var City = require('../models/city');
// index page 主页路由
//首页电影
exports.index = function(req,res){
	var _galleryName = req.query.galleryName;//获取正在上映和即将上映播放标题名
	var _className = req.query.className;   //选电影区电影分类标题名称
	var _cityName = req.query.suggest;	    //影院搜索区城市名称
	var _searchName = req.query.search;     //影院搜索框输入的影院名
	//如果发送了搜索电影院请求，获取当前城市名及搜索影院名称
	if(_searchName && _cityName){
		City.findOne({cityName:_cityName})
			.exec(function(err,searchName){

				var results = [];
				if(searchName){
					var searchArr = searchName.name;
					//通过正则获取影院名，其中先将对象转换成字符串后使用字符串的match方法
					//[^\u0000-\u00FF]{0,}表示匹配零或多个中文字符
					results = searchArr.toString().match(new RegExp('[^\\u0000-\\u00FF]{0,}'+_searchName+'[^\\u0000-\\u00FF]{0,}','g'));
					if(err){
						console.log(err);
					}
					res.json(results);					
				}
			});
	//如果在影院搜索框中输入影院名称			
	}else if(_cityName){
		City.findOne({cityName:_cityName})
			.exec(function(err,name){
				// console.log(name);
				if(err){
					console.log(err);
				}
				res.json({data:name});					
			});
	//如果电影区发送了分类切换请求				
	}else if(_className){
		Category
			.findOne({name:_className})
			.populate({
				path:'movies',
				select:'title poster',
				option:{limit:6}        //限制最多6条数据
			})  
			.exec(function(err,category){	
				// console.log(category);
				if(err){
					console.log(err);
				}
				res.json({data:category});			
			});	
	//顶部正在上映和即将上映电影展示区切换		
	}else if(_galleryName){
		Category
			.findOne({name:_galleryName})
			.populate({
				path:'movies',
				select:'title poster',
				option:{limit:6}        //限制最多6条数据
			})  
			.exec(function(err,category){	
				if(err){
					console.log(err);
				}
				res.json({data:category});			
			});			
	}else{
		Category
			.find({})
			.populate({
				path:'movies',
				select:'title poster',
				option:{limit:6}        //限制最多6条数据
			})  
			.exec(function(err,categories){
				// console.log(categories);	
				if(err){
					console.log(err);
				}
				res.render('index',{
					title:'豆瓣电影首页',
					categories:categories
				});				
			});		
		}
};

//首页电影搜索
exports.search = function(req,res){
	var catId = req.query.cat;  //获取查询串
	var q = req.query.q;        //获取搜索框提交内容
	var page = req.query.p;     //获取页面
	page = parseInt(req.query.p, 10) || 0;
	var count = 6;
	var index = page * count; //每页展示6条数据

	if(catId){
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
		var category = categories[0] || {};
		var movies = category.movies || [];
		var results = movies.slice(index, index + count);

		res.render('results', {
			title: '豆瓣电影搜索结果列表页面',
			keyword: category.name,
			currentPage: (page + 1),      
			query: 'cat=' + catId,
			totalPage: Math.ceil(movies.length / count),  
				movies: results
			});
		});
	}else{
		//搜索功能
		Movie
			.find({title: new RegExp(q + '.*', 'i')})
			.exec(function(err, movies) {
				if (err) {
					console.log(err);
				}
				var results = movies.slice(index, index + count);

				res.render('results', {
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

//index fullpage
exports.fullpage = function(req,res){
	res.render('fullpage',{
		title:'豆瓣电影广告页面'
	});
};
