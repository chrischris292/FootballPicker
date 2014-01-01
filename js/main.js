totalGames = [];
userName = "";
week = 9;
$('window').ready(function(){
  fireBaseGetGames(week);
  $('#signin').modal('show');
  sendGames();
  startHelp();

})
function fireBaseChat(user){
      var myDataRef = new Firebase('https://chrischris292.firebaseio.com/chat');
      $('#chatInput').keypress(function (e) {
        if (e.keyCode == 13) {
          var name = user
          var text = $('#chatInput').val();
          myDataRef.push({name: name, text: text});
          $('#messageInput').val();
        }
      });
      myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
      });
      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };
      }

function fireBaseLogIn(){
  counter = 0;
var chatRef = new Firebase('https://chrischris292.firebaseio.com');
var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    alert(error);
  } else if (user) {
    // user authenticated with Firebase
    url = "http://graph.facebook.com/"+user.id;
    if(counter==0)
    {
    result = $.ajax({
          url: url,
          dataType: "jsonp",
          async: true,
          success: function(data) {
            fireBaseChat(data.name);
            userName = data.name;
          }
  });
  }
    counter++;
    $('#signin').modal('hide');
  } else {
    // user is logged out
  }
});
// attempt to log the user in with your preferred authentication provider
auth.login('facebook');
}
function fireBaseGetGames(week){
  var home = {};
  home.name = [];
  home.id = [];
  away = {};
  away.name = [];
  away.id = [];
  var url = "https://chrischris292.firebaseio.com/football.json"
    result = $.ajax({
          url: url,
          dataType: "jsonp",
          async: true,
          success: function(data) {
            result = data;
            for(i=0;i<result[week].game_days.length;i++)
            {
              for(y=0;y<result[week].game_days[i].matches.length;y++){
                home = result[week].game_days[i].matches[y].home.name + " " + result[week].game_days[i].matches[y].home.nick;
                home_id = result[week].game_days[i].matches[y].home.id;
                away = result[week].game_days[i].matches[y].away.name +" "+ result[week].game_days[i].matches[y].away.nick;
                away_id = result[week].game_days[i].matches[y].away.id;
              $('#slides').append("<section class = 'slide'><h1 class = 'homeTeam animated' teamID = " +home_id + ">Home: " + home + "</h1><br /> <h1 class = 'awayTeam animated' teamID = " +away_id+">Away: " + away + "</h1></section>");
              $('#teams').append("<tr><td tableTeamIDHome="+home_id+">" + home + "</td><td tableTeamIDAway="+away_id+">" + away + "</td></tr>");
              }
            }
            $(function() {
            $.deck('.slide');
            });
            gameChosen();
            totalGames = $('.deck-status').find('.deck-status-total').html();
            return data;
        }
      });
}
function gameChosen(){
  $(".homeTeam").click(function(){
    if($("[tableTeamIDHome=" + $(this).attr("teamID") + "]").closest('tr').hasClass("rowSelected"))
    {
      var awayTeam = $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").closest('tr').children()[1];
      awayTeam = $(awayTeam);
      awayTeam.removeClass();
      $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").toggleClass("selected");
    }

    else{
    $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").toggleClass("selected");
    $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").closest('tr').toggleClass("rowSelected")
    }
    var awayTeam = $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").closest('tr').children()[1]
    var homeTeam = $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").closest('tr').children()[0]
    awayTeam = $(awayTeam);
    homeTeam = $(homeTeam);
    if(!awayTeam.hasClass("selected")&&!homeTeam.hasClass("selected"))
    {
          $("[tableTeamIDHome=" + $(this).attr("teamID") + "]").closest('tr').toggleClass("rowSelected");
    }
  })
  $(".awayTeam").click(function(){
     if($("[tableTeamIDAway=" + $(this).attr("teamID") + "]").closest('tr').hasClass("rowSelected"))
    {
      var awayTeam = $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").closest('tr').children()[0];
      awayTeam = $(awayTeam);
      awayTeam.removeClass();
      $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").toggleClass("selected");
    }
    else{
    $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").toggleClass("selected");
    $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").closest('tr').toggleClass("rowSelected")
    }
    var awayTeam = $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").closest('tr').children()[1]
    var homeTeam = $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").closest('tr').children()[0]
    awayTeam = $(awayTeam);
    homeTeam = $(homeTeam);
    if(!awayTeam.hasClass("selected")&&!homeTeam.hasClass("selected"))
    {
          $("[tableTeamIDAway=" + $(this).attr("teamID") + "]").closest('tr').toggleClass("rowSelected");
    }
  })
}
function sendGames()
{
  $('#uploadButton').click(function(){
    console.log('clicked')
  var temp = [];
  var data = [];
  var teams = $('#teams').find('.selected');
  for(i=0;i<teams.length;i++)
  {
      temp.push($(teams[i]));
      data.push(temp[i][0].attributes[0].nodeValue)
  }
  var difference = totalGames-data.length;
  if(difference==0)
  {
          var myDataRef = new Firebase('https://chrischris292.firebaseio.com/footballLeaderboards');
          myDataRef.child('Chris').child('Week').set(week)
          myDataRef.child('Chris').child('Week').child(week).set(data);
          myDataRef.child('Chris').child('Name').set('Chris');
          toastr.success("Data has been uploaded for Week: " + week)
  }
  else
    toastr.error('You still have ' + difference + " games remaining")
  })
}
function startHelp()
{
  $('#helpButton').click(function(){
  introJs().start();
  })
}