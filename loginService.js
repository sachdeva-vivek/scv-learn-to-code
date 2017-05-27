$(document).ready(function() {

  $("#login").click(function() {

    var userName = $("#userName").val();
    var password = $("#userPassword").val();

    var posting = $.post( 'http://localhost:8081/login',
      {
        userName : userName,
        password: password
      });

    posting.done(function(data, status, xhr) {
      window.sessionStorage.token = data.token
      window.location.href = "index.html";
    });

    posting.fail(function(err) {
      console.log("err: "+err);
      $(".error").show();
    });

  });


});
