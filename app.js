// Constants
CDN_HOST = '192.168.12.5';


/**
 * Module dependencies.
 */

var stylus = require('stylus');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var helpers = require('express-helpers');
helpers.all(app);

fs = require('fs.extra');
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
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'h.bw}an}P(d-(TfP6<Ax.0jL4Nx=g<%~hz$<C)4<35ye-k{xE^+i5@U~QlZ)9j8' }));
  app.use(passport.initialize());
  app.use(passport.session());
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

app.get('/login', routes.login);
app.post('/login', passport.authenticate('local'), {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password'
});
  
app.get('/post', routes.post.get);
app.get('/post/:type', routes.post.get);
app.get('/post/:type/:format', routes.post.rss);
app.post('/post', routes.post.post);
app.get('/post/attachment/:id', routes.post.attachment);
app.post('/post/sms', routes.post.sms);
app.get('/post/:id/:action', routes.post.like);

//Database

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pheedit');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

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
  likes: {type: [Number], index: true},
  dislikes: {type: [Number], index: true},
  favorites: {type: [Number], index: true}
});
PostSchema.index({location: '2d'});
Post = mongoose.model('Post', PostSchema);

// Helpers

htmlentities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
