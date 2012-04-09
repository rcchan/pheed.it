// Constants
CDN_HOST = '192.168.12.5';

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
    var EMBED_INDEX = 0
    $('.posts').each(
      function(i ,e){
        $.get('/post/' + $(e).data('max') || 1,
          function(r){
            var dom = $(r);
            $(e).append(r);
            $(e).find(".jp-jplayer").each(
              function(){
                $(this).attr('id', 'jquery_jplayer_' + EMBED_INDEX);
                $(this).next('.jp-audio').add($(this).parents('.jp-video')).attr('id', 'jp_container_' + EMBED_INDEX);
                var type = $(this).data('type');
                var ext = '';
                switch(type){
                  case 'audio/ogg':
                    ext = 'oga';
                    break;
                  case 'audio/mp3':
                  case 'audio/mpeg3':
                  case 'audio/x-mpeg-3':
                    ext = 'mp3';
                    break;
                  case 'audio/m4a':
                  case 'audio/mp4':
                  case 'audio/mp4a-latm':
                    ext = 'm4a';
                    break;
                  default:
                    alert(type);
                }
                
                var player = $(this).jPlayer(
                  {
                    cssSelectorAncestor: '#jp_container_' + EMBED_INDEX,
                    ready: function () {
                      var media = {};
                      //media[ext] = '/post/attachment/' + $(this).data('post_id') + '?mime=' + type;
                      media[ext] = '//' + CDN_HOST + '/' + $(this).data('post_id');
                      $(this).jPlayer("setMedia", media);
                    },
                    swfPath: "/jplayer",
                    supplied: ext
                  }
                );
                EMBED_INDEX++;
              }
            );
          }
        );
      }
    );

    defaultText('.publisher .title', 'Title your post here');
    defaultText('.publisher .message', 'Enter your text here');
    defaultText('.publisher .pheedto', 'user, pheeder, email, cell');
    defaultText('.publisher .embed', 'Enter embed URL');

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
