var Category = require('../../models/movie/movie_category');    // 电影分类数据模型

// 新建电影分类控制器
exports.new = function(req, res) {
  res.render('movie/movie_category_admin', {
    title: '豆瓣电影后台分类录入页',
    category: {}
  });
};

// 电影分类存储控制器
exports.save = function(req, res) {
  var category = req.body.category;
  // 判断新创建的电影分类是否已存在，避免重复输入
  Category.findOne({name: category.name}, function(err, _category) {
    if(_category) {
      console.log('电影分类已存在');
      res.redirect('/admin/movie/category/list');
    }else {
      var category = new Category(category);
      category.save(function(err, category) {
        if (err) {
          console.log(err);
        }
        res.redirect('/admin/movie/category/list');
      });
    }
  });
};

// 电影分类控制器
exports.list = function(req, res) {
  Category
    .find({})
    .populate({
      path:'movies',
      select:'title',
    })
    .exec(function(err,categories) {
      if(err) {
        console.log(err);
      }
      res.render('movie/movie_category_list',{
        title:'豆瓣电影分类列表页',
        categories:categories
      });
    });
};

// 电影分类列表删除控制器
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var id  = req.query.id;
  if(id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    Category.remove({_id:id},function(err,category) {
      if(err) {
          console.log(err);
      }
      res.json({success:1});
    });
  }
};
