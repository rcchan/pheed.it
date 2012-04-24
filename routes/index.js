
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'pheed.it' });
};

exports.post = {
  // GET posts
  get: function(req, res){
    var embed_index = 0;
    Post.find({}).limit(req.param('max') || 1).desc('time').exec(
      function(err, docs){
        res.partial('posts', {posts: docs, embed_index: embed_index++ + '_' + new Date().getTime()});
      }
    );
  },

  // POST new posts
  post: function(req, res){
    var save = function(err){
      if (!err){
        p.save(
          function(r){
            res.json({response: r});
          }
        );
      }
    };
    
    p = new Post();
    p.author = 1;
    p.title = req.body.title || '[No title]';
    p.message = req.body.message || '';
    p.private = req.body.private || false;
    if (jQuery.isEmptyObject(req.files.file)) save();
    else {
    
      var types = {
        photo: /\.(jpg|png|tif|gif|svg)$/i,
        audio: /\.(wav|mp3|ogg)$/i,
        video: /\.(m4v|flv|mp4)$/i
      };
      if (!req.files.file.name.match(types[req.body.datatype])) return res.end('{"response": "Invalid type"}');
      
      fs.rename(req.files.file.path, __dirname + '/../public/upload/' + p._id,
        function(){
          p.data = {
            datatype: req.body.datatype,
            contenttype: req.files.file.type
          }
          save();
        }
      );
    }
  },
  
  attachment: function(req, res){
    if (!req.param('id').match(/^[A-Za-z0-9]+$/)){
      res.writeHead(404);
      res.end("Invalid!");
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
          res.contentType('application/octet-stream');
          res.download(filename, 'download.' + mime.extension(req.param('mime')));
        } else {
          res.contentType(req.param('mime'));
          res.writeHead(200);
          var fileStream = fs.createReadStream(filename);
          fileStream.pipe(res);
        }
    })
  }
};