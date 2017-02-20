function refresh_comments() {
  var container = $('#comments');
  container.empty();

  $.ajax({
    dataType: 'json',
    url: '/comments',
    success: function(comments) {
      comments.forEach(function(comment) {
        $('<dt/>').html(comment.username + ' (' + comment.minutes_ago + ' minutes ago)').appendTo(container);
        $('<dd/>').html(comment.comment).appendTo(container);
      });
    },
    error: function(jqxhr, status) {
      console.log('Error: ' + status);
    }
  });
}

$(document).ready(function() {
  refresh_comments();
  setInterval(15000, refresh_comments);

  $('#make_comment').submit(function(evt) {
    var form = $(this);
    evt.preventDefault();

    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: form.serialize(),
      dataType: 'text',
      success: function(data) {
        form.find('textarea').val('');
        refresh_comments();
      },
      error: function(jqxhr, status) {
        console.log('Error: ' + status);
      }
    });
  });
});
