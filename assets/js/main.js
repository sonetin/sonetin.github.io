function goto(element, func) {
  $('html, body').animate({ scrollTop: $('#'+$(element).attr('href').split('#')[1]).offset().top }, 500, func);
  return false;
}

function booking_error() {
  $('#tenant_name').focus().parents('.form-group').addClass('has-error');
  $('#tenant_name').tooltip({trigger: 'manual', placement: 'bottom', title: $('#tenant_name').data('error-msg')}).tooltip('show');
  return false;
}

function booking_success(data) {
  if(data['exists']) return booking_error();
  $('#tenant_name').tooltip('hide');
  $('#tenant_name').parents('.form-group').removeClass('has-error');
  $('#booking-check').fadeOut('normal', function() {
    $('#booking-account').removeClass('hide').fadeIn('normal');
  });
}

function booking_check() {
  var tenant_name = $('#tenant_name').val();
  if($.inArray(tenant_name, ['', 'www', 'api']) != -1) {
    return booking_error();
  }
  $.get('https://corp.sonetin.com/api/tenants/exists',
    { domain: $('#tenant_name').val()+".sonetin.com" }
  ).done(booking_success).fail(booking_error);
  return false;
}

function change_tenant_name() {
  $('#tenant_name').val('');
  $('#booking-account').fadeOut('normal', function() {
    $('#booking-check').fadeIn('normal', function() {
      $('#tenant_name').focus();
    });
  });
}

function booking_create() {
  var endpoint = $("#booking form").attr('action');
  $.post(endpoint,
    $("#booking form").serialize(),
    function(data) {
    }
  );
  $('#booking-account').fadeOut('normal', function() {
    $('#booking-success').removeClass('hide').fadeIn('normal');
  });
  return false;
}

$(function() {
  $('.action-book').on('click', function(e) {
    return goto(this, function() { $('#tenant_name').focus() });
  });
  $('a.scrollable-link').on('click', function(e) {
    return goto(this);
  });
  $('#booking-check-submit').on('click', booking_check);
  $('#booking-account-submit').on('click', booking_create);

  $('input, textarea').placeholder();
});
