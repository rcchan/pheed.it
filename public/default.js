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

$(':empty').not('.selectable').disableSelection();
//$('*').disableSelection();
//$('.selectable').enableSelection().parents().enableSelection();

$(window).load(
  function(){
    var EMBED_INDEX = 0
    $('.posts').each(
      function(i ,e){
        $.get('/post/' + $(e).data('max') || 1,
          function(r){
            $(':empty').not('.selectable').enableSelection();
            $(e).append(r);
            //$(e).find('*').disableSelection();
            //$(e).find('.selectable').enableSelection().parents().enableSelection();
            $(':empty').not('.selectable, input, textarea').disableSelection();
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
                  case 'video/mp4':
                  case 'video/m4v':
                    ext = 'm4v';
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
                    size: $(this).next('.jp-audio').size()?{}:{width: '260px', height: '146px'},
                    swfPath: "/jplayer",
                    supplied: ext
                  }
                );
                
              $(this).dblclick(
                function(){
                  if($(player).data('jPlayer').options.fullScreen) $(player).data('jPlayer').restoreScreen();
                  else $(player).data('jPlayer').fullScreen();
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
        
        var e = $(this).siblings('.upload').find('#file');
        var e = $(e).clone(true, true).replaceAll(e);
        $(e).change();        
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
    
    $('.embedtype input[type=radio][name=embedtype]').change(
      function(){
        if ($(this).val() == 'file'){
          $('.upload .embed').slideUp();
          $('.upload .file').slideDown();
        } else {
          $('.upload .embed').slideDown();
          $('.upload .file').slideUp();
        }
      }
    );
    
    if ($('#file')){
      $(document).bind('dragover',
        function(){
          $('.addfile').addClass('loaded');
          return false;
        }
      );
    }
    
    if ($('#file')){
      $(document).bind('dragleave',
        function(){
          if (!$('#file').val()) $('.addfile').removeClass('loaded');
        }
      );
    }
    
    $(document).bind('drop',
      function(){
        if (!$('#file').val()) $('.addfile').removeClass('loaded');
        return false;
      }
    );
    
    $('#file').bind('dragover',
      function(e){
        $('.addfile').addClass('loaded');
        e.stopPropagation();
        return true;
      }
    );
    
    $('#file').change(
      function(){
        var f = $(this).val();
        if (f){
          f = f.substring(f.lastIndexOf('\\')+1);
          f = f.substring(f.lastIndexOf('/')+1);
          $(this).siblings('.addfile').text(f);
        } else $(this).siblings('.addfile').text('Add file...');
      }
    );

    $('#poster').submit(
      function() {
        if ($(this).find('.title').hasClass('greyed')){
          $(this).find('.title').focus();
          return false;
        }
        if ($(this).find('.message').hasClass('greyed') && !($(this).find('#file').val() && $(this).find('.publisher .button.selected').text() != 'text')){
          $(this).find('.message').focus();
          return false;
        }
        $(this).find('#datatype').val($(this).find('.publisher .button.selected').text())
        if (!$(this).find('#file').val()) $(this).find('#datatype').val('text');
        
        if (
          $(this).find('.publisher .button.selected').text() == 'video' && 
          $('.embedtype input[type=radio][name=embedtype]:checked').val() == 'url'
        ) $(this).find('#datatype').val('link');
        
        $(this).ajaxSubmit(
          {
            error: function(xhr) {
              alert('Error: ' + xhr.status);
            },
            success: function(r) {
              if (r && r.response === null) document.location.reload();
              else alert(r.response);
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
