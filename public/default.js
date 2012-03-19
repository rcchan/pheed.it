function defaultText(e, text){
  $(e).focus(
      function(){
        $(this).val('').removeClass('greyed');
      }
    ).blur(
      function(){
        if (!$(this).val()) $(this).val(text).addClass('greyed');
      }
    );
}

$(window).load(
  function(){
    defaultText('.publisher .title', 'Title your post here');
    defaultText('.publisher .message', 'Enter your text here');
    defaultText('.publisher .pheedto', 'pheed.it user or email(s)');
    $('.publisher .button').click(
      function(){
        $(this).siblings('.publisher .button').removeClass('selected');
        $(this).addClass('selected');
      }
    );
  }
);