var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var Interaction = require('./interaction');

var PostSchema = new Schema({
  author: {type: Number, min: 1, required: true, index: true},
  recipient: {
    type: [Number],
    validate: function(v){
      if (!v || !(v instanceof Array)) return false;
      for (var i = 0; i < v.length; i++) if (!(v[i] instanceof Number) || v[i] < 1) return false;
      return true;
    },
    index: true
  },
  time: {type: Date, default: Date.now, required: true, index: true},
  title: {type: String, required: true, index: true},
  message: {type: String, required: true, index: true},
  data: {
    type: {
      datatype: {type: String, enum: ['text', 'photo', 'audio', 'video'], required: true, index: true},
      contenttype: {type:String, index: true},
      data: Schema.Types.Mixed
    },
    required: true,
    index: true
  },
  private: {type: Boolean, default: false, required: true, index: true},
  location: {
    type: {
      longitude: {type: Number, required: true},
      latitude: {type: Number, required: true}
    }
  },
  likes: {type: [Interaction], index: true},
  dislikes: {type: [Interaction], index: true},
  favorites: {type: [Interaction], index: true}
});
PostSchema.index({location: '2d'});
module.exports = mongoose.model('Post', PostSchema);