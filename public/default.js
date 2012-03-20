function defaultText(e, text){
  $(e).focus(
      function(){
        if ($(this).val() == text) $(this).val('').removeClass('greyed');
      }
    ).blur(
      function(){
        if (!$(this).val()) $(this).val(text).addClass('greyed');
      }
    );
}

$(window).load(
  function(){
    $.get('/post',
      function(r){
        $('.posts').html(r);
      }
    );
  
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
            title: $(b).find('.title').val(),
            datatype: $(b).find('.buttons.selected').text(),
            content: $(b).find('.message').val(),
            recipient: $(b).find('.pheedto').val(),
            private: $(b).find('#private').is(':checked'),
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