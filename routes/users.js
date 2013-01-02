module.exports = {
  search: function(req, res){
    User.find({username: new RegExp(req.param('q'))}, {username: 1}).exec(
      function (err, docs){
        res.json(docs.map(function(e){ return {id: e._id, name: e.username}; }));
      }
    );
  }
}