$(function() {
  // We Ready Boiis

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

  $('#formEmail').submit(function() {
    $.ajax({
    type: 'POST',
    url: '',
    data: { email: $('#formEmail .email').val()},
    secure: true,
    tryCount: 0,
    retryLimit: 3,
    beforeSend: function() {

    },
    error: function(jqXHR, textStatus, error) {
      if (textStatus === 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            // try again
            $.ajax(this);
            return;
        }
        console.log("Arax Request Failed:");
        console.log(jqXHR.responseText);
        console.log(textStatus);
        console.log(error);
        console.log("Query: " + query);
        console.log("--------------------");
      } else {
        console.log("Arax Request Failed:");
        console.log(jqXHR.responseText);
        console.log(textStatus);
        console.log(error);
        console.log("Query: " + query);
        console.log("--------------------");
      }
    },
    success: function() {
      $('#formEmail .buttonText').html("Thank You");
    }
  });
    return false; // cancel default
  });
});
