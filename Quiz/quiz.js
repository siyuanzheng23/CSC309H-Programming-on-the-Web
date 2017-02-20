'use strict'

//Note for myself: Do not mix jQuery with JavaScript 
//Note for myself: Always use "$(document).ready(function)()" ...
//Notes for myself: be careful to distinguish between .appendChild()   and .insertAfter()...
/*Notes for myself:  $().one('click',function(event){}) can build the 'one-time' event , 
instead of using $().click(function(event){})  which is kinda equivalent to
$(document).on('event', 'selector', function(){});  */
//question for myself: what does function(event) 's event do?...
//Note for myself: $() == jQuery()... and the 'later part' can be applied jQuery method...

var totalMark = 0; //The global variable that is tracking the current mark...

//The helper function that helps 'dynamically' update the mark...
function markUpdate(){  //Update the total mark....
	$('#score').html(totalMark);
}
 
$('#Q1').click(function(){     //Q1(the one fixed to right) onclick handler..
	$('html, body').animate({scrollTop:$('#q1').offset().top},'slow');
});

$('#Q2').click(function(){   //Q2(the one fixed to right) onclick handler
	$('html, body').animate({scrollTop:$('#q2').offset().top},'slow');
});

$('#Q3').click(function(){  //Q3(the one fixed to right) onclick handler..
	$('html, body').animate({scrollTop:$('#q3').offset().top},'slow');
});

$('#Q4').click(function(){  //Q4(the one fixed to right) onclick handler..
	$('html, body').animate({scrollTop:$('#q4').offset().top},'slow');
});

$('#reset').click(function(){ //'Start Over' button onclick handler..
	$('html, body').animate({scrollTop:$('#pageTitle').offset().top},'fast');
	setTimeout(function(){location.reload()},400);
})

function Mark(mark,question){ //Helper function for generating sub-mark message... 
	var temp = $('<h2>',{html:'Congrats! You Got '+ mark +' Mark for Q'+ question +' !','class':'markMessage'});
	return temp;
};

function zeroMark(question){ //Helper function for generating 0 mark  message...
	var temp = $('<h2>',{html:'Sorry ! Your Mark for Q' + question+' is 0 TAT','class':'markMessage'});
	return temp;
}

//-------------------------------Question 1 Begins---------------------------------------------------------------
//Note for Myself: When clicking the option of question 1, make the explanation 'appear' ....
//Not for Myself: The correct answer is b  (more event handlers)...

//These variables are to record the times of display to avoid multiple displays of explanations...
var q1ExpA = 0;
var q1ExpB = 0;
var q1ExpC = 0;
var q1ExpD = 0; 

var q1Attempt = 0;//The times of 'attempt' of question 1...

function fullExplanationButton(){  //dynamically create the 'To See Explanation' button as well as its onclick handler..
	var temp = $('<h3>',{html:'To See The Full Explanation','id':'q1button'});
	temp.insertAfter($('#q1linebreak'));
	$('#q1button').css('font-weight','bold');
	$('#q1button').css('color','black');
	$('#q1button').css('font-size','150%');
	$('#q1button').css('background-color','lightgreen');
	$('#q1button').css('text-align','center');
	$('#q1button').css('width','30%');

	$('#q1button').one('click',function(event){
		if(q1ExpA == 0){
			displayA();
			q1ExpA += 1;
		};
		if(q1ExpB == 0){
			displayB();
			q1ExpB += 1;
		};
		if(q1ExpC == 0){
			displayC();
			q1ExpC += 1;
		};
		if(q1ExpD == 0){
			displayD();
			q1ExpD += 1;
		};
	});
};


function displayA(){    //helper function for displaying the explanation of option a...
	var temp = $('<h3>', {html:'Incorrect: The HAL 9000 is a fictional computer from Arthur C. Clarke\'s 2001: A Space Odyssey.' 
		, 'class':'explanation','id':'q1aExplanation','class':'explanation'});
	temp.insertAfter($('#q1a'));
};

