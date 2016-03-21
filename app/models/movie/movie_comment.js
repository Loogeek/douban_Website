'use strict';

var mongoose = require('mongoose'),
    MovieCommentSchema = require('../../schemas/movie/movie_comment'),
    MovieComment = mongoose.model('MovieComment', MovieCommentSchema);

module.exports = MovieComment;
