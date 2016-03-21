'use strict';

var mongoose = require('mongoose'),
    CityCategorySchema = require('../../schemas/movie/movie_cityCategory');

// 使用mongoose的模型方法编译生成模型
var CityCategory = mongoose.model('CityCategory',CityCategorySchema);

// 将模型构造函数导出
module.exports = CityCategory;
