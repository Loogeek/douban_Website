//和首页进行交互
// index page 主页路由
var Movie = require('../models/movie');
var Category = require('../models/category');
exports.index = function(req,res){
	Category
		.find({})
		.populate({
			path:'movies',
			select:'title poster',
			option:{limit:6}        //限制最多6条数据
		})  
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
			res.render('index',{
				title:'imooc 首页',
				categories:categories
			});				
		});
};

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