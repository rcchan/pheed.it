var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

module.exports = new Schema({
  user: {type: Number, index: true, required: true},
  timestamp: {type: Date, index: true, required: true, default: new Date()},
  message: {type: String, required: true}
})