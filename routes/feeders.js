module.exports = {
  get: function(req, res){
    res.render('feeders', {selected: 'feeders'});
  }
}