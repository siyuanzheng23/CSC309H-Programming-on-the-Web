//'require' the appropriate dependencies..
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./data');
//data.js is a JS file that treated as a module.. it retrieves the data from two json files and helps send appropriate data to the server..

//using express here, app from now on represents express.
var app = express();

//using all the .js in current directory and all the .js (as well as .css) files in /assets directory...
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));

app.use(bodyParser.json() );       
app.use(bodyParser.urlencoded({     
    extended: true
}));








//Routes
app.get('/',function(req,res){
	res.sendfile('a2.html');
})

app.get('/applicants',function(req,res){
	if(req.query.status === undefined && req.query.fname === undefined){
		data.findAllApplicants(req,res);
	}
	if(req.query.status !== undefined){
		data.byStatus(req,res);
	}
	if(req.query.fname !== undefined){
		data.byName(req,res);
	}
});

app.post('/applicants',function(req,res){
	data.addApplicant(req,res);
});

app.delete('/applicants',function(req,res){
	//client side ensures that only fname or stunum will be entered..
	//Use undefined to check req.query  instead of === ''...
	if(req.query.fname !== undefined){
		data.deleteApplicantByName(req,res);
	}else if(req.query.stunum !== undefined){
		data.deleteApplicantByNum(req,res);
	}
});

app.get('/courses',function(req,res){
	if(req.query.course === undefined){
		data.getAllCourses(req,res);
	}else if(req.query.course !== undefined){
		data.getOneCourse(req,res);
	}
})



  


//listen on localhost:3000
app.listen(3000);
console.log('Listening on port 3000');