// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {};

app.fetch =function(currentRoom) {
    $.ajax({
      // always use this url
      url: app.server,
      type: 'GET',
      data: { order: "-createdAt", limit: "15" },
      contentType: 'application/json',
      success: function (data) {
        app.printMessages(data, currentRoom);

      },
      error: function (data) {

        console.error('chatterbox: Failed to send message');
      }
    });
  };
app.rooms = {};

app.printMessages = function(data, currentRoom) {
console.log(currentRoom)
  currentRoom = currentRoom || false;
  app.clearMessages();

  for (var i = 0; i < data.results.length; i++) {
    var message = data.results[i];
    app.rooms[message.roomname] = true;
    if(currentRoom === message.roomname){
      var li = $('<li></li>').text(message.username + ': '+ message.text);
      $('#chats').append(li);
    } else if (currentRoom === false || currentRoom === 'All Rooms') {
      var li = $('<li></li>').text(message.username + ': '+ message.text);
      $('#chats').append(li);
    }
  }


  $('#rooms').children().remove();
   app.rooms['All Rooms'] = true;
  for (var key in app.rooms) {
    var option = $('<option value="'+key+'"></option>').text(key);
    $('#rooms').append(option);
  }
  console.log(currentRoom);

// debugger;
  if(currentRoom){
    $('#rooms').val(currentRoom);
  } else {
    $('#rooms').val('All Rooms');
  }

};

// app.printRooms = function(rooms, currentRoom) {
// };

app.clearMessages = function() {
    $('#chats').children().remove();
  };

app.send = function(message) {

    $.ajax({
      // always use this url
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
};

app.addMessage = function(message){

  app.send(message);

  $('#chats')
      .append('<li>'+message.username + ': '+message.text + '</li>');
};

