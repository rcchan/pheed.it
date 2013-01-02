var pheedit = pheedit || {};
pheedit.pheeds = {
  init: function(){
    $(window).load(function(){
      //$(':empty').not('.selectable').disableSelection();
      //$('*').disableSelection();
      //$('.selectable').enableSelection().parents().enableSelection();
      
      $(document).on('click', '.controls .facebook',
        function(){
          window.open('http://www.facebook.com/sharer.php?u=http://shareall.co/post/' + $(this).parentsUntil('.post').parent().data('id'));
        }
      );

      $(document).on('click', '.controls .twitter',
        function(){
          /*$(document.body).append(
            ($(document.createElement('iframe'))
              .attr('src', 'https://twitter.com/intent/tweet?related=andrewantar&hashtags=pheedit&url=http://shareall.co/post/' + $(this).parentsUntil('.post').parent().data('id'))
              .attr('scrollable', 'no')
              .css('border', 'none')
              .width(400)
              .height(100)
              .css('position', 'absolute')
              .css('top', e.pageY)
              .css('left', e.pageX)
            )
          )*/
          window.open('https://twitter.com/intent/tweet?related=andrewantar&hashtags=pheedit&url=http://shareall.co/post/' + $(this).parentsUntil('.post').parent().data('id'));
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
      
      $('.container').each(function(i,e){
        $(e).find('.content:not(.publisher_content)').slimScroll({height: '100%'});
        $(e).resizable({
          handles: 's',
          alsoResize: $(e).find('.slimScrollDiv').height($(e).data('height')),
          stop: function(){
            $.post('/profile/homepage/' + $(this).data('name'), {
              _csrf: $('meta[name=_csrf]').attr('content'),
              properties: {
                size: $(this).find('.content').height()
              }
            })
          }
        })
      });
      
      $('.post .image a').fancybox({type: 'image', wrapCSS: 'enlarged-image'});
      $(document).on('dblclick', '.enlarged-image', function(){
        $(this).find('img').toggleFullScreen();
      });

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
              $(e).find('.post .text .selectable').each(
                function(i, e){
                  $(e).html(pheedit.linkify($(e).text(), {callback: function(text, href){
                    if (href && href.match(/^https?:\/\/([^\/].)*soundcloud\.com\//)){
                      $.getJSON('https://soundcloud.com/oembed?callback=?', {
                        url: href,
                        format:'js',
                        maxheight: 250,
                        show_comments: false
                      }, function(r){
                        if (r.html){
                          $(e).addClass('attachment').removeClass('selectable').prepend($(document.createElement('div')).html(r.html));
                        }return true;
                      })
                    }
                    return href ? '<a href="' + href + '">' + text + '</a>' : text;
                  }}));
                  if ($(e).prop('scrollHeight') > $(e).height()){
                    $(e).next('.showmore').show().click(function(){
                      $(e).switchClass('', 'showall', 800);
                      $(this).hide().next('.showless').show().click(function(){
                        $(e).switchClass('showall', '', 800);
                        $(this).hide().prev('.showmore').show();
                    });;
                    });
                  }
                }
              );
            }
          );
        }
      );
      
      $(document.body).tooltip({
        selector: '.controls .control'
      });
    });
  }
}