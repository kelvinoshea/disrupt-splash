$(function() {
  // On ready to double check packages are loaded
  // Booleans
  var loaded = {};
  loaded.fonts = false;
  loaded.orb = false;
  loaded.noise = false;

  //Fonts
  var font_disruptheavy = new FontFaceObserver('disruptheavy');
  var font_karla = new FontFaceObserver('Karla');
  var font_saira = new FontFaceObserver('Saira Condensed');
  Promise.all([font_disruptheavy.load(), font_karla.load(), font_saira.load()]).then(function () {
    // Fonts loaded
    $("html").addClass("fonts-loaded");
    loaded.fonts = true;
  });

  // Images
  $('#noise-overlay').imagesLoaded( function() {
    loaded.noise = true;
  });
  $("#rgb-orb").imagesLoaded( function() {
    loaded.orb  = true;
  });

  // Check ever 500ms for done
  // bit of a dirty way to do it lol but it works!
  var loadCount = 0;
  var loadCheck = setInterval(function() {
    if (loadCount > 20) {
      // somehow stuff has not loaded after 10 seconds?
      loader_hide()
      clearInterval(loadCheck);
    }
    if (allTrue(loaded)) {
      loader_hide()
      clearInterval(loadCheck);
    }
    loadCount++;
  }, 500);
  function allTrue(obj) {for(var o in obj) {if(!obj[o]) return false;}return true;}

  // Loader FUNCTIONS

  function loader_hide() {
    $("#loader").hide();
  }

  function loader_show() {
    $("#loader").show();
  }
});