function displayB(){ //helper function for displying the explanation of option b
	var temp = $('<h3>', {html:'Correct: The machine arrived in Canada on April 30, 1952.  Named FERUT\
		(FERranti U of T), it was used to compute changes in water levels due to the opening of the St.\
		Lawrence Seaway.','id':'q1bExplanation','class':'explanation'});
	temp.insertAfter($('#q1b'));
};

function displayC(){  //helper function for diaplying the explanation of option c 
	var temp = $('<h3>',{html:'Incorrect:  The UNIVAC was the first commericial computer produced in \
		the United States, and was designed by J. Presper Eckert and John Mauchly.  The United States Census \
		Department received delivery of the first UNIVAC in May 1952.','id':'q1cExplanation','class':'explanation'});
	temp.insertAfter($('#q1c'));
};

function displayD(){ //helper function for displaying the explanation of option d
	var temp = $('<h3>',{html:'Incorrect:  The UNIVAC was the first commericial computer produced\
	 in the United States, and was designed by J. Presper Eckert and John Mauchly.  The United \
	 States Census Department received delivery of the first UNIVAC in May 1952.','id':'q1dExplanation','class':'explanation'});
	temp.insertAfter($('#q1d'));
}

//onclick handlers for the option a of question 1...
$('#q1a').one('click',function(event){
	if(q1ExpA == 0){
		displayA();
		q1ExpA += 1;
	};
	q1Attempt += 1;
	if(q1Attempt == 1){
		fullExplanationButton();
		zeroMark(1).insertAfter($('#q1linebreak'));
		setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
		$('#Q1').css('color','white');
		$(this).css('background-color','LightSkyBlue');
	};
});

//onclick handlers for the option b of question 1... and this is the correct option..
$('#q1b').one('click',function(event){
	if(q1ExpB == 0){
		displayB();
		q1ExpB += 1;
	};
	if(q1Attempt == 0){
		totalMark += 1;
	    Mark(1,1).insertAfter($('#q1linebreak'));
	    markUpdate();
	};
	q1Attempt += 1;
	if(q1Attempt == 1){
		fullExplanationButton();
		setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
		$('#Q1').css('color','white');
		$(this).css('background-color','LightSkyBlue');
	};	
});

//onclick handlers for the option c of question 1...
$('#q1c').one('click',function(event){
	if(q1ExpC == 0){
		displayC();
		q1ExpC += 1;
	};	
	q1Attempt += 1;
	if(q1Attempt == 1){
		fullExplanationButton();
		zeroMark(1).insertAfter($('#q1linebreak'));
		setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
		$('#Q1').css('color','white');
		$(this).css('background-color','LightSkyBlue');
	}
});

//onclick handlers for the option d of question 1...
$('#q1d').one('click',function(event){
	if(q1ExpD == 0){
		displayD();
		q1ExpD += 1;
	};
	q1Attempt += 1;
	if(q1Attempt == 1){
		fullExplanationButton();
		zeroMark(1).insertAfter($('#q1linebreak'));
		setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
		$('#Q1').css('color','white');
		$(this).css('background-color','LightSkyBlue');
	}
});
//-------------------------------Question 1 Ends-----------------------------------------------------------------

/* Note for myself:The toggle() method was deprecated in jQuery version 1.8, and removed in 
version 1.9. We have used an earlier version of jQuery (1.8 in the script tag), 
for this example to work.*/

//-------------------------------Question 2 Begins---------------------------------------------------------------
var q2Attempt = 0;//The times of attampt of question 2...

//These flags are to indicate which options of q2 does the player have selected...
var q2loop = 0;
var q2inline = 0;
var q2keyboard = 0;
var q2interpreter = 0;
var q2function = 0;
var q2block = 0;
var q2character = 0;
var q2variable = 0;

