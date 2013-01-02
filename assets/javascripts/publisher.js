var pheedit = pheedit || {};
pheedit.publisher = {
  init: function(){
    $('.publisher input[type=date]').datepicker();
    $('.publisher input[type=time]').timepicker({});

    $('.publisher .button').click(
      function(){
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

        if ($(this).text() == 'video'){
          $(this).parents('.publishertype').find('.upload .embedtype').slideDown();
        } else {
          $('.embedtype input[type=radio][name=embedtype][value=file]').click();
          $(this).parents('.publishertype').find('.upload .embedtype').slideUp();
        }

        if ($(this).text() == 'event'){
          $(this).parents('.publishertype').find('.eventinfo').slideDown();
        } else {
          $(this).parents('.publishertype').find('.eventinfo').slideUp();
        }

        if ($(this).text() == 'text') $(this).parents('.publishertype').find('.upload').slideUp();
        else $(this).parents('.publishertype').find('.upload').slideDown();

        var e = $(this).parents('.publishertype').find('.upload').find('#file');
        var e = $(e).clone(true, true).replaceAll(e);
        $(e).change();
      }
    );

    $('.publisher .pheedit').click(
      function(){
        $(this).parents('.publisher').submit();
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

    $('.publisher .pheedto').tokenInput("/users/search", {theme: 'facebook'});

    $('.publisher .location input[type=checkbox]').change(
      function(){
        if ($(this).prop('checked')){
          $.getJSON('http://freegeoip.net/json/', null, $.proxy(function(r){
            $(this).siblings('.location_data').text(r.city + ", " + r.region_code);
          }, this));
        } else $(this).siblings('.location_data').text('');
      }
    );

    $('.publisher').submit(
      function() {
        $('.publisher .pheedit > input').prop('disabled', 'disabled');
        if (!$(this).find('.title').val()){
          $(this).find('.title').focus();
          return false;
        }
        if (
          !$(this).find('.message').val() &&
          !($(this).find('#file').val() && $(this).find('.button.selected').text() != 'text') &&
          !(
            $(this).find('input[name=embedtype]:checked').val() == 'url' &&
            $(this).find('input[name=embed_url]').val() &&
            $(this).find('.button.selected').text() == 'video'
          )
        ){
          $(this).find('.message').focus();
          return false;
        }
        $(this).find('#datatype').val($(this).find('.button.selected').text())
        if (!$(this).find('#file').val()) $(this).find('#datatype').val('text');

        if (
          $(this).find('.button.selected').text() == 'video' &&
          $('.embedtype input[type=radio][name=embedtype]:checked').val() == 'url'
        ) $(this).find('#datatype').val('link');

        $(this).ajaxSubmit(
          {
            error: function(xhr) {
              $('.publisher .pheedit > input').prop('disabled', null);
              alert('Error: ' + xhr.status);
            },
            success: (function(r) {
              if (r.success){
                $.View('//templates/post.ejs', {post: r.data}, express, (function(r){
                  var el = $(r).prependTo($(this).parent().parent().find('.posts').last());
                  pheedit.pheeds.init_post(el);
                  $(this)[0].reset();
                  $('.publisher .pheedit > input').prop('disabled', null);
                }).bind(this));
              }
              else alert(JSON.stringify(r.data));
            }).bind(this)
          }
        )
        return false;
      }
    );
  }
};
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