
/**
 * Sends a request string to prolog server followed by handle success or error cases. 
 *	
 * @method getPrologRequest
 * @param	requestString
 * @param 	onSuccess
 * @param	onError
 * @param 	port 	 
 *
 */

 Board.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {

 	var requestPort = port || 8081
 	var request = new XMLHttpRequest();
 	var board = this;

 	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

 	request.onload = onSuccess || 
 	function (data) {

 		console.log("Request successful. Reply: " + data.target.response); 

 		if (data.target.response == 'goodbye') 
 			location.replace("../");
 		else
 			board.intrepertPlBoard(data.target.response);

 	};

 	request.onerror = onError || function() { swal("Oops...", "Error waiting for response, please check if SICStus server is running.", "error"); };

 	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
 	request.send();

 }

/**
 * Receives data from prolog, intreperts a board everytime someone plays
 *	
 * @method	getResponse
 * @param   data 	Contains data about the request
 *
 */

Board.prototype.getResponse = function (data) {

	console.log("Request successful. Reply: " + data.target.response); 
	
	if (data.target.response == 'goodbye') 
		location.replace("../");

	console.log(board);

}


/**
 * Sends a request to the prolog server
 *	
 * @method	requestToPl
 * @param   {String}	request     message to be sent
 *
 */

Board.prototype.requestToPl = function (request) {
	
	request = typeof request !== 'undefined' ? request : false;

	if (!request)
		swal('Developer Error', "Please make a valid request.", "error")
	
	this.getPrologRequest(request);
	
}
