// YOUR CODE HERE:
//
//  implement better init
//  document read in this file?
//  create room button
//  maybe have all rooms persistent, don't need to delete rooms that fall out
//    i.e. have app.rooms and add 'All Rooms' at beginning
//  refactor to pass tests
//
//

var app = {};
app.rooms = {};
app.friends = {};
app.currentRoom = 'All Rooms';
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {};

app.fetch = function(currentRoom) {
    $.ajax({
      // always use this url
      url: app.server,
      type: 'GET',
      data: { order: "-createdAt", limit: "15" },
      contentType: 'application/json',
      success: function (data) {
        app.currentRoom = currentRoom;
        app.printMessages(data, currentRoom);
      },
      error: function (data) {
        // console.error('chatterbox: Failed to send message');
      }
    });
  };

app.printMessages = function(data, currentRoom) {

  currentRoom = currentRoom || false;
  app.clearMessages();

  for (var i = 0; i < data.results.length; i++) {
    var message = data.results[i];
    app.rooms[message.roomname] = true;
    if(currentRoom === message.roomname || (currentRoom === false || currentRoom === 'All Rooms')){
      var li = $('<li></li>').append('<a class="users" href="#" value="'+_.escape(message.username)+'">'+_.escape(message.username) + '</a>: '+ _.escape(message.text));
      if(app.friends[_.escape(message.username)]){
        li = $('<strong></strong>').append(li);
      }
      $('#chats').append(li);
    }
  }

 $('.users').on('click',function(){
    var friend = $(this)[0].innerHTML;
    app.friends[friend] = true;
    console.log(app.friends);
    app.printFriends();
  });

  $('#rooms').children().remove();
  app.rooms['All Rooms'] = true;
  for (var key in app.rooms) {
    var option = $('<option value="'+key+'"></option>').text(key);
    $('#rooms').append(option);
  }
  console.log(currentRoom);

  (currentRoom) ? $('#rooms').val(currentRoom) : $('#rooms').val('All Rooms');
};

app.printFriends = function() {
  $('#friends').children().remove();
  for (var key in app.friends) {
    var li = $('<li></li>').text(key);
    $('#friends').append(li);
  }

};


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
  app.fetch(app.currentRoom);
  // $('#chats')
  //     .prepend('<li>'+message.username + ': '+message.text + '</li>');
};

