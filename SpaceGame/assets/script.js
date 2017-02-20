// global variables
var currentState = 0;
var timerCount = 60;
var paused = false;
var currentScore = 200;
var canvasTop = -1;
var canvasLeft = -1;
var speedMultiplier = 3;

var timerMethod;
var drawGameMethod;
var blackHoleMethod;

// Black hole constants
var type_blue_hole = 0;
var type_purple_hole = 1;
var type_black_hole = 2;
var path_blue_hole = "assets/images/blue_hole.svg";
var path_purple_hole = "assets/images/purple_hole.svg";
var path_black_hole = "assets/images/black_hole.svg";

// Constructor for black holes
var blackHoles = new Array();
var BlackHole = function(type, x, y, img) {
	this.x = x;
	this.y = y;
	this.img = img;
	if (type == type_blue_hole) {
		this.pullDuration = 60; // how long does it take to pull the object
		this.full = 3;
		this.point = 5;
	} else if (type == type_purple_hole) { 
		this.pullDuration = 35;
		this.full = 2;
		this.point = 10;
	} else if (type == type_black_hole) { 
		this.pullDuration = 20;
		this.full = 1;
		this.point = 20;
	} else {
		// otherwise, hmm.... something must be wrong
		console.log('Things went wrong! This kind of black hole does not exist!');
	}
	this.pulledSpaceObjects = new Array();
}
BlackHole.prototype.draw = function() {
	// the top left corner of the image is at (x,y)
	window.ctx.drawImage(this.img, this.x, this.y, 50, 50);
	// debug purpose
	// window.ctx.strokeRect(this.x-25,this.y-25,100,100);
}
BlackHole.prototype.dismiss = function() {
	// first remove this black hole from black hole list
	blackHoles.splice(blackHoles.indexOf(this), 1);
	// then tell all the objects being pulled to return
	for (var i=0; i<this.pulledSpaceObjects.length; i++) {
		this.pulledSpaceObjects[i].blackHole = null;
		this.pulledSpaceObjects[i].toBlackHoleSpeedX = -9999;
		this.pulledSpaceObjects[i].toBlackHoleSpeedY = -9999;
	}
}

var SpaceObject = function(x,y,draw) {
	this.x = x;
	this.y = y;
	this.draw = draw;

	this.xspeed = Math.random() * 2 * speedMultiplier - speedMultiplier;
	this.yspeed = Math.random() * 2 * speedMultiplier - speedMultiplier;
	this.toBlackHoleSpeedX = -9999;
	this.toBlackHoleSpeedY = -9999;
	this.blackHole = null;
	this.update = objectUpdate;
}
//array of 10 objects
var spaceObjects = new Array();

// uniform update function for all 10 objects
function objectUpdate(){
	if (this.blackHole != null) {
		// check if it reaches the center
		if (Math.abs(this.x - this.blackHole.x - 25) < 5) {
			// now its at the center, this object will be eaten (at the end)
			currentScore -= 50;
			$('#score').html('Score: '+currentScore);
			this.blackHole.full--;
			if (this.blackHole.full <= 0) {
				// black hole is full, it will disappear and all the space object will resume to their regular route
				this.blackHole.dismiss();
			}

			// remove this object from the list
			spaceObjects.splice(spaceObjects.indexOf(this), 1);

			// if now the list is empty! Game Over!
			if (spaceObjects.length <= 0) {
				switchScene();
			}
		} else {
			this.x += this.toBlackHoleSpeedX;
			this.y += this.toBlackHoleSpeedY;
		}
	} else {
		// check if reach the wall
		if (this.x > 975 || this.x < 25) {
			this.xspeed = -this.xspeed;
		}
		if (this.y > 615 || this.y < 25) {
			this.yspeed = -this.yspeed;
		}

		// check if is pulled by any black hole
		for (var i=0; i<blackHoles.length; i++) {
			if (!(this.x-25 > blackHoles[i].x+75
				|| this.x+25 < blackHoles[i].x-25
				|| this.y-25 > blackHoles[i].y+75
				|| this.y+25 < blackHoles[i].y-25)) {
				// yes! moving toward the lovely black hole!
				this.toBlackHoleSpeedX = (blackHoles[i].x + 25 - this.x) / blackHoles[i].pullDuration;
				this.toBlackHoleSpeedY = (blackHoles[i].y + 25 - this.y) / blackHoles[i].pullDuration;
				// for update purpose
				this.blackHole = blackHoles[i];
				blackHoles[i].pulledSpaceObjects.push(this);
			}
		}

		if (this.toBlackHoleSpeedX > 0) {
			this.x += this.toBlackHoleSpeedX;
			this.y += this.toBlackHoleSpeedY;
		} else {
			this.x += this.xspeed;
			this.y += this.yspeed;
		}
	}

	this.draw(window.ctx);
}

