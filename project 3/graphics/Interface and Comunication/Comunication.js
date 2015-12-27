
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
        var cmd = requestString.substring(0, 7);

 		if (response == 'goodbye') {

 			location.replace("../");

 		} else if (response == 'win') {

            var winner = board.history.playing == 'black' ? 'Black' : 'White';
            this.botPlayed = true;
            swal(winner + ' win!');

        } else if (response != 'Bad Request') {

 			if (requestString != 'startgame' && cmd != 'botPlay') {

                var matrix = board.intrepertPlBoard(data.target.response);
 				board.history.playing = board.history.playing == 'black' ? 'white' : 'black';
 				var lastElement = board.orfanPieces.length - 1;
 				board.orfanPieces[lastElement].visible = true;

 				var moveHis = new MoveHistory(board.scene, board.orfanPieces[lastElement].x0, board.orfanPieces[lastElement].y0,
 				board.orfanPieces[lastElement].xf, board.orfanPieces[lastElement].yf);
 				board.history.movesHistory.push(moveHis);

 				board.replaceMatrix(matrix, false);

 			} else if (cmd == 'botPlay') {

                if (board.history.playing == 'black' && board.black == 'Bot' || 
                    board.history.playing == 'white' && board.white == 'Bot') {

                    var matrix = board.intrepertPlBoard(data.target.response, true);

                    board.history.playing = board.history.playing == 'black' ? 'white' : 'black';
                    board.replaceMatrix(matrix, false);
                }

                board.history.botPlayed = false;

            } else {
 				
                var matrix = board.intrepertPlBoard(data.target.response);
                board.orfanPieces = [];
 				board.replaceMatrix(matrix, true);

 			}

 			console.log(board.history.playing);

 		} else {

            board.history.botPlayed = false;
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
        		
        		if (object.piece.cylinder.height == 0.1)
        			var value = object.piece.color == 'black' ? '1,' : '2,';
        		else
        			var value = object.piece.color == 'black' ? '3,' : '4,';

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
