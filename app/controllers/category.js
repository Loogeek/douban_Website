var Category = require('../models/category');    //电影数据模型

// admin new page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: 'imooc 后台分类录入页',
        category: {}
    });
};

// admin post movie
exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err, category) {
        if (err) {
            console.log(err);
        }

       res.redirect('/admin/category/list');
  });
};

// catelist page
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('categorylist', {
            title: 'imooc 分类列表页',
            categories: categories
        });
    });
};

//list delete category 电影分类列表删除电影路由
exports.del = function(req,res){
    //获取客户端Ajax发送的URL值中的id值
    var id  = req.query.id;
    if(id){
        //如果id存在则服务器中将该条数据删除并返回删除成功的json数据
        Category.remove({_id:id},function(err,category){
            if(err){
                console.log(err);
            }
            res.json({success:1});
        });
    }
};