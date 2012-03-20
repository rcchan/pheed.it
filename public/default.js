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
    
    $('.publisher .pheedit').click(
      function(){
        var b = $(this).parents('.publisher');
        $.post('/post',
          {
            title: $(b).children('.title').val(),
            datatype: $(b).children('.buttons.selected').text(),
            content: $(b).children('.message').val(),
            recipient: $(b).children('.pheedto').val(),
            private: $(b).children('#private').is(':checked'),
            location: null
          },
          function(r){
            console.log(r);
          }
        );
      }
    );
  }
);