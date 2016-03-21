'use strict';

var mongoose = require('mongoose'),
    ProgrammeSchema = require('../../schemas/music/music_programme');

//使用mongoose的模型方法编译生成模型
var Programme = mongoose.model('Programme',ProgrammeSchema);

//将模型构造函数导出
module.exports = Programme;
