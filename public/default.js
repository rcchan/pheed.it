$(window).load(
  function(){
    $('.publisher .pheedto').focus(
      function(){
        $(this).val('').removeClass('greyed');
      }
    ).blur(
      function(){
        if (!$(this).val()) $(this).val('pheed.it user or email(s)').addClass('greyed');
      }
    );
  }
);