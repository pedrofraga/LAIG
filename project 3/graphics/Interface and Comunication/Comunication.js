
function getPrologRequest(requestString, onSuccess, onError, port) {
	var requestPort = port || 8081
	var request = new XMLHttpRequest();

	this.reply = false;

	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data) {console.log("Request successful. Reply: " + data.target.response); if (data.target.response == 'goodbye') location.replace("../");}
	request.onerror = onError || function() { swal("Oops...", "Error waiting for response, please check if SICStus server is opened", "error"); };

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();

}

function requestToPl(request) {
	
	request = typeof request !== 'undefined' ? request : false;

	if (!request)
		swal('Developer Error', "Please make a valid request.", "error")
	
	getPrologRequest(request);
	

}
