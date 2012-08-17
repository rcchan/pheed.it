module.exports = {
  get: function(req, res){
    res.render('profile');
  },
  
  homepage: function(req, res){
    var pheeds = ['mypheed','inbox','starred','featured_pheeds','featured_phood','interactions','likes','comments','rephed'];
    var pheed = req.param('pheed'), properties = req.param('properties');
    if (req.user && pheeds.indexOf(pheed) > -1 && properties){
      req.user.homepage = req.user.homepage || {};
      req.user.homepage[pheed] = req.user.homepage[pheed] || {};
      jQuery.extend(req.user.homepage[pheed], properties)
      req.user.markModified('homepage.' + pheed);
      req.user.save(function(e,r){
        console.log(r.homepage);
      });
    }
    res.send();
  }
}