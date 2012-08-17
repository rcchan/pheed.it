/*
 * GET home page.
 */

var routes = {
  index: function(req, res){
    res.render('index', { title: 'pheed.it' });
  },

  login: require('./login'),

  logout: function(req, res){
    req.logout();
    res.redirect('/');
  },
  
  profile: require('./profile'),

  post: require('./post')
};

exports.init = function(){
  app.get('/', routes.index);

  app.get('/createuser', function(req,res){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("pass", salt, function(err, hash) {
            (new User({username:'ryan', password: hash})).save(function(){res.send('User created'); res.end()});
        });
    });
  });

  app.get('/login', routes.login.get);
  app.post('/login', routes.login.post);
  app.get('/login/facebook', passport.authenticate('facebook'));
  app.get('/login/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

  app.get('/logout', routes.logout);
  
  app.get('/profile', routes.profile.get);
  app.post('/profile/homepage/:pheed', routes.profile.homepage);

  app.get('/post', routes.post.get);
  app.get('/post/:type', routes.post.get);
  app.get('/post/:type/:format', routes.post.rss);
  app.post('/post', routes.post.post);
  app.get('/post/attachment/:id', routes.post.attachment);
  app.post('/post/sms', routes.post.sms);
  app.get('/post/:id/:action', routes.post.like);
}