$(document).ready(function() {
	/* use this variable currentState to control what scene to show
		0 -> start page
		1 -> level 1 game page
		2 -> level 1 finish page
		3 -> level 2 game page
		4 -> level 2 finish page
	*/
	currentState = 0;
	
	$(window).resize(function() {
		var rect = document.getElementById('view_port').getBoundingClientRect();
		$('#overlay').css('left', (rect.left-6.5)+"px");
		canvasTop = rect.top;
		canvasLeft = rect.left;
	});
});

window.onload = function() {
	console.log('onload');
	var canvas = document.getElementById('view_port');
	window.ctx = canvas.getContext("2d");
};

function switchScene() {
	// reset intervals
	clearInterval(blackHoleMethod);
	clearInterval(drawGameMethod);
	clearInterval(timerMethod);

	if (currentState == 4) { // finished game, restart
		console.log('game finished');
		
		$('#page_title').html('Solar Game');
		$('#page_button').html('START');
		// doing this manually to make sure level_score is showing and high_score is hiding
		$('#level_score').addClass('hide').removeClass('show');
		$('#high_score_holder').addClass('show').removeClass('hide');
		// reset the content of this holder
		$('#high_score_holder').html("<p>High Score:</p>");
		// insert top scores
		populateTopScores();
		
		currentState = 0;
	} else {
		console.log('change game/summary scene');
		// switch first, then update
		$('#transition_page').toggleClass('hide show');
		$('#game_page').toggleClass('hide show');
		currentState++;

		// reset values
		blackHoleMethod = null;
		drawGameMethod = null;
		blackHoles.length = 0;
		
		if (currentState == 2) {
			// switched to level 1 summary page
			// However, if now there's no more space objects, game over
			if (spaceObjects.length <= 0) {
				$('#page_button').html('FINISH');
				currentState = 4;

				// store the score
				storeTopScore();
			} else {
				$('#page_button').html('NEXT');
			}

			$('#page_title').html('Level# 1');
			// doing this manually to make sure level_score is showing and high_score is hiding
			$('#level_score').addClass('show').removeClass('hide').html('Score:<br>'+currentScore);
			$('#high_score_holder').addClass('hide').removeClass('show');
			
		} else if (currentState == 4) {
			// switched to level 2 summary page
			$('#page_title').html('Level# 2');
			$('#page_button').html('FINISH');
			// doing this manually to make sure level_score is showing and high_score is hiding
			$('#level_score').addClass('show').removeClass('hide').html('Score:<br>'+currentScore);
			$('#high_score_holder').addClass('hide').removeClass('show');

			//storing the score of this attempt
			storeTopScore();
			
		} else { // 1 or 3
			// switched to game page
			var level = (currentState+1)/2;
			$('#level').html('Level# '+level);
			$('#score').html('Score: '+currentScore);
			
			
			$('#view_port').click(onCanvasClicked);
			var canvasRect = document.getElementById('view_port').getBoundingClientRect();
			canvasTop = canvasRect.top;
			canvasLeft = canvasRect.left;
			
			// draw the game objects
			createSpaceObjects();
			timerMethod = setInterval(clock, 1000);
			blackHoleMethod = setInterval(createBlackHole, 2000/level);
			drawGameMethod = setInterval(drawGame, 33);
		}
	}
}

