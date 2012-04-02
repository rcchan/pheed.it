
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'pheed.it' });
};

exports.post = {
  // GET posts
  get: function(req, res){
    Post.find({}).limit(req.param('max') || 1).desc('time').exec(
      function(err, docs){
        var embed_index = 0;
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
    
      /*var types = {
        photo: /\.(jpg|png|tif|gif|svg)$/i,
        audio: /\.(wav|mp3|ogg)$/i,
        video: /\.(mp4,avi,flv)$/i
      };
      console.log(types[req.body.datatype]);
      console.log(req.files.file.name);
      if (!req.files.file.name.match(types[req.body.datatype])) return res.end('Invalid type');*/
      
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
  }
};