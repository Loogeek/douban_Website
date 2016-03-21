'use strict';

var mongoose = require('mongoose'),
    CitySchema = require('../../schemas/movie/movie_city');

// 使用mongoose的模型方法编译生成模型
var City = mongoose.model('City',CitySchema);

// 将模型构造函数导出
module.exports = City;
