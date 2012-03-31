
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
        res.partial('post', docs);
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
    }
    
    p = new Post();
    p.author = 1;
    p.title = req.body.title || '[No title]';
    p.message = req.body.message || '';
    p.private = req.body.private || false;
    if (jQuery.isEmptyObject(req.files.file)) save();
    else {
      if (!req.files.file.name.match(/\.(jpg|png|tif|gif|svg)$/i)) return res.end('Invalid type');
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