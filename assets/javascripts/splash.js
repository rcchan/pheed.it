var pheedit = pheedit || {};
pheedit.splash = {
  init: function(){
    $(window).load(function(){
      $('.button.signup').click(function(){
        var $f = $(this).parentsUntil('form').parent().prop('action', '/sign_up')
        $f.ajaxSubmit(function(r){
          if (r.username) $f.prop('action', '/login').submit();
          else alert(r.err);
        })
        $f.prop('action', '/login');
        return false;
      });
    });
  }
}