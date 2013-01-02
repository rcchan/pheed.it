//= require_self
//= require underscore.min.js
//= require_directory .
//= require_directory fancybox

var pheedit = pheedit || {};
pheedit.CDN_HOST = (function(h){a=document.createElement('a');a.href=h;return a.hostname})(document.location.href);