'use strict';

var mongoose = require('mongoose'),
    MusicSchema = require('../../schemas/music/music');

//使用mongoose的模型方法编译生成模型
var Music = mongoose.model('Music',MusicSchema);

//将模型构造函数导出
module.exports = Music;
