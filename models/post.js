var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
  author: {type: ObjectId, required: true, index: true},
  recipient: {
    type: [ObjectId],
    validate: function(v){
      if (!v || !(v instanceof Array)) return false;
      //for (var i = 0; i < v.length; i++) if (!(v[i] instanceof ObjectId)) return false;
      return true;
    },
    index: true
  },
  time: {type: Date, default: Date.now, required: true, index: true},
  title: {type: String, required: true, index: true},
  message: {type: String, index: true},
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
  favorites: {type: [Interaction], index: true},
  comments: [Comment]
});
PostSchema.index({location: '2d'});
module.exports = mongoose.model('Post', PostSchema);