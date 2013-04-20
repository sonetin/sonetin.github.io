$(document).ready(function() {
  var href = document.location.pathname.split('/').reverse()[0];
  $('.navbar li a[href $= "' + href + '"], footer li a[href $= "' + href + '"]').parent().addClass('active');
  if(href == '') {
    $('.navbar li:first-child').addClass('active');
  }
});
