function goto(element, func) {
  $('html, body').animate({ scrollTop: $('#'+$(element).attr('href').split('#')[1]).offset().top }, 500, func);
  return false;
}

function currentPlan() {
  return document.getElementById('booking_plan').value || 'free';
}

function booking_check() {
  analytics.track('Booking check', { step: 1, plan: currentPlan() });
  var tenant_name = $('#tenant_name').val();
  var tenant_name_valid = tenant_name.search(new RegExp($('#tenant_name').attr('pattern'))) >= 0;
  if($.inArray(tenant_name, ['', 'www', 'api']) != -1) {
    return booking_error();
  }
  if(!tenant_name_valid) {
    return booking_error();
  }
  $.get('https://corp.sonetin.com/api/tenants/exists',
    { domain: $('#tenant_name').val()+".sonetin.com" }
  ).done(booking_success).fail(booking_error);
  return false;
}

function booking_error() {
  analytics.track('Booking error', { step: 2, plan: currentPlan() });
  $('#tenant_name').focus().parents('.form-group').addClass('has-error');
  $('#tenant_name').tooltip({trigger: 'manual', placement: 'bottom', title: $('#tenant_name').data('error-msg')}).tooltip('show');
  return false;
}

function booking_success(data) {
  analytics.track('Booking available', { step: 3, plan: currentPlan() });
  if(data['exists']) return booking_error();
  $('#tenant_name').tooltip('hide');
  $('#tenant_name').parents('.form-group').removeClass('has-error');
  $('#booking-check').fadeOut('normal', function() {
    $('#booking-account').removeClass('hide').fadeIn('normal');
  });
}

function change_tenant_name() {
  analytics.track('Booking change', { step: 4, plan: currentPlan() });
  $('#tenant_name').val('');
  $('#booking-account').fadeOut('normal', function() {
    $('#booking-check').fadeIn('normal', function() {
      $('#tenant_name').focus();
    });
  });
}

function booking_error2() {
  analytics.track('Booking error2', { step: '5b', plan: currentPlan() });
  $('#booking-account-submit').tooltip({trigger: 'manual', placement: 'bottom', title: $('#booking').data('error-msg')}).tooltip('show');
  return false;
}

function booking_create() {
  if(!$('#booking').get(0).checkValidity()) {
    return booking_error2();
  }
  analytics.track('Booking creation', { step: 5, plan: currentPlan() });
  var endpoint = $("#booking").attr('action');
  $.post(endpoint,
    $("#booking").serialize(),
    function(data) {}
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

  //$('input, textarea').placeholder();
});
