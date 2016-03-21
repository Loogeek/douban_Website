'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var CitySchema = new Schema({
  name: String,
  cinemas: [{}],
  cityCategories: [{
    type: ObjectId,
    ref: 'CityCategory'
  }],
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

CitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }

  next();
});

CitySchema.statics = {
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

module.exports = CitySchema;
