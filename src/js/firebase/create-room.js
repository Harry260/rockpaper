//Variables - Elements
var createButton = $(".create-room");
var maxopt = $(".points-max");
//Or vars
var name = Cookie.get("alias");
var maxScore = 5;

//Create room Trigger
createButton.click(function() {

    var maxlimit = parseInt(maxopt.val())
    
    if(maxlimit < 25 || maxlimit > 5){
        maxScore = maxlimit;
        var gameID = makeid(5);
        createRoom(gameID.toLowerCase());
    }


})

//Create room function
function createRoom(id){
    var game ={

        scoreLimit: maxScore,
        //players: {
          //  [name]:{
            //    score: 0,
             //   alias: name,
             //   playerno: 1
           // }
        //},
        moves: {
            1 : 0,
            2 : 0
        }
    }
    firebase.database().ref("games/" + id).set(game, function(err){
        if(!err){
            window.location.replace("game.html?" + id)
        }
    })
}

