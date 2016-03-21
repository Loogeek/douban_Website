'use strict';

var mongoose = require('mongoose'),
    MusicCategorySchema = require('../../schemas/music/music_category');

//使用mongoose的模型方法编译生成模型
var MusicCategory = mongoose.model('MusicCategory',MusicCategorySchema);

//将模型构造函数导出
module.exports = MusicCategory;
