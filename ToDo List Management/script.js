var app = angular.module("myApp",[]);

app.controller('ctrl',function($scope){
	$scope.error ="";
	//initialize the list of tasks 
	$scope.list = [];
	//give each task a unique id 
	$scope.id = 1;

	$scope.addItem = function(){
		if($scope.newDate && $scope.newDetail && $scope.newTitle){
			//constructing date object 
			var date = $scope.newDate;
			var month = (date.getMonth() + 1).toString();
			var year = date.getFullYear().toString();
			var day = date.getDate().toString();
			if(month.length < 2){
				month = "0" + month;
			}
			if(day.length < 2){
				day = "0" + day;
			}
			var dateAfter = [year, month, day].join('-');
	
			var newItem = {};
			newItem.id = $scope.id;
			newItem.title = $scope.newTitle;
			newItem.detail = $scope.newDetail;
			newItem.isDone = false;
			newItem.date = dateAfter;
			newItem.show = false;
			$scope.id += 1;
			$scope.list.push(newItem);
		}else{
			$scope.error = "At least one field is empty or incorrect...";
		}
	}

	//event listener for deleting the task in the list
	$scope.removeItem = function(id){
		for(let i = 0 ; i < $scope.list.length; i ++){
			if($scope.list[i].id == id){
				$scope.list.splice(i,1);
				break;
			}
		}
	}

	//event listener for showing detail of only one task
	$scope.hideOthers = function(id){
		for(let i = 0; i < $scope.list.length; i ++){
			if($scope.list[i].id == id){
				$scope.list[i].show = true;
			}else{
				$scope.list[i].show = false;
			}
		}
	}


})