//Variables
var gameid = window.location.search.substr(1);
var play = false;
var player_no = parseInt(window.location.hash.substr(1));
var started = false;
var globalGameData;
var playername = Cookie.get("alias");
var op;
var game_history = [];

//Variables - Element
var sr = $(".scissor-render");
var rk = $(".rock-render");
var pr = $(".paper-render");
var player_wrap = $(".players-wrap");
var logtext = $(".log-text h6")
var title_r = $(".title-room")


if(gameid){
    validateJoinable(gameid);

    title_r.html("#" + gameid)
    $(".rcode").text(gameid)
    document.title = "RockPaper #" + gameid;
}
else{
    window.location.replace("index.html");
}

//Game data Async
function initGame(){
    firebase.database().ref('games/' + gameid).on('value', function (snapshot) {

        globalGameData = snapshot.val();
        var child_Count = Object.keys(snapshot.val().players).length;
        var playerSCORE = snapshot.val().players[playername].score;
    
        op  = Object.keys(globalGameData.players).filter(e => e !== playername);
    
        console.log(child_Count)
    
        if(child_Count == 2){
    
            var plrs = snapshot.val().players;
            console.log(plrs)
    
            const players = Object.values(plrs).map(item => `
                <div class="player-box ${item.alias}-box">
                    <div class="text-icon">
                        <h2>${item.score}</h2>
                    </div>
                    <div>
                        <h2 class="player-name">${item.alias}</h2>
                    </div>
                </div>
            `)
            
    
            player_wrap.html(players.join(''))
            $(".wait-div").fadeOut();
            $('.' + playername + '-box .text-icon').attr("style", "background-image: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);")
    
            if(started = false){
                started = true;
            }
            play = true;
            
            if(playerSCORE === globalGameData.scoreLimit){
                $("body").append(`
                <div class="win-screen">
                    <div class="win-inner">
                        <h1>You won!</h1>
                        <h6>${playername} won with ${globalGameData.scoreLimit} Points against ${op}</h6>
                    </div>
                    <a href="index.html" class="continue-link">Continue</a>           
                </div>
                `)
    
                playAudio.victory();
                //firebase.database().ref("games/" + gameid).remove();
            }
    
            if(globalGameData.players[op].score === globalGameData.scoreLimit){
                $("body").append(`
                <div class="win-screen">
                    <div class="win-inner">
                        <h1>You Lost!</h1>
                    </div>
                    <a href="index.html" class="continue-link">Continue</a>           
                </div>
                `)
            }
        }
    
    
    }, function(error){
        if(error){
            
        }
    })
    
    //Detecting Moves
    firebase.database().ref('games/' + gameid + "/moves").on('value', function (snapshot) {
        var moves = snapshot.val();
        var my_move = moves[player_no];
        var op_move = moves[getOpId()];
        console.log(player_no, getOpId())
    
        if(moves[1] !== 0 && moves[2] !== 0 ){
            
            var status = checkScore(my_move, op_move);
            console.log(status)
            
            if(status === true){
                clearMoves("Yeah you got one");
                scorePlus();
                playAudio.plus();
            }
            else if (status === false){
                clearMoves("Nah you didn't");
                playAudio.ohno();
            }
            else{
                clearMoves("Bruh, Tied it off.")
            }
            var history_entry  = numberToText(my_move) + " against " + numberToText(op_move);
            addBox(history_entry, boxColor(status));

            logtext.text("Now it's your turn! Choose Rock Paper or Scissors")
            play = true;
        }
    
        if( moves[player_no] === 0 && moves[getOpId()] !== 0){
            logtext.text("Hello? It's your turn.. Opponent is waiting! 😂")
        }
        else if(moves[player_no] !== 0 && moves[getOpId()] === 0){
            logtext.text("Opponent is thinking. Give him time 😇");
    
            $(".circle-bordered-button").removeClass("pr-active");
            if(my_move === 1){
                rk.addClass("pr-active")
            }
            else if(my_move === 2){
                pr.addClass("pr-active")
            }
            else if(my_move === 3){
                sr.addClass("pr-active")
            }
        }
        else{
            logtext.text("Now it's your turn! Choose Rock Paper or Scissors ✌")
        }
        
    })
}


function getOpId(){

    if(player_no === 1){
        return 2
    }
    else if(player_no === 2){
        return 1
    }
    else{
        alert(player_no)
    }
}

function clearMoves(msg){

    $(".log").text(msg)
    $(".circle-bordered-button").removeClass("pr-active");
    setTimeout(function(){
        firebase.database().ref("games/" + gameid + "/moves").update({
            1:0,
            2:0
        })
    }, 500)
    console.log(msg);
    play = true;
}

function scorePlus(){
    var newscore = globalGameData.players[playername].score + 1;
    firebase.database().ref("games/" + gameid + "/players/" + playername).update({
        score: newscore,
    })
}

sr.on("click", function(){
    setMove(3)
})

pr.on("click", function(){
    setMove(2)
})

rk.on("click", function(){
    setMove(1)
})

//Set player move
function setMove(prop){
    
    if(play === true){
        firebase.database().ref("games/" + gameid + "/moves").update({
            [player_no]: prop
        })
    }
    play = false;
}

function checkScore(me, op){
    //if rock sc
    console.log("me :" + me + ', op:' + op)
    if(me === op){
        return "tie";
    }
    else if(me == 1){

        if(op == 2){
            return false;
        }else{
            return true;
        }
    }
    else if(me == 3){
        if(op == 1){
            return false;
        }else{
            return true;
        }
    }
    else if(me == 2){
        if(op == 3){
            return false;
        }else{
            return true;
        }
    }

}

//Joinablility

function validateJoinable(room){
    firebase.database().ref('games/' + room ).once('value', function (snapshot) {
       
        if (snapshot.hasChild("players")) {
            var child_Count = Object.keys(snapshot.val().players).length;
            var op = Object.keys(snapshot.val().players).toString();
            if (child_Count === 1){
                if(op !== playername){
                    makeMeJoin(2, op);
                }else{
                    makeMeJoin(3, op);
                }
            }
            else{
                $("body").append(`
                <div class="win-screen">
                    <div class="win-inner">
                        <h1>Bruh!</h1>
                        <h6 style="padding:0 20px">This game already started or expired!! You cannot rejoin to a game you joined.. Try creating another Room.</h6>
                    </div>
                    <a href="index.html" class="continue-link">Continue</a>           
                </div>
                `)

            }
            
        }
        else{
            makeMeJoin(1)
        }
        

    })
}

function makeMeJoin(no, op){
    if(no === 1){
        var pl ={
            [playername]: {
                score: 0,
                alias: playername,
                playerno: no,
            },
        }
    }
    else if(no === 2){
        var pl ={
            [playername]: {
                score: 0,
                alias: playername,
                playerno: 2,
            },
            [op]: {
                score: 0,
                alias: op,
                playerno: 1,
            }
        }
    }else if(no === 3){
        var secPL = "another_" + playername;
        playername = "another_" + playername;
        var pl ={
            [secPL]: {
                score: 0,
                alias: secPL,
                playerno: 2,
            },
            [op]: {
                score: 0,
                alias: op,
                playerno: 1,
            }
        }
    }
    else{
        alert("bruhJ")
    }

    firebase.database().ref("games/" + gameid + "/players").set(pl, 
    function(error){
        if(error){
           alert("Could't create player profile") 
        }
        else{
            if(no === 3){
                player_no = 2;
            }else{
                player_no = no;
            }
            initGame();
        }
    })
}
