pheedit = pheedit || {};
/* using jquery.fullscreen plugin instead
pheedit.fullscreen = function(elem){
  elem = $(elem)[0];
  if (elem.requestFullScreen) elem.requestFullScreen();
  else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
  else if (elem.webkitRequestFullScreen) elem.webkitRequestFullScreen();
};

pheedit.cancel_fullscreen = function(){
  if (document.cancelFullscreen) document.cancelFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
}

pheedit.toggle_fullscreen = function(elem){
  (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen) ? pheedit.cancel_fullscreen() : pheedit.fullscreen(elem);
}
*/

htmlentities = function(str){
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};