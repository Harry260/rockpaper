$('body').on('click', function(e) {
    var getClass = this.className;
    console.log(getClass);
    if($(e.target).closest('.settings-pop').length == 0) {
        if(event.target.className.includes('np')){}else{
            $(".settings-pop").fadeOut();
        }
        
    }
})

$(".settings-btn").on("click", function(){
    $(".settings-pop").fadeIn();
})


$(".open-cpop").on("click", function(){
    $(".create-inner").fadeIn();
})

$(".cancel-create").on("click", function(){
    $(".create-inner").fadeOut();
})

if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
    $(".wait-div").css("background-color","#000000f5");
}

$(".go-join").on("click", function(){
    var code = $(".JoinCode").val();
    join(code);
})

$('.JoinCode').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        var code = $(this).val();
        join(code);
    }
});

function warninglog(msg){
    var el = $(".warning-label");
    el.text(msg);
    el.fadeIn();
    setTimeout(function(){
        el.fadeOut();
    }, 2000)
}

function join(code){
    if(code.length === 5){
        window.location.replace("game.html?" + code)
    }
    else{
        warninglog("Code is incorrect.")
    }
}

function checkvisibile(){
    joinbtn = $(".go-join");
    var code = $(".JoinCode").val();
    if(code){
        joinbtn.fadeIn().css("display", "flex");
    }
    else{
        joinbtn.fadeOut();
    }
}

$(".close-div").on("click", function(){
    $(".game-history").fadeOut();
})

$(".chat-button").on("click", function(){
    $(".game-history").fadeIn();
})

