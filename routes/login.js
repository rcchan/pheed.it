module.exports = {
  get: function(req, res){
    res.render('login.ejs', {layout: 'layout.jade'});
  },
  
  post: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
  })
}