//Here is a helper function that sets the eight variables' corresponding flags to zero...
function setZero(){
	q2loop = 0;
	q2inline = 0;
	q2keyboard = 0;
	q2interpreter = 0;
	q2function = 0;
	q2block = 0;
	q2character = 0;
	q2variable = 0;
};
//on-click helper function for color change of all the options of question 2...
$('.q2option').click(function(){
	$(this).css('background-color','LightSkyBlue');
});
//on-click handler for reset button of question 2...
$('#q2Reset').click(function(){
	$('.q2option').css('background-color','transparent');
	setZero();
	eraseAllResponse();
});

//JS code for eight variables... change their respective flags while being clicked... 
$('#loop').click(function(){
	if(q2loop == 0){
		q2loop = 1;
	};
});
$('#inline').click(function(){
	if(q2inline == 0){
		q2inline =1;
	};
});
$('#keyboard').click(function(){
	if(q2keyboard == 0){
		q2keyboard =1;
	};
});
$('#interpreter').click(function(){
	if(q2interpreter == 0){
		q2interpreter =1;
	};
});
$('#function').click(function(){
	if(q2function == 0){
		q2function = 1;
	};
});
$('#block').click(function(){
	if(q2block == 0){
		q2block =1;
	};
});
$('#character').click(function(){
	if(q2character == 0){
		q2character =1;
	};
});
$('#variable').click(function(){
	if(q2variable == 0){
		q2variable = 1;
	};
});

//on-click handler for the submit button of question 2 ...
$('#q2Submit').click(function(){
	q2Attempt += 1;
	var selectionNumber = q2loop + q2inline + q2keyboard + q2interpreter + 
	q2function + q2block + q2character + q2variable;
	eraseAllResponse();
	if(selectionNumber == 2){ //The player selects two answers...
		if((q2function == 1) && (q2variable) == 1){ //Both correct..
			q2Correct();
			if(q2Attempt == 1){
				totalMark += 2;
				markUpdate();
				Mark(2,2).insertAfter($('#q2linebreak'));
				setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
				$('#Q2').css('color','white');
			}
		}else if((q2function == 1) || (q2variable ==1)){ // Only one is correct...
			q2OneWordCorrect();
			if(q2Attempt == 1){
				zeroMark(2).insertAfter($('#q2linebreak'));
				setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
				$('#Q2').css('color','white');
			}
		}else if((q2function == 0) && (q2variable == 0)){ //Neither correct...
			q2neitherCorrect();
			if(q2Attempt == 1){
				zeroMark(2).insertAfter($('#q2linebreak'));
				setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
				$('#Q2').css('color','white');
			}
		}
	}else if(selectionNumber == 1){ //Too few answers selected... 
		q2onlyOneSelected();
		if(q2Attempt == 1){
			q2Attempt = 0; //Chances given until selected two answers...
		};
	}else if(selectionNumber > 2){//Too many answers selected...
		q2tooMany();
		if(q2Attempt == 1){
			q2Attempt = 0; //Chances given until selected two answers...
		};
	};
	//Apply css method to make response more prominent..
	$('.q2response').css('font-size','150%');
});

//Here are the helper functions when submit button of q2 is clicked, the response generated(including deleting previous ones)...
function eraseAllResponse(){
	$('.q2response').remove();
};

//Helper function for two answers selected and both correct..
function q2Correct(){ 
	var temp = $('<h3>', {html:' Yes!  It is hard to believe that words we take\
		for granted in computing were once so new.','class':'q2response','id':'q2correct'});
	temp.insertAfter($('#q2Submit'));
};

