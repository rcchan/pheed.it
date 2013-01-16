module.exports = {
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
        query = { favorites : {$ne: []} };
        break;
      case 'featured':
      case 'phood':
      case 'interactions':
      case 'likes':
      case 'comments':
      case 'rephed':
        query = {_id: false};
        break;
      case 'inbox':
        query = { recipient : req.user._id };
        break;
      default:
        if (req.param('type') && req.param('type').match(/[0-9a-f]/)){
          query = {_id: req.param('type')};
          format = 'single';
        } else {
          query = { $or: [{ recipient : req.user._id}, { author : req.user._id }] };
        }
    }
    Post.find(query).desc('time').exec(
      function(err, docs){
        switch(format){
          case 'rss':
            res.partial('rss.ejs', {posts: docs});
            break;
          case 'single':
            res.render('post', {title: docs[0].title, post: docs[0], embed_index: embed_index++ + '_' + new Date().getTime()});
            break;
          default: res.partial('posts', {posts: docs, embed_index: embed_index++ + '_' + new Date().getTime()});
        }
      }
    );
  },

  // POST new posts
  post: function(req, res){
    p = new Post();
    p.author = req.user._id;
    p.title = req.body.title || '[No title]';
    p.message = req.body.message || '';
    p.private = req.body.private || false;
    p.recipient = req.body.pheedto && req.body.pheedto.split(',') || [];

    if (!req.files || jQuery.isEmptyObject(req.files.file) || !req.files.file.size){
      if (req.body.embed_url){
        p.data = {
          datatype: 'link',
          data: req.body.embed_url
        }
        p.message = req.body.embed_url + '\n' + p.message
      }
      p.save(
        function(r, o){
          r ? res.json({success: false, data: r}) : res.json({success: true, data: o});
        }
      );
    } else {

      var types = {
        photo: /\.(jpg|png|tif|gif|svg)$/i,
        audio: /\.(wav|mp3|ogg)$/i,
        video: /\.(m4v|flv|mp4)$/i
      };
      if (!req.files.file.name.match(types[req.body.datatype])) return res.json({success:false, data: {response: 'Invalid type'}});
      p.data = {
        datatype: req.body.datatype,
        contenttype: req.files.file.type
      };
      p.save(
        function(r, o){
          fs.move(req.files.file.path, __dirname + '/../public/upload/' + o._id);
          r ? res.json({success: false, data: r}) : res.json({success: true, data: o});
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
        arg = {$push: {likes: {user: 1}}};
        break;
      case 'favorite':
        arg = {$push: {favorites: {user: 1}}};
        break
      case 'dislike':
        arg = {$push: {dislikes: {user: 1}}};
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