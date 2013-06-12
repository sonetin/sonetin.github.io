$(function() {
  $('.navbar .nav a').on('click', function(e) {
    $('html, body').animate({ scrollTop: $("#features").offset().top }, 500);
    return false;
  });
});