//Helper function for two answers selected but only one correct..
function q2OneWordCorrect(){  
	var temp; 
	var correctOne;
	if(q2function == 1){
		correctOne = 'function';
		if(q2loop == 1){
			temp = 'loop';
		}else if(q2inline == 1){
			temp = 'inline';
		}else if(q2keyboard == 1){
			temp = 'keyboard';
		}else if(q2interpreter == 1){
			temp = 'interpreter';
		}else if(q2block == 1){
			temp = 'block';
		}else if(q2character == 1){
			temp = 'character';
		}
	}else if(q2variable == 1){
		correctOne = 'variable';
		if(q2loop == 1){
			temp = 'loop';
		}else if(q2inline == 1){
			temp = 'inline';
		}else if(q2keyboard == 1){
			temp = 'keyboard';
		}else if(q2interpreter == 1){
			temp = 'interpreter';
		}else if(q2block == 1){
			temp = 'block';
		}else if(q2character == 1){
			temp = 'character';
		}
	}
	var temp = $('<h3>',{html:'Incorrect: You picked ' + correctOne + ' correctly, but ' + temp + ' is one\
	 of the words that Professors Gotlieb and Hume got credit for.', 'class':'q2response','id':'q2onewordcorrect'});
	temp.insertAfter($('#q2Submit'));
};

function q2neitherCorrect(){  //Helper function for two answers selected..
	var temp = $('<h3>',{html:'Incorrect: Both words you chose are words that Professors Gotlieb \
		and Hume were quoted for in the OED.','class':'q2response','id':'q2neithercorrect'});
	temp.insertAfter($('#q2Submit'));
};

function q2tooMany(){ //Helper function for more than two answers selected...
	var temp = $('<h3>',{html:'Only two words can be selected. Please try \
		again.','class':'q2response','id':'q2toomany'});
	temp.insertAfter($('#q2Submit'));
};

function q2onlyOneSelected(){ //Helper function for only one answer selected...
	var temp = $('<h3>',{html:'Your answer is incomplete.  Please select another \
		word.','class':'q2response','id':'q2onlyoneselected'});
	temp.insertAfter($('#q2Submit'));
};
//-------------------------------Question 2 Ends---------------------------------------------------------------

//-------------------------------Question 3 Begins---------------------------------------------------------------
//Define an array of 10 objects of the left column....For the purpose of random display order...
var peopleNames = [];
peopleNames[0] = $('<h3>',{html:'Daniel Wigdor','id':'DanielWigdor','class':'q3left'});
peopleNames[1] = $('<h3>',{html:'Stephen Cook','id':'StephenCook','class':'q3left'});
peopleNames[2] = $('<h3>',{html:'Geoff Hinton','id':'GeoffHinton','class':'q3left'});
peopleNames[3] = $('<h3>',{html:'Karan Singh','id':'KaranSingh','class':'q3left'});
peopleNames[4] = $('<h3>',{html:'Diane Horton','id':'DianeHorton','class':'q3left'});
peopleNames[5] = $('<h3>',{html:'Raquel Urtasun','id':'RaquelUrtasun','class':'q3left'});
peopleNames[6] = $('<h3>',{html:'David Levin','id':'DavidLevin','class':'q3left'});
peopleNames[7] = $('<h3>',{html:'Mike Brudno','id':'MikeBrudno','class':'q3left'});


//An array of 10 person's descriptions...
var peopleDescriptions = [];
peopleDescriptions[0] = $('<h3>',{html:'Taught a first-year course while an undergraduate student in our department',
'class':'q3right','id':'Daniel Wigdor'});
peopleDescriptions[1] = $('<h3>',{html:'Turing Award winner for work in computational complexity',
'class':'q3right','id':'Stephen Cook'});
peopleDescriptions[2] = $('<h3>',{html:'Pioneer in machine learning, now Distinguished Researcher at Google',
'class':'q3right','id':'Geoff Hinton'});
peopleDescriptions[3] = $('<h3>',{html:'Academy Award for Ryan (software research and development director)',
'class':'q3right','id':'Karan Singh'});
peopleDescriptions[4] = $('<h3>',{html:'Winner of both the President\'s Teaching Award and OCUFA teaching award',
'class':'q3right','id':'Diane Horton'});
peopleDescriptions[5] = $('<h3>',{html:'Canada Research Chair in Machine Learning and Computer Vision, researching self-driving cars',
'class':'q3right','id':'Raquel Urtasun'});
peopleDescriptions[6] = $('<h3>',{html:'Associate Research Scientist at Disney Research before joining the faculty',
'class':'q3right','id':'David Levin'});
peopleDescriptions[7] = $('<h3>',{html:'Scientific Director of the Centre for Computational Medicine at Sick Kids Hospital',
'class':'q3right','id':'Mike Brudno'});

