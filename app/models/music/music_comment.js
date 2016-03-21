'use strict';

var mongoose = require('mongoose'),
    MusicCommentSchema = require('../../schemas/music/music_comment'),
    MusicComment = mongoose.model('MusicComment', MusicCommentSchema);

module.exports = MusicComment;
