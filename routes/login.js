module.exports = {
  get: function(req, res){
    res.render('login.ejs');
  },
  
  post: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/splash',
    failureFlash: 'Invalid username or password'
  })
}