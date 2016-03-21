'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var CityProgrammeSchema = new Schema({
  name: String,
  cityCategories: [{type: ObjectId, ref: 'CityCategory'}],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

CityProgrammeSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }

  next();
});

CityProgrammeSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb);
  }
};

module.exports = CityProgrammeSchema;
