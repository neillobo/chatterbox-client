// YOUR CODE HERE:
//
//  refactor to pass tests
//
//

var app = {};
app.rooms = {};
app.friends = {};
app.currentRoom = 'All Rooms';
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  var getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
    }
    return(false);
  };

  var username = getQueryVariable('username');
  console.log(username);

  $('#send').on('click',function(){
    app.currentRoom = app.currentRoom || 'All Rooms';
    console.log(app.currentRoom);
    var message = {
      'username' : username,
      'text' : $('#input').val(),
      'roomname' : app.currentRoom
    };
    console.log(app.currentRoom);
    console.log(message);
    app.addMessage(message);
  });

  $('#newRoom').on('click',function(){
    var uncleanRoom = prompt('Which room do you want to make?');
    var cleanRoom = _.escape(uncleanRoom);
    addRoom(cleanRoom);
  });

  $('#rooms').on('change',function(){
    $("select option:selected").each(function() {

      app.currentRoom = $(this).text();
      app.fetch($(this).text());

    });
  });
  app.fetch()
  setInterval(function(){
    app.fetch(app.currentRoom);
  },4000);
};

app.addRoom = function(cleanRoom) {
  app.rooms[cleanRoom] = true;
  app.currentRoom = cleanRoom;
  app.fetch(app.currentRoom);
}

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

    app.printFriends();
  });

 // print rooms
  $('#rooms').children().remove();
  app.rooms['All Rooms'] = true;
  for (var key in app.rooms) {
    var option = $('<option value="'+key+'"></option>').text(key);
    $('#rooms').append(option);
  }

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
  var li = $('<li></li>').append('<a class="users" href="#" value="'+message.username+'">'+message.username + '</a>: '+ message.text);
  if(app.friends[message.username]){
    li = $('<strong></strong>').append(li);
  }
  $('#chats').prepend(li);

  app.fetch(app.currentRoom);

};

