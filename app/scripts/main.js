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


  $('#hitboxes .item').hover(function(event) {
    // IN
    if ($('#effectOverlay > *').hasClass('hidden')) {
      $('#effectOverlay > *').removeClass('hidden');
    }

  }, function(event) {
    // OUT
    if (!$('#effectOverlay > *').hasClass('hidden')) {
      $('#effectOverlay > *').addClass('hidden');
    }
  });


  $('.email').on("invalid", function(e) {
      e.preventDefault(); // Block Shitty validation popup
  });

  $(".email").bind("propertychange change click keyup input paste", function(event) {
    $(this).attr('value', $(this).val());
    if ($(this).val() == "") {
      $('.email').next().attr('data-text', 'REGISTER YOUR INTEREST').html('Register your interest');
    }
    // Adds the .valid class. Probably not needed as we can use :valid/:invalid
    /* var email = document.querySelector('.email');
    if (email.validity.valid) {
      if (!$(".email").hasClass("valid")) {
         $(".email").addClass("valid");
       }
    } else {
      if ($(".email").hasClass("valid")) {
        $(".email").removeClass("valid");
      }
    } */
  });

  $('#formEmail .email').blur(function(){
    var email = document.querySelector('.email');
    if (email.validity.valid) {
      formSubmit();
    } else if (!email.validity.valueMissing) {
      formInvalid();
    }
  });

  $('#formEmail').submit(function(e){
    e.preventDefault();
    var email = document.querySelector('.email');
    if (email.validity.valid) {
      formSubmit();
    } else {
      formInvalid();
    }
  });


/* AJAX FORM SUBMISSION
------------------------------------------------------------------------------------------------- */
  function formSubmit() {
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
          console.log('Success');
          $('.email').next().attr('data-text', 'Success!').html('Success!');
          $('.email').css('pointer-events', 'none');

        },
        error: function(error) {
          console.log('error');
          $('.email').next().attr('data-text', 'Try Again').html('Try Again');

        }
      });
    } else {
      $('.email').next().attr('data-text', 'Emulated Success!').html('Emulated Success!');
    }
  }

  function formInvalid() {
    // handle invalid email
    var input = $('.email');
    var buttonTXT = input.next();
    buttonTXT.attr('data-text', "That's not an Email").html("That's not an Email");
  }
});
