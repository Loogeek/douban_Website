'use strict';

var mongoose = require('mongoose'),
    CityProgrammeSchema = require('../../schemas/movie/movie_cityProgramme');

// 使用mongoose的模型方法编译生成模型
var CityProgramme = mongoose.model('CityProgramme',CityProgrammeSchema);

// 将模型构造函数导出
module.exports = CityProgramme;
