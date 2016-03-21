'use strict';

var mongoose = require('mongoose'),
    UserSchema = require('../../schemas/user/user');

//使用mongoose的模型方法编译生成模型
var User = mongoose.model('User',UserSchema);

//将模型构造函数导出
module.exports = User;
