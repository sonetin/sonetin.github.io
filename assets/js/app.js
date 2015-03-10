/**
 * Sonetin scripts
 **/

function goto(element, func) {
  $("html, body").animate({ scrollTop: $('#'+$(element).attr('href').split('#')[1]).offset().top }, 500, func);
  return false;
}

$(function() {
  $("[rotating]").textrotator({
    animation: "flipUp", // Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
    separator: ",",
    speed: 2000
  });

  $("a[href^='#']:not([action])").on("click", function(e) {
    return goto(this);
  });
});
