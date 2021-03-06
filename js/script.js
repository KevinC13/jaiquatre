var top = 0;
var left = 0;
var sizeTop = $(document).innerHeight();
var sizeLeft = $(document).innerWidth();
var right = true;
var bottom = true;
var level = 1;
var SnoopImg = 1;
var SnoopClick = 0;
var SnoopImgStatus = 0;
var sizeSnoopImgWidth = 500;
var point = 0;
var snoopDog = {
	positionX 	: 0,
	positionY 	: 0,
	width 		: 0,
	height 		: 0,
	urlImg 		: '',
	active		: false,
	clicked		: false,
	elemHtml 	: ''
};


var compteur = 3;


$(document).ready(function(){
	compteurFunc();
	levelFunction();
	triger();
	showSnoopRestant();
	lireFileXml();	
	$(".snoop").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd ',   
    function(e) {
    	checkImg();
  });
})


function triger(){
	$("body").on("mousedown",".snoop",function(){
		$(this).remove();
		SnoopClick ++ ;
		showSnoopRestant()
		calculPoint($(this));
		checkImg();
		$(this).removeClass('needToBeClicked');
	});

	// Desactivate right click event
	$(document).on("contextmenu", function(e) {
        e.preventDefault();
    });

    $(window).resize(function (){
		sizeTop = $(document).innerHeight();
		sizeLeft = $(document).innerWidth();
    })
}

function playSound(){
document.getElementById('soundSnoop').play();
}

function compteurFunc(){
	setTimeout(function(){
		$(".compteur").html(compteur);
		compteur = compteur - 1;
		if (compteur == 3){
			$('.compteur').html('3');
		}
		if (compteur < 0){
			imageFunc($(".snoop"));
			$('.compteur').remove();
		}
		else{
			compteurFunc();
		}
	}, 1000);
}

function imageFunc(elem){
	var direction = getRandomInt(1,3);
	var rotation = getRandomInt(1,3);
	var top = sizeTop + sizeSnoopImgWidth ;
	var left = sizeLeft + sizeSnoopImgWidth;
	var size = getRandomInt(300,501);
	elem.css({'width': size+'px','height': size+'px',});
	elem.css({'animation-duration': getRandomInt(1,5)+'s'});
	if(rotation == 1){
		elem.css({'animation-name':'rotatingReverse'});
	}
	if(elem.offset().left >= sizeLeft){
		left = -sizeSnoopImgWidth;
	}
	if(direction == 1){
		top = sizeTop*1.10
	}else{
		top = 100;
	}
	elem.velocity({
					'top':top+'px',
					'left': left+'px'
				},{
					duration: getRandomInt(4000,7000),
					 begin: function(e){$(e).addClass('needToBeClicked')},
					complete: function(e){checkImg(1);$(e).addClass('end')}
				});
}
function levelFunction(){
	$("#level").html(level);

}

function checkImg(testEnd){
	testEnd = typeof testEnd !== 'undefined' ? testEnd : 0;
	if($('body .snoop').length <= 0){
		nextLevel();
		level ++;
		levelFunction();
	}else{
			if($('body .snoop.needToBeClicked.end').length > 0){
				gameOver();
			}
		
	}
}

function showSnoopRestant(){
	$('#snoopRestant').text(SnoopImg - SnoopClick);
}

function gameOver(){
	$('#gameOver').css({"display":"block"});
}

function createSnoopImg(variable){
		if(variable > 0){
			SnoopImgStatus -- ;
			var x = getRandomInt(0,sizeTop/2);
			var y = -sizeSnoopImgWidth;
			if(getRandomInt(1,3) == 2){
				y = sizeLeft + sizeSnoopImgWidth;

			}
			setTimeout(function(){
				var htmlCreated = "<div class='snoop' style='top:"+x+"px;left:"+y+"px'> </div>";
				var elemCreated = $(htmlCreated).appendTo('body');
				imageFunc(elemCreated);
				createSnoopImg(SnoopImgStatus);
			}, 400);
		}else{checkImg();}
}
function nextLevel(){
	SnoopImg ++;
	 playSound();
	SnoopClick = 0;
	SnoopImgStatus = SnoopImg;
	createSnoopImg(SnoopImg);
	point += level * 100;
	$('#snoopPoint').text(point);
	showSnoopRestant();
}

function resetDiv(elem){
	elem.removeAttr( 'style' );
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function calculPoint(elem){
	point += algoPoints(parseInt(elem.css("width"),10));
	$('#snoopPoint').text(point);
}

function algoPoints(tailleSnoop){
	return points = Math.floor(((Math.floor(Math.exp(level))*100)/tailleSnoop));
}

function lireFileXml(){
	$.ajax( {
    	type: "GET",
        url: "data/data.php",
        data : { action : 'read'},
        success: function(xml) {
        	var scores = JSON.parse(xml);
        	for (var i = 0; i < scores.scores.length; i++){
        		var html = "<p><span class='nom'>"+ scores.scores[i].name+"</span> <span class='points'>"+scores.scores[i].points+"</span></p>";
				$(html).appendTo("#SnoopBestScore");
        	}
		}
    });
}

function saveScore(){
	$.ajax( {
        type: "GET",
        url: "data/data.php",
        data : { 
        	action : 'write',
    		name : $('#nameScore').val(),
    		points : point
    	},
        success: function(xml) {
        	alert('score enregistré');
    	}
	});
}
