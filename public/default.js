// Constants
CDN_HOST = (function(h){a=document.createElement('a');a.href=h;return a.hostname})(document.location.href);

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
    $(document).on('click', '.controls .facebook',
      function(){
        window.open('http://www.facebook.com/sharer.php?u=http://pheed.it/post/' + $(this).parentsUntil('.post').parent().data('id'));
      }
    );

    $(document).on('click', '.controls .twitter',
      function(){
        /*$(document.body).append(
          ($(document.createElement('iframe'))
            .attr('src', 'https://twitter.com/intent/tweet?related=andrewantar&hashtags=pheedit&url=http://pheed.it/post/' + $(this).parentsUntil('.post').parent().data('id'))
            .attr('scrollable', 'no')
            .css('border', 'none')
            .width(400)
            .height(100)
            .css('position', 'absolute')
            .css('top', e.pageY)
            .css('left', e.pageX)
          )
        )*/
        window.open('https://twitter.com/intent/tweet?related=andrewantar&hashtags=pheedit&url=http://pheed.it/post/' + $(this).parentsUntil('.post').parent().data('id'));
      }
    );

    $(document).on('click', '.controls .like',
      function(){
        $.get('/post/' + $(this).parentsUntil('.post').parent().data('id') + '/like')
      }
    );

   $(document).on('click', '.controls .favorite',
      function(){
        $.get('/post/' + $(this).parentsUntil('.post').parent().data('id') + '/favorite')
      }
    );
    $(document).on('click', '.controls .dislike',
      function(){
        $.get('/post/' + $(this).parentsUntil('.post').parent().data('id') + '/dislike')
      }
    );

    var EMBED_INDEX = 0
    $('.posts').each(
      function(i ,e){
        $.get('/post' + $(e).data('url') || '',
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

    $('.publisher input[type=date]').datepicker();
    $('.publisher input[type=time]').timepicker({});

    $('.publisher .button').click(
      function(){
        $(this).siblings('.publisher .button').removeClass('selected');
        $(this).addClass('selected');

        if ($(this).text() == 'video'){
          $(this).siblings('.upload').find('.embedtype').slideDown();
        } else {
          $('.embedtype input[type=radio][name=embedtype][value=file]').click();
          $(this).siblings('.upload').find('.embedtype').slideUp();
        }

        if ($(this).text() == 'event'){
          $(this).siblings('.eventinfo').slideDown();
        } else {
          $(this).siblings('.eventinfo').slideUp();
        }

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

    $('.publisher .eventinfo .location').keyup(
      function(){
        var l = $(this).val();
        /*if (l) $.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + l + '&sensor=false',
          function(){
            $(this).parentsUntil('.publisher').find('.eventinfo img.map').attr('src', '
          }
        );*/
        if (l) $(this).parentsUntil('.publisher').find('.eventinfo img.map').attr('src', 'http://maps.googleapis.com/maps/api/staticmap?center=' + l + '&zoom=13&size=300x300&maptype=hybrid&sensor=false')
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
              if (r === null) document.location.reload();
              else alert(JSON.stringify(r));
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
