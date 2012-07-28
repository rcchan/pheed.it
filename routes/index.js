/*
 * GET home page.
 */

var routes = {
  index: function(req, res){
    res.render('index', { title: 'pheed.it', user: req.user });
  },

  login: function(req, res){
    res.render('login.ejs', {layout: 'layout.jade'});
  },

  logout: function(req, res){
    req.logout();
    res.redirect('/');
  },

  post: {
    // GET posts
    get: function(req, res){
      var embed_index = 0;
      var query = {};
      var format = req.param('format');
      switch(req.param('type')){
        case 'rss':
          format = 'rss';
          break;
        case 'starred':
          query = { favorites : 1 };
          break;
        case 'featured':
        case 'phood':
        case 'interactions':
        case 'likes':
        case 'comments':
        case 'rephed':
          query = {_id: false}
          break;
      }
      Post.find(query).desc('time').exec(
        function(err, docs){
          switch(format){
            case 'rss':
              res.partial('rss.ejs', {posts: docs});
              break;
            default: res.partial('posts', {posts: docs, embed_index: embed_index++ + '_' + new Date().getTime()});
          }
        }
      );
    },

    // POST new posts
    post: function(req, res){
      p = new Post();
      p.author = 1;
      p.title = req.body.title || '[No title]';
      p.message = req.body.message || '';
      p.private = req.body.private || false;
      if (jQuery.isEmptyObject(req.files.file)){
        if (req.body.embed_url){
          p.data = {
            datatype: 'link',
            contenttype: req.body.embed_url
          }
        }
        p.save(
          function(r, o){
            res.json(r);
          }
        );
      }
      else {

        var types = {
          photo: /\.(jpg|png|tif|gif|svg)$/i,
          audio: /\.(wav|mp3|ogg)$/i,
          video: /\.(m4v|flv|mp4)$/i
        };
        if (!req.files.file.name.match(types[req.body.datatype])) return res.end('{"response": "Invalid type"}');
        p.data = {
          datatype: req.body.datatype,
          contenttype: req.files.file.type
        };
        p.save(
          function(r, o){
            fs.move(req.files.file.path, __dirname + '/../public/upload/' + o._id, function(a,b,c,d,e){debugger});
            res.json(r);
          }
        );
      }
    },

    attachment: function(req, res){
      if (!req.param('id').match(/^[A-Za-z0-9]+$/)){
        res.writeHead(404);
        res.end('Invalid!');
        return;
      }
      var filename = path.normalize(__dirname + '/../public/upload/' + req.param('id'));
      path.exists(filename, function(exists) {
          if(!exists) {
              console.log("not exists: " + filename);
              res.writeHead(404, {'Content-Type': 'text/plain'});
              res.write('404 Not Found');
              res.end();
              return;
          }
          if (req.param('d')){
            res.download(filename, 'download.' + mime.extension(req.param('mime')));
          } else {
            res.contentType(req.param('mime'));
            res.sendfile(filename);
          }
      })
    },

    like: function(req, res){
      if (!req.param('id')){
        res.writeHead(400);
        res.end('Bad Request');
        return;
      }
      Post.findOne({_id: req.param('id')}).exec(function(e,d){console.log(d)});
      var arg;
      switch (req.params['action']){
        case 'like':
          arg = {$push: {likes: 1}};
          break;
        case 'favorite':
          arg = {$push: {favorites: 1}};
          break
        case 'dislike':
          arg = {$push: {dislikes: 1}};
          break
        default:
          res.writeHead(400);
          res.end('Bad Request');
          return;
      }
      var post = Post.update({_id: req.param('id')}, arg).exec(
        function(err, docs){
          console.log(err);
        }
      );
      res.end();
    },

    sms: function(req, res){
      p = new Post();
      p.author = req.body.From.match(/\d/g).join('');

      p.title = req.body.Body.match(/.{0,50}\w/) || '[No title]';
      p.message = req.body.Body || '';
      p.private = req.body.private || false;
      p.save(
        function(r, o){
          debugger
          res.send('Your post has been published');
        }
      );
    }
  }
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
}