function populateTopScores() {
	if (typeof(Storage) !== "undefined") {
		// first check if it exist
		if (!localStorage.topScores) { 
			// does not exist, populate a 0 and add to high score
			var $zero = $('<p/>', {
				text: '0'
			});
			$zero.appendTo('#high_score_holder');
		} else {
			// exist! Fetch array first
			var list = JSON.parse(localStorage.getItem('topScores'));
			console.log(list);
			for (var i=0; i<list.length; i++) {
				var $score = $('<p/>', {
					text: ''+list[i]
				});
				$score.appendTo('#high_score_holder');
			}
		}
	}
}

function storeTopScore() {
	if (typeof(Storage) !== "undefined") {
		var topScoreList;
		// first check if it exist
		if (!localStorage.topScores) {
			// does not exist, need to create new
			topScoreList = new Array();
		} else {
			// exist, use JSON to parse to array
			topScoreList = JSON.parse(localStorage.getItem('topScores'));
		}
		topScoreList.push(currentScore);
		topScoreList.sort(function(a,b) {
			return b-a;
		});

		// check if it is more than 20
		if (topScoreList.length > 20) {
			topScoreList = topScoreList.slice(0,20);
		}

		// store it back to local storage
		localStorage.setItem('topScores', JSON.stringify(topScoreList));
	}
}

function pause() {
	if (paused) { // resume game
		$('#overlay').toggleClass('hide show');
		timerMethod = setInterval(clock, 1000);
		blackHoleMethod = setInterval(createBlackHole, 4000/(currentState+1));
		drawGameMethod = setInterval(drawGame, 33);
		
		$('#pause_button').html('Pause');
		paused = false;
	} else  { // pause game
		var rect = document.getElementById('view_port').getBoundingClientRect();
		$('#overlay').toggleClass('hide show').css('left', (rect.left-6.5)+"px");
		clearInterval(timerMethod);
		clearInterval(blackHoleMethod);
		clearInterval(drawGameMethod);
		
		$('#pause_button').html('Resume');
		paused = true;
	}
}

function clock() {
	timerCount--;
	if (timerCount == 0) {
		clearInterval(timerMethod);
		// reset timer
		timerCount = 60;
		$('#timer').html('60 seconds');
		
		switchScene();
	} else {
		$('#timer').html(timerCount+' seconds');
	}
}

function drawGame() {
	window.ctx.beginPath();
	window.ctx.clearRect(0,0,1000,640);

	// draw space objects
	for (var i=0; i<spaceObjects.length; i++) {
		spaceObjects[i].update();
	}
	
	// draw black holes, if any
	for (var j=0; j<blackHoles.length; j++) {
		blackHoles[j].draw();
	}
}

function createBlackHole() {
	var rand = Math.random();
	var img = new Image();
	var overlap = true;
	var x;
	var y;

	// check if x and y overlap with any existing black holes
	while (overlap) {
		overlap = false;
		x = Math.random()*950;
		y = Math.random()*590;

		// Not overlapping if the left edge is on the right of the right edge,
		// the right edge is on the left of the left edge,
		// the top edge is below the bottom edge,
		// and the bottom edge is above the top edge.
		for (var i=0; i<blackHoles.length; i++) {
			if (!(x-25 > blackHoles[i].x+75
				|| x+75 < blackHoles[i].x-25
				|| y-25 > blackHoles[i].y+75
				|| y+75 < blackHoles[i].y-25)) {
				overlap = true;
				console.log('overlap!!');
				break;
			}
		}
	}
	
	var newBlackHole;
	if (rand > 0.5) { // blue, most frequent
		img.src = path_blue_hole;
		newBlackHole = new BlackHole(0, x, y, img);
	} else if (rand > 0.15) { // purple, infrequent
		img.src = path_purple_hole;
		newBlackHole = new BlackHole(1, x, y, img);
	} else { // black, rare
		img.src = path_black_hole;
		newBlackHole = new BlackHole(2, x, y, img);
	}
	blackHoles.push(newBlackHole);
}

