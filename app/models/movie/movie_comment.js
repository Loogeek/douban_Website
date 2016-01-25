var mongoose = require('mongoose');
var CommentSchema = require('../../schemas/movie/movie_comment');
var CommentMovie = mongoose.model('CommentMovie', CommentSchema);

module.exports = CommentMovie;