//Creating two div which contain lists respectively, and make the order random..
//The left column one..
var random;
var q3Attempt = 0;

//function for randomly displaying the left column
function appendNames(){
	var a = 0;
	random = Math.floor(Math.random()*8);
	if(peopleNames[random] != 'appended'){
		$('#leftcolumn').append(peopleNames[random]);
		peopleNames[random] = 'appended';
		a += 1
	};
	if(a < 8){
		setTimeout(appendNames,30);
	}
}

appendNames();

//function for randomly displaying the right column
function appendDetails(){
	var b = 0;
	random = Math.floor(Math.random()*8);
	if(peopleDescriptions[random] != 'appended'){
		$('#rightcolumn').append(peopleDescriptions[random]);
		peopleDescriptions[random] = 'appended';
		b += 1
	};
	if(b < 8){
		setTimeout(appendDetails,30);
	}
}

appendDetails();

var displayTimes = 0;//to record whether the answers have already been displayed
var leftSelected = []; //array to record the order of left column that user clicks..
var rightSelected = []; //array to record the order of right column that user clicks..
var clickTimes = 0; //record the times of clicking... maximum is 15th...
var flag = 0;    //0 stands for that the user should click the left column and 1 stands for that the user should click the right column..

//Note for Myself: push(element) append the element at the end of the array...

//handle the left and right columns' on-click events..
//AliceBlue, AntiqueWhite, Beige, CadetBlue, Coral,PaleGreen , IndianRed, LightSkyBlue are eight colors in order..
setTimeout(function(){
	var left = $('.q3left');
	var right = $('.q3right');
	var l = left.length;
	for(var i = 0; i < l; i ++){
		left[i].onclick = function(){
			if(flag == 0 && clickTimes < 18){
				if(leftSelected.indexOf(this) == -1){ //append left column object. NOT INNER HTML...
					leftSelected.push(this);
					if(clickTimes == 0){
						$(this).css('background-color','AliceBlue');
					}else if(clickTimes == 2){
						$(this).css('background-color','AntiqueWhite');
					}else if(clickTimes == 4){
						$(this).css('background-color','Beige');
					}else if(clickTimes == 6){
						$(this).css('background-color','CadetBlue');
					}else if(clickTimes == 8){
						$(this).css('background-color','Coral');
					}else if(clickTimes == 10){
						$(this).css('background-color','PaleGreen');
					}else if(clickTimes == 12){
						$(this).css('background-color','IndianRed');
					}else if(clickTimes == 14){
						$(this).css('background-color','LightSkyBlue');
					}
					flag = 1;
					clickTimes += 1;
				}
			}
		}

	}
	for(var j = 0; j < l; j ++){
		right[j].onclick = function(){
			if(flag == 1 && clickTimes < 18){
				if(rightSelected.indexOf(this.id) == -1){ //append the id of the right column.. i.e. correct answer..
					rightSelected.push(this.id);
					if(clickTimes == 1){
						$(this).css('background-color','AliceBlue');
					}else if(clickTimes == 3){
						$(this).css('background-color','AntiqueWhite');
					}else if(clickTimes == 5){
						$(this).css('background-color','Beige');
					}else if(clickTimes == 7){
						$(this).css('background-color','CadetBlue');
					}else if(clickTimes == 9){
						$(this).css('background-color','Coral');
					}else if(clickTimes == 11){
						$(this).css('background-color','PaleGreen');
					}else if(clickTimes == 13){
						$(this).css('background-color','IndianRed');
					}else if(clickTimes == 15){
						$(this).css('background-color','LightSkyBlue');
					}
					clickTimes += 1;
					this.innerHTML += '<span class = \'q3displayanswer\'><br/>(You match this description to : ' 
					                          + leftSelected[leftSelected.length -1 ].innerHTML + '  )</span>' ;
					flag = 0;
				}
			}
		}

	}
},5000);

