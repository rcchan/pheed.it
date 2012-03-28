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
    $('.posts').each(
      function(i ,e){
        $.get('/post/' + $(e).data('max') || 1,
          function(r){
            $(e).html(r);
          }
        );
      }
    );

    defaultText('.publisher .title', 'Title your post here');
    defaultText('.publisher .message', 'Enter your text here');
    defaultText('.publisher .pheedto', 'pheed.it user or email(s)');

    $('.publisher .button').click(
      function(){
        $(this).siblings('.publisher .button').removeClass('selected');
        $(this).addClass('selected');

        if ($(this).text() == 'text') $(this).siblings('.upload').slideUp();
        else $(this).siblings('.upload').slideDown();

      }
    );

    $('.publisher .pheedit').click(
      function(){
        $('#poster').submit();
        /*var b = $(this).parents('.publisher');
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
        );*/
      }
    );

    $('#poster').submit(
      function() {
        $(this).find('#datatype').val($(this).find('.publisher .button.selected').text())
        $(this).ajaxSubmit(
          {
            error: function(xhr) {
              alert('Error: ' + xhr.status);
            },
            success: function(response) {
              //TODO: We will fill this in later
            }
          }
        )
        return false;
      }
    );
    /*

    // If we ever want to pre-upload the image

    fileChecker = setInterval(
      function(){
        if($('#file').val() !== '') {
          clearInterval(fileChecker);
          $('#poster').submit();
        }
      },
      500
    );*/
  }
);