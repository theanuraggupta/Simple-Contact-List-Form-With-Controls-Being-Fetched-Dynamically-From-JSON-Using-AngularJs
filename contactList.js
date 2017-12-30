/*
	Author - Anurag Gupta
	Date - 14th July'17	
*/
angular.module("ContactModule", []).controller('contactController', function($scope, $location, $anchorScroll){
	var id = 6, editIndex, alerttimer;
	/*Dynamic field json - easier to make changes in future*/
	$scope.dynamicFieldControls = {
		SectionTitle: "Contact List",
		ControlDetails: [
			{
				"DisplayName": "First Name",
				"FieldName": "FirstName",
				"NGModelName": "firstName",
				"ControlType": "text",
				"MaxLength": "",
				"IsReadOnly" : false,
				"Pattern": "[a-zA-Z]*",
				"Mandatory": true,
				"PlaceHolderText": "Enter First Name",
				"SearchPlaceholder": "Search First Name",
				"ErrorMessage": "First Name is required."
			},
			{
				"DisplayName": "Middle Name",
				"FieldName": "MiddleName",
				"NGModelName": "middleName",
				"ControlType": "text",
				"MaxLength": "",
				"IsReadOnly" : false,
				"Pattern": "[a-zA-Z]*",
				"Mandatory": false,
				"PlaceHolderText": "Enter Middle Name",
				"SearchPlaceholder": "Search Middle Name",
				"ErrorMessage": ""
			},
			{
				"DisplayName": "Last Name",
				"FieldName": "LastName",
				"NGModelName": "lastName",
				"ControlType": "text",
				"MaxLength": "",
				"IsReadOnly" : false,
				"Pattern": "[a-zA-Z]*",
				"Mandatory": false,
				"PlaceHolderText": "Enter Last Name",
				"SearchPlaceholder": "Search Last Name",
				"ErrorMessage": ""
			},
			{
				"DisplayName": "Contact Number",
				"FieldName": "ContactNumber",
				"NGModelName": "contactNumber",
				"ControlType": "number",
				"MaxLength": "",
				"IsReadOnly" : false,
				"Pattern": "[0-9]{10}",
				"Mandatory": true,
				"PlaceHolderText": "Enter Contact Number",
				"SearchPlaceholder": "Search Contact Number",
				"ErrorMessage": "Please enter a 10 digit contact number."
			},
			{
				"DisplayName": "Contact Email Id",
				"FieldName": "ContactEmailId",
				"NGModelName": "contactEmail",
				"ControlType": "email",
				"MaxLength": "",
				"IsReadOnly" : false,
				"Pattern": "/^[_A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,4})$/",
				"Mandatory": true,
				"PlaceHolderText": "Enter Contact Email Id",
				"SearchPlaceholder": "Search Contact Email Id",
				"ErrorMessage":  "Email Id must be in correct format."
			}
		]
	};
	
	/*Contact List JSON*/
	$scope.contactList =  [
		{
			"id": 1,
			"firstName": "Joe",
			"middleName": "",
			"lastName": "Perry",
			"contactNumber": 4448881223,
			"contactEmail": "joe@cordis.us"
		},
		{
			"id": 2,
			"firstName": "Kate",
			"middleName": "",
			"lastName": "Will",
			"contactNumber": 2448381213,
			"contactEmail": "kate@cordis.us"
		},
		{
			"id": 3,
			"firstName": "Harry",
			"middleName": "",
			"lastName": "Robert",
			"contactNumber": 7441381292,
			"contactEmail": "harry@cordis.us"
		},
		{
			"id": 4,
			"firstName": "Tom",
			"middleName": "",
			"lastName": "Bill",
			"contactNumber": 2411881191,
			"contactEmail": "tom@cordis.us"
		},
		{
			"id": 5,
			"firstName": "Roger",
			"middleName": "",
			"lastName": "Steel",
			"contactNumber": 1111771231,
			"contactEmail": "roger@cordis.us"
		}
	];
	
	// scroll function
	function scrollToParticularId(id){
		$location.hash(id); // get location of the id
		$anchorScroll(); // scroll to the id
	}
	
	// show alert message function
	function showAlertMessage(type, message, duration){
		if(!duration){
			duration = 4000; // 4 seconds max
		}
		$scope.alerts = [];
		// push to the alert message
		$scope.alerts.push({
            type: type,
            message: message,
        });
		
		if(alerttimer){clearTimeout(alerttimer);}
		scrollToParticularId("alertbox");//scroll to alert box to show message
		alerttimer = setTimeout(function(){
			$scope.alerts = []; // clear after 4 seconds
			$scope.$apply(); // apply the changes to reflect in view
		}, duration);
	}
	
	// check dduplicate value in the array
	function duplicateValueInContactList(value, keyName){
		var hasDuplicate = 0;
		for(var i=0;i<$scope.contactList.length;i++){
			if(!hasDuplicate && $scope.contactList[i][keyName]===value && editIndex!==i){
				hasDuplicate = 1;
			}
		}
		return hasDuplicate;
	}
	
	// on button click function
	$scope.buttonClicked = function(clickedfrom, contactInfo, index, length){
		switch(clickedfrom){
			case 5: // cancel button click
			case 1: // add new contact
				$scope.contactInfo = {};
				if(clickedfrom===1){// add new contact
					$scope.showForm = true;
					scrollToParticularId("contactForm");
				}else{
					$scope.showForm = false;
				}
				editIndex = -1;
				break;
			case 2: // edit contact
				editIndex = index;
				$scope.showForm = true;
				$scope.contactInfo = angular.copy(contactInfo);
				scrollToParticularId("contactForm");
				break;
			case 3: // delete contact
				editIndex = -1;
				if(length){
					$scope.contactList.splice(index, 1);
					if(length===1){
						$scope.buttonClicked(1);
					}else{
						$scope.buttonClicked(5);
					}
					showAlertMessage("success", 'Deleted.');
				}
				break;
			case 4: // add or update contact
				if(!duplicateValueInContactList(contactInfo['contactNumber'], 'contactNumber')){
					if(!duplicateValueInContactList(contactInfo['contactEmail'], 'contactEmail')){
						if(contactInfo.id){ // update contact
							if(editIndex>-1){
								$scope.contactList.splice(editIndex, 1);
								$scope.contactList.splice(editIndex, 0, contactInfo);
								showAlertMessage("success", 'Saved.');
							}
						}else{ // add contact
							$scope.contactList.push(angular.extend(contactInfo,{id: ++id}));
							showAlertMessage("success", 'Added Successfully.');
						}
						$scope.showForm = false;
					}else{
						showAlertMessage("danger", "Email Id already exists.");
					}
				}else{
					showAlertMessage("danger", "Contact Number already exists.");
				}
				break;
		}	
	};
	$scope.searchPlaceholder = "Search Contact by Name, Contact Number or Email Id";
	
	// on selected filter search
	$scope.addSearchFilter = function (item, add) {
		$scope.showToggle = false;
		if(add){
			$scope.searchPlaceholder = item.SearchPlaceholder;
			$scope.selectedItem = item;
		}else{
			$scope.searchPlaceholder = "Search Contact by Name, Contact Number or Email Id";
			$scope.selectedItem = undefined;
		}
	};
	// remove alert message 
	$scope.removeAlert  = function(){
		$scope.alerts = [];
	};
	
});