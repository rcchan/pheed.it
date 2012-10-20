pheedit = pheedit || {};
pheedit.fullscreen = function(elem){
  elem = $(elem)[0];
  if (elem.requestFullScreen) {  
    elem.requestFullScreen();  
  } else if (elem.mozRequestFullScreen) {  
    elem.mozRequestFullScreen();  
  } else if (elem.webkitRequestFullScreen) {  
    elem.webkitRequestFullScreen();  
  }
};