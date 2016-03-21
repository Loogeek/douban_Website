'use strict';

var mongoose = require('mongoose'),
    MovieSchema = require('../../schemas/movie/movie');

// 使用mongoose的模型方法编译生成模型
var Movie = mongoose.model('Movie',MovieSchema);

// 将模型构造函数导出
module.exports = Movie;
