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


var compteur = 3;


$(document).ready(function(){
	compteurFunc();
	levelFunction();
	trigerClick();
	showSnoopRestant();
	lireFileXml();
	$(".snoop").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd ',   
    function(e) {
    	checkImg();
  });
})


function trigerClick(){
	$("body").on("click",".snoop",function(){
		$(this).remove();
		SnoopClick ++ ;
		showSnoopRestant()
		calculPoint($(this));
		checkImg();
	});

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
	elem.css({'width': getRandomInt(300,501)+'px'});
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
	elem.animate({
					'top':top+'px',
					'left': left+'px'
				},getRandomInt(4000,7000),function(){checkImg(1);});
}
function levelFunction(){
	$("#level").html(level);

}

function checkImg(testEnd){
	testEnd = typeof testEnd !== 'undefined' ? testEnd : 0;
	if($('body img').length <= 0){
		nextLevel();
		level ++;
		levelFunction();
	}else{
		if(testEnd == 1){
			if($('body .snoop:animated').length <= 0){
				gameOver();
			}
		}
	}
}

function showSnoopRestant(){
	$('#snoopRestant').text(SnoopImg - SnoopClick);
}

function gameOver(){
	if($('#gameOver').length == 0){
		var gameBoxOver = '<div id="gameOver"><p>Game Over Man </p><a href="javascript:location.reload()">Retry</a></div>';
		$(gameBoxOver).hide().appendTo('.container').fadeIn();
	}
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
				var elemCreated = $("<img class='snoop' style='top:"+x+"px;left:"+y+"px' src='img/Snoop-Dogg-1.png' />").appendTo('body');
				imageFunc(elemCreated);
				createSnoopImg(SnoopImgStatus);
			}, 200);
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
            dataType: "xml",
            success: function(xml) 
                     {
                       $(xml).find('gamer').each(   
                         function()
                         {
                            var user = $(this).find('user').text();
                            var point = $(this).find('point').text();

                            console.log(user+" "+point);
                         });
                     }
        });
}
