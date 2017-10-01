var IS_MOBILE = (/Mobi/.test(navigator.userAgent));
$(function() {
  // We Ready Boiis
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
  // Shuffle the title every {param1}ms and display it for {param2}ms with {param3} number of random symbols
  documentTitleDisrupter(2000, 1000, 3);

  /* $('#hitboxes .item').hover(function(event) {
    // IN
    if ($('#effectOverlay > *').hasClass('hidden')) {
      $('#effectOverlay > *').removeClass('hidden');
    }

  }, function(event) {
    // OUT
    if (!$('#effectOverlay > *').hasClass('hidden')) {
      $('#effectOverlay > *').addClass('hidden');
    }
  }); */


  $('.email').on("invalid", function(e) {
      e.preventDefault(); // Block Shitty validation popup
  });

  $(".email").bind("propertychange change click keyup input paste", function(event) {
    $(this).attr('value', $(this).val());
    if ($(this).val() == "") {
      $('.email').next().attr('data-text', 'REGISTER YOUR INTEREST').html('Register your interest');
    }
    var email = document.querySelector('.email');
    if (email.validity.valid) {
      if ($(".submitButton").hasClass("hidden")) {
         $(".submitButton").removeClass("hidden");
       }
    } else {
      if (!$(".submitButton").hasClass("hidden")) {
        $(".submitButton").addClass("hidden");
      }
    }
  });

  // Hide and show extraneous elements when typing email on mobile devices
  var toggleWhileTyping = function(toggle) {
    if (IS_MOBILE) {
      $('.disruptTitleTest, .details, footer').fadeTo(200, toggle ? 1 : 0);
    }
  }

  $('.email').focusin(function () { toggleWhileTyping(false); });
  $('.email').focusout(function () { toggleWhileTyping(true); });

  /* $('#formEmail .email').blur(function(){
    var email = document.querySelector('.email');
    if (email.validity.valid) {
      formSubmit();
    } else if (!email.validity.valueMissing) {
      formInvalid();
    }
  }); */

  $('#formEmail').submit(function(e){
    e.preventDefault();
    var email = document.querySelector('.email');
    if (email.validity.valid) {
      $(".email").blur();
      formSubmit();
    } else {
      formInvalid();
    }
  });


/* AJAX FORM SUBMISSION
------------------------------------------------------------------------------------------------- */
  function formSubmit() {
    $(".submitButton").addClass("hidden");
    if (!isLocalhost) {
      $.ajax({
        url: 'registerEmail.php',
        type: 'POST',
        data: {
          email: $('.email').val(),
        },
        beforeSend: function() {
          $('.email').next().attr('data-text', 'Registering Interest...').html('Registering Interest...');

        },
        success: function(result) {
          if (result == "1") {
            $('.email').next().attr('data-text', 'Thank You!').html('Thank You!');
            $('.email').css('pointer-events', 'none');
          } else if (result == "duplicate") {
            $('.email').next().attr('data-text', 'You have already subscribed!').html('You have already subscribed!');
          } else {
            console.log(result);
            $('.email').next().attr('data-text', 'Try Again.').html('Try Again.');
          }
        },
        error: function(error) {
          console.log(error);
          $('.email').next().attr('data-text', 'Try Again').html('Try Again');

        }
      });
    } else {
      $('.email').next().attr('data-text', 'Emulated Success!').html('Emulated Success!');
      $('.email').css('pointer-events', 'none');
    }
  }

  function formInvalid() {
    // handle invalid email
    var input = $('.email');
    var buttonTXT = input.next();
    buttonTXT.attr('data-text', "That's not an Email").html("That's not an Email");
  }
});

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Shuffle the Document Title on loop.
 * @param {number} delay - ms tnterval to Scramble on .
 * @param {number} restore - ms to display the scrambled text for.
 * @param {number} intensity - Intensity of symbols added.
 * @param {character[]} [chars] - Characters to add randomly.
 */
function documentTitleDisrupter(delay, restore, intensity, chars) {
  var org = document.title;
  setInterval(function() {
      document.title = org.shuffle().scramble(intensity, chars);
      setTimeout(function(){
        document.title = org;
      }, restore);
  }, delay);
};

/**
 * Add randomly add random chars to a string
 * @param {number} intensity - Intensity of symbols added.
 * @param {character[]} [chars] - Characters to add randomly.
 */
String.prototype.scramble = function(n, char) {
  var arr = this.split(''),
      char= char || ['!','@','#','$','%','^','&','*','(',')','_','-','+','=','|',':',';',"'",'"','<','>','.',',','?','\\','/','{','}'];

  while(n--) {
    arr.splice(Math.floor(Math.random() * (arr.length+1)), 0, char[Math.floor(Math.random() * (char.length+1))]);
  }

  return arr.join('');
}

/**
 * Randomly reorder the characters in a string
 */
String.prototype.shuffle = function() {
  return this.split('').sort(function(){return 0.5-Math.random()}).join('');
}
