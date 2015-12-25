
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

 		var response = data.target.response; 
 		if (response == 'goodbye') {

 			location.replace("../");

 		} else if (response != 'Bad Request') {

 			var matrix = board.intrepertPlBoard(data.target.response);
 			if (requestString != 'startgame') {

 				board.history.playing = board.history.playing == 'black' ? 'white' : 'black';
 				var lastElement = board.orfanPieces.length - 1;
 				board.orfanPieces[lastElement].visible = true;

 				var moveHis = new MoveHistory(board.orfanPieces[lastElement].x0, board.orfanPieces[lastElement].y0,
 					board.orfanPieces[lastElement].xf, board.orfanPieces[lastElement].yf);
 				board.history.movesHistory.push(moveHis);

 				board.replaceMatrix(matrix, false);

 			} else {
 				
 				board.replaceMatrix(matrix, true);

 			}

 			console.log(board.history.playing);

 		} else {

 			var lastElement = board.orfanPieces.length - 1;
 			board.orfanPieces.splice(lastElement, 1);

 		}

 	};

 	request.onerror = onError || function() { swal("Oops...", "Error waiting for response, please check if SICStus server is running.", "error"); };

 	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
 	request.send();

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


/**
 * Converts a matrix to a valid ProLog list of lists
 *	
 * @method	boardToPlList
 * @return   {String}	plList     A valid list in ProLog
 *
 */

Board.prototype.boardToPlList = function () {
 
    var plList = "[";
   
   for (var y = 0; y < this.matrix.length; y++) {
    	plList += "[";
		for (var x = 0; x < this.matrix[y].length; x++) {
			var object = this.matrix[y][x];
			if(object.piece == null)
        		plList += '0,';
        	else {
        		var value = object.piece.color == 'black' ? '1,' : '2,';
        		plList += value;
        	}
		}
		plList = plList.substring(0, plList.length - 1);
        plList += "],";
	}
   
    plList = plList.substring(0, plList.length - 1);
   
    plList += "]";
       
    return plList;
 
}
