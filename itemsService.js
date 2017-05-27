// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request

function addNewItem() {

  var itemText = document.getElementById('item-box').value;
  $.ajax({
    type: "POST",
    url: "http://localhost:8081/api/item",
    headers: {
        'Authorization':'Bearer '+window.sessionStorage.token,
        'Content-Type':'application/json'
    },
    data: JSON.stringify({
      item: itemText,
      status: 'pending' }),
    success: function(itemAdded) {
      addItem(itemText, 'pending', itemAdded._id)
    },
    failure: function(err) {
      if (err.status === 401) {
        window.location.href = "login.html";
      }
      console.log(err);
    }
  });

}

function retrieveAllItems() {

  $.ajax({
    url: 'http://localhost:8081/api/items',
    headers: {
        'Authorization':'Bearer '+window.sessionStorage.token,
        'Content-Type':'application/json'
    },
    method: 'GET',
    dataType: 'json'
  })
  .done(function(items) {
      for (var i=0; i<items.length; i++) {
        addItem(items[i].item, items[i].status, items[i]._id);
      }
  })
  .fail(function(err) {
      if (err.status === 401) {
        window.location.href = "login.html";
      }
  });

}

function move(listItem, status, callback) {
  $.ajax({
    type: "PUT",
    url: "http://localhost:8081/api/item",
    headers: {
        'Authorization':'Bearer '+window.sessionStorage.token,
        'Content-Type':'application/json'
    },
    data: JSON.stringify({_id: listItem.attr('id'), status: status}),
    success: function(itemAdded) {
      callback(itemAdded);
    },
    failure: function(err) {
      if (err.status === 401) {
        window.location.href = "login.html";
      }
      console.log(err);
    }
  });

}

function addItem(todoItemText, status, listItemId) {

  var parent = status === "pending" ?
    $("#pending-items") : $("#done-items");
  var li = $("<li>")
            .text(todoItemText)
            .addClass("pending-item")
            .attr("id", listItemId)
            .appendTo(parent);

  var futureStatus = status === "pending" ? "done" : "pending";

  $("<a>")
    .text(status === "pending"? "Done" : "Move to pending")
    .attr("href", "javascript:void(0)")
    .css("margin", "10px")
    .click(function() {
      move(li, futureStatus, function() {
        li.hide();
        addItem(
          document.getElementById(li.attr('id')).childNodes[0].nodeValue,
          futureStatus, li.attr('id'));
      });
    })
    .appendTo(li);

    $("<a>")
      .text("Delete")
      .attr("href", "javascript:void(0)")
      .css("margin", "10px")
      .click(function() {
        move(li, 'archive', function() {
          li.hide();
        });
       })
      .appendTo(li);

}
