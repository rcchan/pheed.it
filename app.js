// Constants
CDN_HOST = '192.168.12.5';


/**
 * Module dependencies.
 */

var stylus = require('stylus');

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var helpers = require('express-helpers');
helpers.all(app);

fs = require('fs');
dnode = require('dnode');
nQuery = require('nodeQuery');
jQuery = require('jquery');
path = require('path');
mime = require('mime');

mime.load(__dirname + '/mime.types');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/stylesheets',
    dest: __dirname + '/public'
  }));
  app.use(nQuery.middleware);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//app.use(express.bodyParser());

dnode(nQuery.middleware).listen(app);

// Routes

app.get('/', routes.index);
app.get('/post', routes.post.get);
app.get('/post/:type', routes.post.get);
app.post('/post', routes.post.post);
app.get('/post/attachment/:id', routes.post.attachment);

//Database

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pheedit');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var LikeSchema = new Schema({
  item_id: ObjectId,
  liketype: {type: String, enum: ['like', 'dislike', 'favorite'], required: true, index: true},
  user: {type: Number, min: 1, required: true, index: true}
});
LikeSchema.index({liketype: 1, user: 1}, {unique: true, sparse: true});

var PostSchema = new Schema({
  item_id: ObjectId,
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
      contenttype: {type:String, required: true, index: true}
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
  likes: {type: [LikeSchema], index: true}
});
PostSchema.index({location: '2d'});
Post = mongoose.model('Post', PostSchema);

// Helpers

htmlentities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
