
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'pheed.it' });
};

exports.post = {
  // GET posts
  get: function(req, res){
    Post.find({}).desc('time').exec(
      function(err, docs){
        console.log(docs);
        res.partial('post', docs);
      }
    );
  },

  // POST new posts
  post: function(req, res){
    p = new Post();
    p.author = 1;
    p.title = req.body.title || '[No title]';
    p.data = {
      datatype: req.body.datatype,
      content: req.body.content
    };
    p.private = req.body.private || false;
    p.save(
      function(r){
        res.json({response: r});
      }
    );
  }
};