//和首页进行交互
var Movie = require('../models/movie');
var Category = require('../models/category');
var City = require('../models/city');
// index page 主页路由
//首页电影
exports.index = function(req,res){
	var _className = req.query.className;   //选电影区电影分类标题名称
	var _cityName = req.query.cityName;	   //电影搜索区城市名称

	//如果电影区发送了分类切换请求
	if(_className){
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
	//如果发送了搜索电影院请求
	}else if(_cityName){
		City.findOne({cityName:_cityName})
			.exec(function(err,name){
				if(err){
					console.log(err);
				}
				res.json({data:name});					
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
					title:'imooc 首页',
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
	var count = 2;
	var index = page * count; //每页展示2条数据

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
			title: 'imooc 结果列表页面',
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
					title: 'imooc 结果列表页面',
					keyword: q,
					currentPage: (page + 1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				});
			});
	}
};
