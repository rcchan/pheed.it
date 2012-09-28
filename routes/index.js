var routes = {
  index: function(req, res){
    if (req.user) res.render('index', { title: 'pheed.it' });
    else res.redirect('/splash');
  },
  
  splash: function(req, res){
    res.render('splash');
  },
  
  sign_up: function(req,res){
    if (!req.body['password'] || !req.body['username']) return res.json({success: false});
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body['password'], salt, function(err, hash) {
            (new User({username:req.body['username'], password: hash})).save(function(e, user){
            /*  passport.authenticate('local', {}, function(req, res){
                console.log("AUTH!");
                res.json(e || user);
              })*/
              res.json(e || user);
            });
        });
    });
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
  
  app.get('/splash', routes.splash);

  app.post('/sign_up', routes.sign_up);

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
