data1 = [];

$(document).ready(function(){
var myDataRef = new Firebase('https://chrischris292.firebaseio.com/footballScores');
url ='https://chrischris292.firebaseio.com/footballScores.json'
result = $.ajax({
          url: url,
          dataType: "jsonp",
          async: true,
          success: function(data){
          	for(i=0;i<data.length;i++)
          	{
          		name = data[i].name;
          		score = data[i].score;
          		console.log(name)
          		console.log(score)
          		$('#leaderboard').append("<tr><td>"+name+"</td><td>" + score+"</td></tr>")
          	}
          }
})
});
