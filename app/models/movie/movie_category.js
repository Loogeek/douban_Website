'use strict';

var mongoose = require('mongoose'),
    CategorySchema = require('../../schemas/movie/movie_category');

// 使用mongoose的模型方法编译生成模型
var Category = mongoose.model('Category',CategorySchema);

// 将模型构造函数导出
module.exports = Category;
