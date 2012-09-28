var pheedit = pheedit || {};
pheedit.splash = {
  init: function(){
    $(window).load(function(){
      $('.button.signup').click(function(){
        return !$(this).parentsUntil('form').parent().prop('action', '/sign_up').ajaxSubmit(function(r, s, x, f){
          if (r.username) $(f).prop('action', '/login').submit();
          else alert(r.err);
        });
      });
    });
  }
}