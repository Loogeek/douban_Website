var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var CommentMovie = mongoose.model('CommentMovie', CommentSchema);

module.exports = CommentMovie;