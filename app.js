// Constants
CDN_HOST = '192.168.12.5';


/**
 * Module dependencies.
 */

stylus = require('stylus');
passport = require('passport'), LocalStrategy = require('passport-local').Strategy, FacebookStrategy = require('passport-facebook').Strategy;;
bcrypt = require('bcrypt');
connect = require('connect');

express = require('express')
  , routes = require('./routes');

app = module.exports = express.createServer();

helpers = require('express-helpers');
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
  app.set("view options", { layout: "layout.jade" });
  app.use((require('connect-assets'))());
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

// Database
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pheedit');

// Schemas
Interaction = require('./models/interaction');
Comment = require('./models/comment');

// Models
Post = require('./models/post');
User = require('./models/user');

// Helpers

getProp = function(obj, prop){
  var props = prop.split('.');
  return obj ? obj[prop] || getProp(obj[props[0]], props.slice(1).join('.')) : undefined;
}

app.dynamicHelpers({
  csrf_token: function(req){
    return req.session._csrf;
  },
  form_csrf: function(req){
    return '<input type="hidden" name="_csrf" value="' + req.session._csrf + '" />';
  },
  htmlentities: function(){
    return function(str){
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
  },
  user: function(req){
    return req.user;
  }
});


// User Authentication
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

passport.use(new FacebookStrategy({
    passReqToCallback: true,
    clientID: 402292099826850,
    clientSecret: '4d668e86af73bddf7e96bb6c05cf1ee8',
    callbackURL: "http://pheed.it/login/facebook/callback"
  },
  function(req, accessToken, refreshToken, profile, done){
    if (req.user){
      req.user.fbid = profile.id;
      req.user.save();
      done(null, req.user);
    } else done('You must be logged in to link your accounts');
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
routes.init();

app.listen(3100);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