function createSpaceObjects() {
	// reset array
	spaceObjects = new Array();

	// moom
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 25, 0, 2*Math.PI, true);
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x+15, this.y, 20, 0, 2*Math.PI, true);
		ctx.strokeStyle = "#7BADFF";
		ctx.stroke();
		ctx.fillStyle = "#7BADFF";
		ctx.fill();
	}));
	// rocket
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.quadraticCurveTo(this.x+25, this.y, this.x, this.y-40);
		ctx.stroke();
		ctx.fillStyle = "blue";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.quadraticCurveTo(this.x-25, this.y, this.x, this.y-40);
		ctx.stroke;
		ctx.fillStyle = "blue";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x-12.5, this.y-3);
		ctx.lineTo(this.x+12.5, this.y-3);
		ctx.lineTo(this.x+25, this.y+5);
		ctx.lineTo(this.x-25, this.y+5);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(this.x-12.5, this.y+5);
		ctx.lineTo(this.x-6.25, this.y+10);
		ctx.lineTo(this.x, this.y+5);
		ctx.stroke();
		ctx.fillStyle = "grey";
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(this.x+12.5, this.y+5);
		ctx.lineTo(this.x+6.25, this.y+10);
		ctx.lineTo(this.x, this.y+5);
		ctx.stroke();
		ctx.fillStyle = "grey";
		ctx.fill();
	}));
	// UFO
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.bezierCurveTo(this.x, this.y-40, this.x+50, this.y-40, this.x+50, this.y);
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.fillStyle = "grey";
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x+50, this.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x+6.25, this.y+5, 5, 0, Math.PI *2, true);
		ctx.fillStyle = "purple";
		ctx.fill();
		ctx.arc(this.x+25, this.y+5, 5, 0, Math.PI*2, true);
		ctx.fillStyle = "purple";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x+43.75, this.y+5, 5, 0, Math.PI*2, true);
		ctx.fillStyle = "purple";
		ctx.fill();
	}));
	// astronaut
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x, this.y, 17.5, 0, Math.PI*2, true);
		ctx.fillStyle = "#ffe6e6";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x-20, this.y+17.5);
		ctx.lineTo(this.x+20, this.y+17.5);
		ctx.lineTo(this.x+20, this.y+27.5);
		ctx.lineTo(this.x-20, this.y+27.5);
		ctx.lineTo(this.x-20, this.y+17.5);
		ctx.stroke();
		ctx.fillStyle = "orange";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x-12.5, this.y+30, 2.5, 0, Math.PI*2, true);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x+12.5, this.y+30, 2.5, 0, Math.PI*2, true);
		ctx.fillStyle = "green";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x-10, this.y-7.5, 2.5, 0, Math.PI*2, true);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x+10, this.y-7.5, 2.5, 0, Math.PI*2, true);
		ctx.fillStyle = "black";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x+10, this.y+5);
		ctx.bezierCurveTo(this.x+10, this.y+12.5, this.x-10, this.y+12.5, this.x-10, this.y+5);
		ctx.fillStyle = "red";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x-22.5, this.y+22.5, 2.5, 0, Math.PI*2, true);
		ctx.fillStyle = "green";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x+22.5, this.y+22.5, 2.5, 0, Math.PI*2, true);
		ctx.fillStyle = "green";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x-21.25, this.y, 3.75, 0, Math.PI*2, true);
		ctx.fillStyle = "green";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x+21.25, this.y, 3.75, 0, Math.PI*2, true);
		ctx.fillStyle = "green";
		ctx.fill();
	}));
	// saturn
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 25, 0, Math.PI*2, true);
		ctx.fillStyle = "#996600";
		ctx.fill();

		ctx.beginPath();
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		ctx.moveTo(this.x-20, this.y+15);
		ctx.lineTo(this.x-25, this.y+25);
		ctx.lineTo(this.x-15, this.y+20);
		ctx.strokeStyle = "black";
		ctx.stroke();

		ctx.beginPath();
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		ctx.moveTo(this.x+15, this.y-20);
		ctx.lineTo(this.x+25, this.y-25);
		ctx.lineTo(this.x+20, this.y-15);
		ctx.strokeStyle = "black";
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.x-15, this.y+20);
		ctx.lineTo(this.x+20, this.y-15);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "black";
		ctx.stroke();
	}));
	// surveillance aircraft
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.moveTo(this.x-25, this.y-20);
		ctx.lineTo(this.x-20, this.y-25);
		ctx.lineTo(this.x+25, this.y+20);
		ctx.lineTo(this.x+20, this.y+25);	
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x-25, this.y+12.5);
		ctx.lineTo(this.x-12.5, this.y+25);
		ctx.lineTo(this.x+15, this.y-2.5);
		ctx.lineTo(this.x+2.5, this.y-15);
		ctx.fillStyle = "blue";
		ctx.fill();

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(this.x+15, this.y-2.5)
		ctx.bezierCurveTo(this.x+25, this.y-12.5, this.x+12.5, this.y-25, this.x+2.5, this.y-15);
		ctx.strokeStyle = "black";
		ctx.stroke();
	}));
	// unknown planet
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		var anothergrd = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 30);
		anothergrd.addColorStop(0,"red");
		anothergrd.addColorStop(1,"white");
		ctx.beginPath();
		ctx.arc(this.x, this.y, 25, 0, Math.PI*2, true);
		ctx.lineWidth = 3;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.fillStyle = anothergrd;
		ctx.fill();


		ctx.beginPath();
		ctx.lineJoin = "round";
		ctx.lineWidth = 3;
		ctx.moveTo(this.x-20, this.y+15);
		ctx.lineTo(this.x-25, this.y+25);
		ctx.lineTo(this.x-15, this.y+20);
		ctx.strokeStyle = "black";
		ctx.stroke();

		ctx.beginPath();
		ctx.lineJoin = "round";
		ctx.lineWidth = 3;
		ctx.moveTo(this.x+15, this.y-20);
		ctx.lineTo(this.x+25, this.y-25);
		ctx.lineTo(this.x+20, this.y-15);
		ctx.strokeStyle = "black";
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.x-15, this.y+20);
		ctx.lineTo(this.x+20, this.y-15);
		ctx.lineWidth = 3;
		ctx.strokeStyle = "black";
		ctx.stroke();
	}));
	// space garbage
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 25, 0, Math.PI*2, true);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.x-20, this.y-5);
		ctx.lineTo(this.x-20, this.y+5);
		ctx.lineTo(this.x+20, this.y+5);
		ctx.lineTo(this.x+20, this.y-5);
		ctx.fillStyle = "red";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x-5, this.y-20);
		ctx.lineTo(this.x+5, this.y-20);
		ctx.lineTo(this.x+5, this.y+20);
		ctx.lineTo(this.x-5, this.y+20);
		ctx.fillStyle = "red";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x, this.y, 6, 0, Math.PI*2, true);
		ctx.fillStyle = "black";
		ctx.fill();
	}));
	// a really colorful planet
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		var grd=ctx.createLinearGradient(this.x-25, this.y-25, this.x+25, this.y+25);
		grd.addColorStop(0,"black");
		grd.addColorStop("0.2","#cc3300");
		grd.addColorStop("0.4","#0033cc");
		grd.addColorStop("0.6","#009933");
		grd.addColorStop("0.8","#ff0066");
		grd.addColorStop(1,"#ccccff");

		ctx.beginPath();
		ctx.arc(this.x, this.y, 25, 0, Math.PI*2, true);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.fillStyle = grd;
		ctx.fill();
	}));
	// a star surrounded by four little stars 
	spaceObjects.push(new SpaceObject(Math.random() * 950 + 25, Math.random() * 590 + 25, function(ctx){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y-25);
		ctx.lineTo(this.x-10, this.y-10);
		ctx.lineTo(this.x-25, this.y);
		ctx.lineTo(this.x-10, this.y+10);
		ctx.lineTo(this.x, this.y+25);  //fifth point
		ctx.lineTo(this.x+10, this.y+10);
		ctx.lineTo(this.x+25, this.y);
		ctx.lineTo(this.x+10, this.y-10);
		ctx.lineTo(this.x, this.y-25);

		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x-17.5, this.y-25);
		ctx.lineTo(this.x-20, this.y-20);
		ctx.lineTo(this.x-25, this.y-17.5);
		ctx.lineTo(this.x-20, this.y-15);
		ctx.lineTo(this.x-17.5, this.y-10);
		ctx.lineTo(this.x-15, this.y-15);
		ctx.lineTo(this.x-10, this.y-17.5);
		ctx.lineTo(this.x-15, this.y-20);
		ctx.lineTo(this.x-17.5, this.y-25);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.beginPath();  //the second mini star
		ctx.moveTo(this.x+17.5, this.y-25);
		ctx.lineTo(this.x+20, this.y-20);
		ctx.lineTo(this.x+25, this.y-17.5);
		ctx.lineTo(this.x+20, this.y-15);
		ctx.lineTo(this.x+17.5, this.y-10);
		ctx.lineTo(this.x+15, this.y-15);
		ctx.lineTo(this.x+10, this.y-17.5);
		ctx.lineTo(this.x+15, this.y-20);
		ctx.lineTo(this.x+17.5, this.y-25);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.beginPath();  //the third mini star
		ctx.moveTo(this.x+17.5, this.y+25);
		ctx.lineTo(this.x+20, this.y+20);
		ctx.lineTo(this.x+25, this.y+17.5);
		ctx.lineTo(this.x+20, this.y+15);
		ctx.lineTo(this.x+17.5, this.y+10);
		ctx.lineTo(this.x+15, this.y+15);
		ctx.lineTo(this.x+10, this.y+17.5);
		ctx.lineTo(this.x+15, this.y+20);
		ctx.lineTo(this.x+17.5, this.y+25);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.beginPath();  //the forth mini star
		ctx.moveTo(this.x-17.5, this.y+25);
		ctx.lineTo(this.x-20, this.y+20);
		ctx.lineTo(this.x-25, this.y+17.5);
		ctx.lineTo(this.x-20, this.y+15);
		ctx.lineTo(this.x-17.5, this.y+10);
		ctx.lineTo(this.x-15, this.y+15);
		ctx.lineTo(this.x-10, this.y+17.5);
		ctx.lineTo(this.x-15, this.y+20);
		ctx.lineTo(this.x-17.5, this.y+25);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();
	}));
}

function onCanvasClicked(event) {
	console.log("canvas click");
	var xOnCanvas = event.pageX - canvasLeft;
	var yOnCanvas = event.pageY - canvasTop;
	
	// check if clicked on any black holes
	/*	Note:
		BlackHole object will be considered as clicked if it falls within
		25px of the coordinates of the click event.
		Since the coordinates of the BlackHole objects are their top left
		corner, and BlackHole objects has a width of 50px and a height of
		50px, all clicks within (x-25,y-25) and (x+75,y+75) will be considered
		as clicking on the object.
	 */
	for (var i=0; i<blackHoles.length; i++) {
		var bh = blackHoles[i];
		if (xOnCanvas > bh.x-25 && xOnCanvas < bh.x+75
			&& yOnCanvas > bh.y-25 && yOnCanvas < bh.y+75) {
				console.log('click on a bh!');
				currentScore += bh.point;
				// update current score on the screen
				$('#score').html('Score: '+currentScore);
				blackHoles[i].dismiss();
				break;
			}
	}
}