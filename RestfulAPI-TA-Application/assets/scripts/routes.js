$(document).ready(function(){
	//client side .js file.  
	var coursesArray;

	//Display the courses offering ta position on html
	$.getJSON('courses.json',function(data){
		var inserted = ''; 
		coursesArray = data['courses']; //coursesArray is a array of all the courses now..
		for(let i = 0; i < coursesArray.length; i ++){
			if(i != coursesArray.length - 1){
				inserted += coursesArray[i].substr(3,5) + ',   '
			}else{
				inserted += coursesArray[i].substr(3,5) + ')';
			}
		}
		$('#appliable').text($('#appliable').text() + inserted);
	});



    //onclick handler for the get all applicants..
	$('#getAllApp').click(function(){
		$.get('/applicants',function(response){
			$('#display').empty();//everytime the user click and trigger the http request, to avoid multiple renders..
			let allApps = response;
			let tas =  allApps['tas'];
			let length = tas.length;
			let table = '<table>';
			table += '<tr>'
			table += '<th>' + 'Given Name' + '</th>';
			table += '<th>' + 'Family Name' + '</th>';
			table += '<th>' + 'Status' + '</th>';
			table += '<th>' + 'Year' +'</th>';
			table += '</tr>'
			var familyNames = []; //The array to record the family names of the tas, in order to be sorted..
			//The first for loop is looping over the tas array to get all the family names of the tas..
			for(let i = 0; i < length; i++){
				let ta = tas[i];
				familyNames.push(ta['familyname']);
			}
			familyNames.sort();
			var appended = []; //to avoid the duplicate appended....
			//The second for loop is constructing the table element with the ascending order of ta's family names...
			//Here length should also equal to the familyNames.length()....
			for(let i = 0; i < length; i ++){
				for(let j = 0; j < length; j ++){
					if(tas[j]['familyname'] == familyNames[i]){
						let ta = tas[j];
						if(appended.indexOf(ta['familyname'] + ta['givenname']) == -1){
							appended.push(ta['familyname'] + ta['givenname']);
							table += '<tr>'
							table += '<td>' + ta['givenname'] + '</td>';
							table += '<td>' + ta['familyname'] + '</td>';
							table += '<td>' + ta['status'] + '</td>';
							table += '<td>' + ta['year'] + '</td>';
							table += '</tr>';
						}
						
					}
				}			
			}
			table += '</table>'
			$(table).appendTo($('#display'));
		})
	})




	//onclick handler for retriving applicants by status
	$('#postStatus').click(function(){
		var status = $('#selectStatus').val();
		$.get('/applicants?status=' + status, function(response){
			$('#display').empty();
     		createTable(response.tas);
		})
	});









	//onclick handler for retrieving applicant(s) by family name
	$('#postFamilyName').click(function(){
		var fname = $('#familyName').val();
		$.get('/applicants?fname=' + fname, function(response){
			$('#display').empty();
			var length = response.length;
			let temp = '';
			for(let i = 0; i < length ; i++){
				let current = response[i];
				temp += '<h1 class=\'smallTitle\'>';
				temp += 'Student Name: ' + current['givenname'] + '      ' + current['familyname'] + '<br>';
				temp += 'Student Number: ' + current['stunum'] + '</h1>' + '<br>'
			    temp += '<table>' + '<tr>';
				temp += '<th>' + 'Course(s) Applying To' + '</th>';
				temp += '<th>' + 'Ranking' + '</th>';
				temp += '<th>' + 'Experience Level' + '</th>' + '</tr>';
				let course = current['courses'];
				let courseNum = course.length;
				for(let j = 0; j < courseNum; j ++){
					let cur = course[j]
					if(cur['code'].length != 0){ //checking whether course is just the empty record and avoid meaningless rendering..
						temp += '<tr>' + '<td>' + cur['code'] + '</td>';
						temp += '<td>' + cur['rank'] + '</td>';
						temp += '<td>' + cur['experience'] + '</td>' + '</tr>';
					}
				}
 			}
 			temp += '</table>';
 			$(temp).appendTo($('#display'));
		})
		
	})






	//helper function for creating the table...
	function createTable(array){
		var length = array.length;
		let table = '<table>';
		table += '<tr>'
		table += '<th>' + 'Given Name' + '</th>';
		table += '<th>' + 'Family Name' + '</th>';
		table += '<th>' + 'Status' + '</th>';
		table += '<th>' + 'Year' +'</th>';
		table += '</tr>'
        for(let i = 0; i < length; i ++){
        	let ta = array[i];
			table += '<tr>'
			table += '<td>' + ta['givenname'] + '</td>';
			table += '<td>' + ta['familyname'] + '</td>';
			table += '<td>' + ta['status'] + '</td>';
			table += '<td>' + ta['year'] + '</td>';
			table += '</tr>';
		}
		table += '</table>'
		$(table).appendTo($('#display'));
	}






	//onclick handler for submitting an application
	$('#addAnApplicant').click(function(){
		let a = $('#AppstudentNum').val(); 
		let b = $('#AppGivenName').val(); 
		let c = $('#AppLastName').val();
		let d = $('#AppYear').val();
		let e = $('#Course1').val();
		if(a !== '' && b !== '' && c !== '' && d !== '' && e !== ''){
			$.post('/applicants',$('form').serialize(),function(response){
				console.log(response);
				alert(response);
			}); //Upon success, the call back function sends the 'res' to the server.
		}
	})






	//onclick handler function for deleting an applicant information
	$('#deleteAnApplicant').click(function(){
		//console.log($('#deleteName').val() === ''); //use === instead of ==, which doesn't work.. 
		let num = $('#deleteNum').val();
		let name = $('#deleteName').val();
		if(num === '' && name === ''){
			alert('Please either fill in student number or family name.');
		}else if(num !== '' && name !== ''){
			alert('Please only enter either student number or familay name.')
		}else if(num !== ''){
		//student number have been entered...
			$.ajax({
				url: '/applicants?stunum=' + num,
				type:'DELETE',
				success:function(data){
					if(data === 'Success'){
						location.reload(true);
					}else{
						alert(data);
					}	
				}
			})
		}else if(name !== ''){
			$.ajax({
				url: '/applicants?fname=' + name,
				type:'DELETE',
				success:function(data){
					if(data === 'Success'){
						location.reload(true);
					}else{
						alert(data);
					}	
				}
			})
		}
	})


	//get all applicants of all courses..
	$('#getAllAppOfAllCourses').click(function(){
		$.get('/courses',function(response){
			//console.log(res);
			$('#display').empty();
			var temp = '';
			//create the table and display the information ..
			//I dont consider displaying by ranking for now..
			for(let i = 0; i < response.length; i++){ //create a table for every course..
				let curCourse = response[i];
				let curCourseTas = response[i].tas;
				temp += '<h1 class = \'courseTitle\'>' + curCourse.code + '\'s applicants'  + '</h1>' ;
				temp += '<table class = \'tableOfCourse\'>';
				temp += '<tr>';
				temp += '<th>' + 'Ranking' + '</th>';
				temp += '<th>' + 'Experience' + '</th>';
				temp += '<th>' + 'Status' +'</th>';
				temp += '<th>' + 'Given Name' + '</th>';
				temp += '<th>' + 'Family Name' + '</th>' + '</tr>';
				//Insert information of tas here ...for each course...
				//record the rank of the applicant for this specific course, in order to append ..
			    //ordering by rank...
				for(var rank = 1; rank < 7 ; rank ++){
					for(let j = 0; j < curCourseTas.length; j ++){
						if(curCourseTas[j].ranking == rank){
							temp += '<tr>' + '<td>' + curCourseTas[j].ranking + '</td>';
							temp += '<td>' + curCourseTas[j].experience + '</td>';
							temp += '<td>' + curCourseTas[j].status + '</td>';
							temp += '<td>' + curCourseTas[j].givenname +'</td>';
							temp += '<td>' + curCourseTas[j].familyname + '</td>' + '</tr>';
						}
					}	
				}
				//I am assuming that each ta can only apply for maximum of 6 course..
				temp += '</table>';

			}
			$(temp).appendTo($('#display'));
		})
	})


	//get applicant given the specific course...
	$('#getAppByID').click(function(){
		var course = $('#courseId').val();
		$.get('/courses?course=' + course, function(response){
			$('#display').empty();
			var temp = '';
			temp += '<h1 class = \'courseTitle\'>' + response.code + '\'s applicants'  + '</h1>' ;
			temp += '<table class = \'tableOfCourse\'>';
			temp += '<tr>';
			temp += '<th>' + 'Ranking' + '</th>';
			temp += '<th>' + 'Experience' + '</th>';
			temp += '<th>' + 'Status' +'</th>';
			temp += '<th>' + 'Given Name' + '</th>';
			temp += '<th>' + 'Family Name' + '</th>' + '</tr>';
			for(var rank = 1; rank < 7 ; rank ++){
				for(let j = 0; j < response.tas.length; j ++){
					if(response.tas[j].ranking == rank){
						temp += '<tr>' + '<td>' + response.tas[j].ranking + '</td>';
						temp += '<td>' + response.tas[j].experience + '</td>';
						temp += '<td>' + response.tas[j].status + '</td>';
						temp += '<td>' + response.tas[j].givenname +'</td>';
						temp += '<td>' + response.tas[j].familyname + '</td>' + '</tr>';
					}
				}	
			}
			temp += '</table>';
			$(temp).appendTo($('#display'));
		}) 
	})
})