//onclick function for re-select button for question 3 ...
$('#q3Reset').click(function(){
	clickTimes = 0;
	leftSelected = [];
	rightSelected = [];
	clickTimes = 0;
	$('.q3right').css('background-color','transparent');
	$('.q3left').css('background-color','transparent');
	$('.q3displayanswer').remove();
	displayTimes = 0;
});

//onclick function for sumbit button for question 3...
$('#q3Submit').click(function(){
	var mark = 0;
	q3Attempt += 1;
	if(leftSelected.length != 0){
		for(var i = 0; i < 8; i ++){
			if(leftSelected[i].innerHTML == rightSelected[i]){
				mark += 0.5;
			}	
		}	
	}
	if(q3Attempt == 1){
		totalMark += mark;
		if(mark != 0){
			var temp = Mark(mark,3);
			temp.insertAfter($('#q3response'));
		}else{
			var temp = zeroMark(3);
			temp.insertAfter($('#q3response'));
		}
		markUpdate();
		setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
		$('#Q3').css('color','white');
	}
	//display the corresponding answer after each item of right column...
	if(displayTimes == 0){
		var detailsQuery = $('.q3right');
		for(var j = 0; j < 8 ; j++){
			var temp = detailsQuery[j].id;
			var x = $('<h4>',{html:'Correct answer is: ' + temp,'class':'q3displayanswer'});
			x.insertAfter(detailsQuery[j]);
		}
		$('.q3displayanswer').css('color','black');
		displayTimes = 1;
	}
});
//-------------------------------Question 3 Ends---------------------------------------------------------------

//-------------------------------Question 4 Begins---------------------------------------------------------------
var q4query = $('.q4option');  //The array of eight options...
var times = 0;  //The variable to indicate the times of click non-repeated options.. 
var hasBeenClicked = []; //the array of items that have already been clicked..
var q4Attempt = 0;  //the variable that tracks the times of attempt..
var q4yearDisplay = 0; //the flag to indicate whether years have already been displayed..

//There are two possible correct answers, since there are two overlapped options..
var q4ExpectedAns1 = ['g','a','f','e','d','c','h','b'];  //one of the correct answer..
var q4ExpectedAns2 = ['g','f','a','e','d','c','h','b']; //the other one..
var q4PlayerAns = [];   //Used for record the player's selection ...

//eight variables which equal to the innerHTML of the eight options..
var a = 'The First Computer Network';
var b = 'First Microprocessor: Intel';
var c = 'First Popular High-Level Language: FORTRAN – (John Backus)';
var d = 'First Open Source Software: A-2 System';
var e = 'First Compiler for Electronic Computer: A-0 System – (Grace Hopper)';
var f = 'The First Computer Network';
var g = 'First Computer Program – (Ada Lovelace)';
var h = 'First Object Oriented Programming Language: Simula – (Ole-Johan Dahl and Kristen Nygaard)';

