var fs = require('fs');


//This 'module' should be 'required' by the server so that the function call of data.js can be used by the server..
var allTas;
var allCourses;
	

fs.readFile('tas.json','utf-8', function(err, data) {
	if(err) throw err;
	allTas = JSON.parse(data);
});

fs.readFile('courses.json','utf-8', function(err, data){
	if(err) throw err;
	allCourses = JSON.parse(data);
});


exports.findAllApplicants = function(req,res){
	var allpeople = allTas.tas;
	var object = {};
	object.tas = [];
	for(let i = 0; i < allpeople.length; i ++){
		var temp = {};
		temp.stunum = allpeople[i].stunum;
		temp.givenname = allpeople[i].givenname;
		temp.familyname = allpeople[i].familyname;
		temp.status = allpeople[i].status;
		temp.year = allpeople[i].year;
		object.tas.push(temp);
	}
	res.send(object);  //response satisfies the format of response.text
};


exports.byStatus = function(req,res){
	let status = req.query.status;
    var allpeople = allTas.tas;
	var object = {};
	object.tas = [];
	for(let i = 0; i < allpeople.length; i ++){
		if(allpeople[i].status == status){
			var temp = {};
			temp.stunum = allpeople[i].stunum;
			temp.givenname = allpeople[i].givenname;
			temp.familyname = allpeople[i].familyname;
			temp.status = allpeople[i].status;
			temp.year = allpeople[i].year;
			object.tas.push(temp);	
		}
	}
	res.send(object);  //response satisfies the format of response.text
};

exports.byName = function(req,res){
	let fname = req.query.fname;
	var allpeople = allTas.tas;
	var object = [];
	for(let i = 0; i < allpeople.length; i ++){
		if(allpeople[i].familyname == fname){
			var temp = {};
			temp.stunum = allpeople[i].stunum;
			temp.givenname = allpeople[i].givenname;
			temp.familyname = allpeople[i].familyname;
			temp.status = allpeople[i].status;
			temp.year = allpeople[i].year;
			temp.courses = allpeople[i].courses;
			object.push(temp);
		}
	}
	res.send(object);  //response satisfies the format of response.text
};

exports.addApplicant = function(req,res){
	//var temp1 = JSON.stringify(req.body);
	// console.log(temp1['stunum']);  but this will gives undefined,why?
	var newApplicant = req.body;
	var num = newApplicant['stunum'];
	if(searchDuplicate(num) == 0){
		allTas['tas'].push(newApplicant);
		res.send('Success');  //response satisfies the format of response.text
	}else if(searchDuplicate(num) == 1){
		res.send('Error: duplicate student number');  //response satisfies the format of response.text
	}
}

exports.deleteApplicantByNum = function(req,res){
	//on client side it already checked whether student number or family name enter correctly...
	var num = req.query.stunum; //num refers to student number...
	var length = allTas['tas'].length; 
	var index;
	var array = allTas['tas'];
	for(let i  = 0; i < length; i ++){
		if(array[i].stunum == num){
			index = i;
		}
	}
	if(index === undefined){
		res.send('Error: no such student');  //response satisfies the format of response.text
	}else if(index !== undefined){
		//do not use delete to modify JS array...
		//delete allTas['tas'][index];
		//.splice method has the format ( index, #ifItems, optional...)
		allTas['tas'].splice(index,1);
		res.send('Success');  //response satisfies the format of response.text
	}
}

exports.deleteApplicantByName = function(req,res){
	var name = req.query.fname;
	var length = allTas['tas'].length;
	var index;
	var array = allTas['tas'];
	for(let i = 0; i < length; i ++){
		if(array[i].familyname == name){
			index = i;
		}
	}
	if(index === undefined){
		res.send('Error: no such student');  //response satisfies the format of response.text
	}else if(index !== undefined){
		//do not use delete to modify JS array..
		//delete allTas['tas'][index];
		allTas['tas'].splice(index,1);
		res.send('Success');  //response satisfies the format of response.text
	}
}


//handle request and send appropriate response all courses..
exports.getAllCourses = function(req,res){
	var courses = []; // An array that would be eventually sent as response to client ..
	var cArray = allCourses.courses;
	var completetas = allTas.tas;
	for(let i = 0; i < cArray.length; i ++){  //looping over every course of allCourse....
		var cur = cArray[i]; //The course code...
		var temp = {};  //create an object for every course ...
		temp.code = cur;  //create code attribute for object..
		temp.tas =[]; //create an empty array for attribute tas..
		for(let j = 0; j < completetas.length; j++){ //Searching every applicant ...
			var flag = 0; //The flag to indicate whether this TA has applied for the given course..
			var curr = completetas[j];
			var taCourse = curr.courses;
			var courseIndex;
			for(let k = 0; k < taCourse.length; k++){  //Searchign every course information of one applicant..
				var current = taCourse[k];
				if(current.code == cur){
					flag = 1;
					courseIndex = k;
				}
			}
			if(flag == 1){
				var newObject = {};
				newObject.stunum = curr.stunum;
				newObject.givenname = curr.givenname;
				newObject.familyname = curr.familyname;
				newObject.status = curr.status;
				newObject.year = curr.year;
				newObject.ranking = curr.courses[courseIndex].rank;
				newObject.experience = curr.courses[courseIndex].experience;
				temp.tas.push(newObject);  
			}
		}	
		courses.push(temp); //It works...
	}
	res.send(courses); //response satisfies the format of response.text
};


//handle request and send proper response of one course...
exports.getOneCourse = function(req,res){
	let ccode = req.query.course;
	if(searchValidCourse(ccode)){ //The course name is correct..
		var cobject = {};
		cobject.code = ccode;
		cobject.tas = [];
		var completetas = allTas.tas;
		for(let j = 0; j < completetas.length; j++){ //Searching every applicant ...
			var flag = 0; //The flag to indicate whether this TA has applied for the given course..
			var curr = completetas[j];
			var taCourse = curr.courses;
			var courseIndex;
			for(let k = 0; k < taCourse.length; k++){  //Searchign every course information of one applicant..
				let current = taCourse[k];
				if(current.code == ccode){
					flag = 1;
					courseIndex = k;
				}
			}
			if(flag == 1){
				var newObject = {};
				newObject.stunum = curr.stunum;
				newObject.givenname = curr.givenname;
				newObject.familyname = curr.familyname;
				newObject.status = curr.status;
				newObject.year = curr.year;
				newObject.ranking = curr.courses[courseIndex].rank;
				newObject.experience = curr.courses[courseIndex].experience;
				cobject.tas.push(newObject);  
			}
		}
		res.send(cobject);	//response satisfies the format of response.text
	}else{
		alert('There is no such course');
	}
};



function searchDuplicate(studentNumber){
	var boolen = 0;
	var tas = allTas['tas'];
	for(let i = 0; i < tas.length; i ++){
		if(tas[i]['stunum'] == studentNumber){
			boolen = 1;
			return boolen;
		}
	}
	return boolen;
};


function searchValidCourse(code){
	for(let i = 0; i < allCourses.courses.length; i ++){
		if(allCourses.courses[i] == code){
			return true;
		}
	}
	return false;
};










