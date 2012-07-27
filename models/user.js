var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username: {type: String, index: true, required: true},
  password: {type: String, required: true},
  first_name: String,
  last_name: String,
  email: String
});
module.exports = mongoose.model('User', UserSchema);