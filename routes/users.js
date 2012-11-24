module.exports = {
  search: function(req, res){
    User.find({username: new RegExp(req.param('q'))}, {_id: 0, username: 1}).exec(
      function (err, docs){
        res.json(docs.map(function(e){ return {id: e.username, name: e.username}; }));
      }
    );
  }
}