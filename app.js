// Constants
CDN_HOST = '192.168.12.5';


/**
 * Module dependencies.
 */

var stylus = require('stylus');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

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
  app.use(connect.csrf());
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

dnode(nQuery.middleware).listen(app);

//Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pheedit');

Post = require('./models/post.js');
User = require('./models/user.js');

// Helpers

app.dynamicHelpers({
  csrf_token: function(req){
    return req.session._csrf;
  },
  form_csrf: function(req){
    return '<input type="hidden" name="_csrf" value="' + req.session._csrf + '" />';
  }
});

htmlentities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({ username: username }, function(err, user){
      if (err) { return done(err); }
      if (!user || !bcrypt.compareSync(password, user.password)){
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user['_id']);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Routes

app.get('/', routes.index);

app.get('/createuser', function(req,res){
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash("pass", salt, function(err, hash) {
          (new User({username:'ryan', password: hash})).save(function(){res.send('User created'); res.end()});
      });
  });
});

app.get('/login', routes.login);
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password'
}));

app.get('/logout', routes.logout);
  
app.get('/post', routes.post.get);
app.get('/post/:type', routes.post.get);
app.get('/post/:type/:format', routes.post.rss);
app.post('/post', routes.post.post);
app.get('/post/attachment/:id', routes.post.attachment);
app.post('/post/sms', routes.post.sms);
app.get('/post/:id/:action', routes.post.like);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