//On-click handler for the eight options of question 4..
for(var i = 0; i < 8; i++){
	q4query[i].onclick = function(){
		if(times < 7){
			if(hasBeenClicked.indexOf(this.id) == -1){
				$('#q4insert').append(this.innerHTML + "<span id = \'then\'>      ----->     </span>" + "<br/>");
				hasBeenClicked.push(this.id);
				times += 1;
				q4PlayerAns.push(this.id.charAt(4));
				$(this).css('background-color','LightSkyBlue');
				//To display in what order does the user select his/her option ...
				if(times == 1){
					this.innerHTML += '  (1st)';
				}else if(times == 2){
					this.innerHTML += '  (2nd)';
				}else if(times == 3){
					this.innerHTML += '  (3rd)';
				}else if(times == 4){
					this.innerHTML += '  (4th)';
				}else if(times == 5){
					this.innerHTML += '  (5th)';
				}else if(times == 6){
					this.innerHTML += '  (6th)';
				}else if(times == 7){
					this.innerHTML += '  (7th)';
				}
			}
		}else if(times == 7){
			if(hasBeenClicked.indexOf(this.id) == -1){
				$('#q4insert').append(this.innerHTML);
				hasBeenClicked.push(this.id);
				times += 1;
				q4PlayerAns.push(this.id.charAt(4));
				$(this).css('background-color','LightSkyBlue');
				this.innerHTML += '  (Last)';
			}
		}
	}
};

//onclick handler for try again button of question 4...
$('#q4Reset').click(function(){
	times = 0;
	q4yearDisplay = 0;
	hasBeenClicked = [];
	q4PlayerAns = [];
    $('#q4insert').html('');
    $('.q4option').css('background-color','transparent');
    //restore the eight options's html... i.e.  delete the '1st', '2nd'....'Last' substring at the end of eight options..
    document.getElementById('1940a').innerHTML = a;
    document.getElementById('1971b').innerHTML = b;
    document.getElementById('1957c').innerHTML = c;
    document.getElementById('1953d').innerHTML = d;
    document.getElementById('1951e').innerHTML = e;
    document.getElementById('1940f').innerHTML = f;
    document.getElementById('1841g').innerHTML = g;
    document.getElementById('1967h').innerHTML = h;
})

//onclick handler for the submit button of question 4..
$('#q4Submit').click(function(){
	q4Attempt += 1;
	if(q4Attempt == 1){
		if(compareTwoArray(q4ExpectedAns1,q4PlayerAns) == 1){  //Correct answer matched..
			totalMark += 1;
			markUpdate();
			var a = Mark(1,4);
			a.insertAfter($('#q4Reset'));
		}else if(compareTwoArray(q4ExpectedAns2,q4PlayerAns) == 1){ //Correct answer matched...
			totalMark += 1;
			markUpdate();
			var a = Mark(1,4);
			a.insertAfter($('#q4Reset'));
		}else{ //Correct answer not matched..
			var a = zeroMark(4);
			a.insertAfter($('#q4Reset'));
		}
		setTimeout(function(){alertUser();},1000);  //alert the user about their total mark only if all other three questions have been completed..
		$('#Q4').css('color','white');
	}
	if(q4yearDisplay == 0){
		for(var k = 0 ; k < 8; k++){ //Display the year number of each option at the end of original option
			var text = q4query[k].id.substring(0,4);
			q4query[k].innerHTML += ' ( Correct Year Number: ' + text + ' ) ';
			q4yearDisplay = 1;
		}
	};
})

//helper function for comparing whether array a and array b are identical...
function compareTwoArray(a,b){ 
	var temp = 1;
	for(i = 0; i < 8; i++){
		if(a[i] != b[i]){
			temp = 0;
		}
	}
	return temp;
}

//-------------------------------Question 4 Ends---------------------------------------------------------------
function alertUser(){   //Helper function for alert ... 
	if(q1Attempt >= 1){
		if(q2Attempt >= 1){
			if(q3Attempt >= 1){
				if(q4Attempt >= 1){
					alert('Your Total Score For This Game Is ' + totalMark + '!');
				}
			}
		}
	}
};

//Footer's email address's onclick handler...
$('#email').click(function(){
	window.location.href = "mailto:raymondzsy@outlook.com" ;
});


