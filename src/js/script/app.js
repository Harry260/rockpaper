//Make random ID
$("#myname").val(Cookie.get("alias"));
var playAudio = {
    ohno : function() { 
       document.getElementById("oh-no-audio").play(); 
    },
    plus : function() {        
        document.getElementById("plus-audio").play(); 
    },
    victory : function() {        
        document.getElementById("epic-audio").play(); 
    },
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function setAl(){
    var name = document.getElementById("myname").value
    .replaceAll("$", "_")
    .replaceAll(".", "_")
    .replaceAll("/", "_")
    .replaceAll("[", "_")
    .replaceAll("]", "_")
    .replaceAll("#", "_");

    if(name){
        
        Cookie.set(
            'alias', 
            name
        )
    }         
}

function addBox(message, color){
    var area = $(".chat-area");
    area.append(`
    <div class="chatbox">
        <h6 class="chat-abs">${message}</h3>
        <div class="dot" style="background:${color}"></div>
    </div>
    `)
}

function numberToText(no){
    if(no === 1){
        return "Rock ✊"
    }    
    else if(no === 2){
        return "Paper 🤚"
    }
    else if(no === 3){
        return "Scissors ✌"
    }
}

function boxColor(q){
    if(q === true){
        return "green"
    }
    else if ( q === false){
        return  "#ff4e50"
    }else{
        return "orange"
    }
}