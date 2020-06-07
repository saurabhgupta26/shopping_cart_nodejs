console.log('Hello');
$('.button, .close').on('click', function(e) {
    e.preventDefault();
    $('.detail, .all_users_HTML, .total_users').toggleClass('open');
  });