var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username: {type: String, index: {unique: true}, required: true, trim: true},
  password: {type: String, required: true, trim: true},
  first_name: String,
  last_name: String,
  email: String,
  fbid: String,
  homepage: Schema.Types.Mixed
});

module.exports = mongoose.model('User', UserSchema);