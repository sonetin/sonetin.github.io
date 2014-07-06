function goto(element, func) {
  $('html, body').animate({ scrollTop: $('#'+$(element).attr('href').split('#')[1]).offset().top }, 500, func);
  return false;
}

function formValues() {
  return $("#booking").serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
}

function booking_check() {
  analytics.track('Booking check', formValues());
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
  analytics.track('Booking error', formValues());
  $('#tenant_name').focus().parents('.form-group').addClass('has-error');
  $('#tenant_name').tooltip({trigger: 'manual', placement: 'bottom', title: $('#tenant_name').data('error-msg')}).tooltip('show');
  return false;
}

function booking_success(data) {
  analytics.track('Booking available', formValues());
  if(data['exists']) return booking_error();
  $('#tenant_name').tooltip('hide');
  $('#tenant_name').parents('.form-group').removeClass('has-error');
  $('#booking-check').fadeOut('normal', function() {
    $('#booking-account').removeClass('hide').fadeIn('normal');
  });
}

function change_tenant_name() {
  analytics.track('Booking change', formValues());
  $('#tenant_name').val('');
  $('#booking-account').fadeOut('normal', function() {
    $('#booking-check').fadeIn('normal', function() {
      $('#tenant_name').focus();
    });
  });
}

function booking_error2() {
  analytics.track('Booking error2', formValues());
  $('#booking-account-submit').tooltip({trigger: 'manual', placement: 'bottom', title: $('#booking').data('error-msg')}).tooltip('show');
  return false;
}

function analyticsIdentify() {
  var tenant_name = $('#tenant_name').val().toLowerCase(),
      firstName = $('#firstname').val(),
      lastName = $('#lastname').val(),
      email = $('#email').val();
  analytics.identify(tenant_name+"#"+email, {
    email: email,
    firstName: firstName,
    lastName: lastName
  });
}

function booking_create() {
  if(!$('#booking').get(0).checkValidity()) {
    return booking_error2();
  }
  analytics.track('Signed Up', formValues());
  analyticsIdentify();
  var endpoint = $("#booking").attr('action');
  $.post(endpoint, $("#booking").serialize());
  $('#booking-account').fadeOut('normal', function() {
    $('#booking-success').removeClass('hide').fadeIn('normal');
  });
  return false;
}

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}

function handle_inviter() {
  var from = unescape(getURLParameter('u'));
  var pic = unescape(getURLParameter('p'));
  if((window.atob) && (from !== "null")) {
    from = window.atob(from);
    if(pic !== "null") {
      from = '<img src="'+window.atob(pic)+'">' + from;
    }
    $('#recommander').html(from);
    $('#recommandation').fadeIn();
  }
}

function readCookie(k){return(document.cookie.match('(^|; )'+k+'=([^;]*)')||0)[2]}

function handle_login() {
  var platform = readCookie('platform');
  if(platform) {
    $('#signin a span').text(platform);
    $('#signin a').attr('href', 'http://'+platform);
    $('#signin').show('fast')
  }
}

function handle_being_iframed() {
  if(self !== top) {
    top.location.assign('http://sonetin.com');
  }
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

  handle_being_iframed();
  handle_inviter();
  handle_login();
});
