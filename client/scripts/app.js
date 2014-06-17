// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {};

app.fetch =function() {
    $.ajax({
      // always use this url
      url: app.server,
      type: 'GET',
      data: { order: "-createdAt", limit: "15" },
      contentType: 'application/json',
      success: function (data) {
        app.printMessages(data);
        // console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };

app.printMessages = function(data) {
    console.log(data.results);
    app.clearMessages();
    var rooms = {};
    for (var i = 0; i < data.results.length; i++) {
      var message = data.results[i];
      rooms[message.roomname] = true;
      var li = $('<li></li>').text(message.username + ': '+ message.text);
      $('#chats').append(li);
    }

    console.log(rooms);
    app.printRooms(rooms);
  };

app.printRooms = function(rooms) {
  $('#rooms').children().remove();
  console.log(rooms);
  for (var key in rooms) {
    var option = $('<option value="'+key+'"></option>').text(key);
    $('#rooms').append(option);
  }
};
// app.clean = function(message) {
//   if (message.username.indexOf('<script')!==-1
//       || message.username.indexOf('$(\'')!==-1
//     ){
//     message.username = '[XSS Attack]';
//   }

//   if (message.text.indexOf('<script')!==-1
//       || message.text.indexOf('$(\'')!==-1
//       ){
//     message.text = '[XSS Attack]';
//   }
//   return message;

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
}

app.addMessage = function(message){

  app.send(message);

  $('#chats')
      .append('<li>'+message.username + ': '+message.text + '</li>');
};

app.fetch();
// setInterval(app.fetch, 1000);
console.log(app);

// <script> window.setInterval(function(){
// alert("HRHRHR 14 14 14");
// console.log('You Lost');
// } );
// </script>

