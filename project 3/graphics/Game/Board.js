/**
 * Constructor of a Board object. This object is used to save all the required info to display a board space or a piece. 
 *	
 * @constructor Board
 * @param  {CGFScene}	scene	current scene
 *
 */

function Board(scene) {
	CGFobject.call(this,scene);

	this.scene = scene;
	this.initialized = false;
	this.history = new GameHistory();

	this.initPrimitives();

	this.initBoardMatrix();

	this.orfanPieces = [];

	this.white = 'Human';
	this.black = 'Human';

}

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor= Board;


/**
 * Displays board elements (pieces, orfan pieces and board spaces). 
 *	
 * @method display
 *
 */

Board.prototype.display = function () {

	this.scene.pushMatrix();

	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++) {
			if (this.initialized) this.scene.registerForPick(y * 13 + x + 1, this.matrix[y][x]);
			this.matrix[y][x].display();
		}

	for (var i = 0; i < this.orfanPieces.length; i++)
		this.orfanPieces[i].display();

	this.scene.popMatrix();
}


/**
 * Saves primitives that are used to display pieces and board spaces in order to don't create them everytime that an object 
 * is initialized.
 *	
 * @method initPrimitives
 *
 */

Board.prototype.initPrimitives = function () {

	this.space = new Cube(this.scene, 2, 0.3, 2);
	
	this.cylinder = new Cylinder(this.scene, 0.1, 0.8, 0.8, 1, 20);
	this.towerCylinder = new Cylinder(this.scene, 0.15, 0.8, 0.8, 1, 20);
	this.top = new MyCircle(this.scene, 0.8, 20);

}


/**
 * Initializes a default morelli game with black pieces on the borders of the board, registring pieces to picking
 *	
 * @method initBoardMatrix
 *
 */

Board.prototype.initBoardMatrix = function () {

	this.matrix = [];

	for (var y = 0; y < 13; y++) {

		this.matrix.push([]);

		for (var x = 0; x < 13; x++) {

			this.matrix[y].push( new BoardSpace(this.scene, x, y, this.space) );

			if (y == 0 || x == 0 || y == 12 || x == 12) 
				this.matrix[y][x].piece = new Piece(this.scene, this.cylinder, this.top);

		}

	}

}



/**
 * Interprets a board string from ProLog and converts it to JavaScript arrays by regular expressions.
 *	
 * @method intrepertPlBoard
 * @param 	{string} 		plBoard  	a string containing a ProLog formated board 
 * @return 	{array}			board   	represents a game state
 *
 */


 Board.prototype.intrepertPlBoard = function (plBoard, botPlaying) {

 	botPlaying = typeof botPlaying === 'undefined' ? false : true;

 	plBoard = plBoard.substring(plBoard.indexOf("[")+1, plBoard.lastIndexOf("]"));
 	plBoard = plBoard.replace(/\]\,/g, "\|\]\,").replace(/\]$/, "\|\]");
 	var lines = plBoard.match(/\[(.*?)\|/g);
 	var board = [];

 	for (var i = 0; i < lines.length; i++) {

 		if (botPlaying && i == 0) {

 			var newstring = lines[i].substring(0, lines[i].length - 1); //removing some garbish
 			newstring = newstring.substring(1, newstring.length);
 			var numbers = newstring.split(',');

 			var x0 = parseFloat(numbers[0]), y0 = parseFloat(numbers[1]), xf = parseFloat(numbers[2]), yf = parseFloat(numbers[3]);
 			var color = this.matrix[y0][x0].piece.color;

 			var obj = new Piece(this.scene, this.cylinder, this.top);
 			obj.color = color;

 			var orfanPiece = new OrfanPiece(this.scene, obj, x0, y0, xf, yf);
 			orfanPiece.visible = true;
 			this.orfanPieces.push(orfanPiece);

 			var moveHis = new MoveHistory(this.scene, x0, y0, xf, yf);
 			this.history.movesHistory.push(moveHis);

 		} else {
 			board.push(lines[i].match(/(\d|-\d+)/g));
 		}

 	}


 	this.initialized = true;

 	return board;

 }


 /**
 * Displays new game state.
 *	
 * @method intrepertPlBoard
 * @param	{array}		newMatrix	matrix to be displayed
 *
 */


 Board.prototype.replaceMatrix = function (newMatrix, starting, replaying) {
 	
 	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++) {

			if (this.matrix[y][x].piece != null) {
				if ( (newMatrix[y][x] == '2' && this.matrix[y][x].piece.color == 'black' ) || 
					(newMatrix[y][x] == '1' && this.matrix[y][x].piece.color == 'white') ||
					 (newMatrix[y][x] == '4' && this.matrix[y][x].piece.color == 'black' ) || 
					(newMatrix[y][x] == '3' && this.matrix[y][x].piece.color == 'white')) {

					var color = this.matrix[y][x].piece.color;
					var cylinder = this.matrix[y][x].piece.cylinder.height == 0.15 ? this.towerCylinder : this.cylinder;

					var obj = new Piece(this.scene, cylinder, this.top);
					obj.color = color;
					this.orfanPieces.push(new OrfanPiece(this.scene, obj, x, y));
					this.matrix[y][x].piece = null;
					this.matrix[y][x].animation = new SpringAnimation(-30);

				}  else if (newMatrix[y][x] == '0' && !starting && !replaying) {

					this.matrix[y][x].piece = null;
					this.matrix[y][x].animation = new SpringAnimation(-40);

				} else if ((newMatrix[y][x] == '0' || newMatrix[y][x] == '-1') && (starting || replaying)) {

					this.matrix[y][x].animation = new RotationAnimation('', 'remove');

				}

			} else {

				if ((newMatrix[y][x] == '1' || newMatrix[y][x] == '2')  && (starting || replaying)) {
					var color = newMatrix[y][x] == '1' ? 'black' : 'white';
					this.matrix[y][x].animation = new RotationAnimation(color, 'insert');
				} else if (newMatrix[y][x] == '3' || newMatrix[y][x] == '4') {

					var color = newMatrix[y][x] == '3' ? 'black' : 'white';
					this.matrix[y][x].animation = new RotationAnimation(color, 'insert');
					this.history.movesHistory.push(new InsertHistory(this.scene, color));

				}

			}

		}

	if (starting) {
	 	this.clearHistory();
	 	this.history.initialMatrix = newMatrix;
	}

 }


/**
 * Updates the whole board, reponsible for animations, the bot plays if it's ment to play.
 *	
 * @method update
 * @param	{int}	currTime	system time
 *
 */

Board.prototype.update = function (currTime) {

	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++)
			this.matrix[y][x].update(currTime);

	for (var i = 0; i < this.orfanPieces.length; i++) {
		
		if (this.orfanPieces[i] != null)
			if (this.orfanPieces[i].animation == null) {
				this.orfanPieces.splice(i, 1);
			} else {
				this.orfanPieces[i].update(currTime);
			}

	}

	if(!this.scene.replaying)
		this.botPlay();
	else
		this.replay();

}

/**
 * The bot makes a move if there are no animations ocurring and if it's bot turn.
 *	
 * @method botPlays
 *
 */

Board.prototype.botPlay = function () {

	if(this.initialized)
	if (this.white == 'Bot' && this.history.playing == 'white' ||
		this.black == 'Bot' && this.history.playing == 'black') {

		if (!this.orfanPieces.length && !this.history.botPlayed) {

			var plBoard = this.boardToPlList();
			var request = 'botPlay(' + plBoard + ',' + this.history.playing + 'Player)';
			this.requestToPl(request);
			this.history.botPlayed = true;

		}

	}

}



/**
 * Gets the pick history, animates space, and sends move command to prolog
 *	
 * @method pick
 * @param 	{int}		id 		object custom id
 * @param	{Object}	obj	  	picked object
 *
 */

 Board.prototype.pick = function (id, obj) {


 	obj.animation = new SpringAnimation(-50);

 	if (this.history.playing == 'black' && this.black == 'Bot' ||
 		this.history.playing == 'white' && this.white == 'Bot')
 		return;

 	if (obj.piece != null) { 
 		this.history.selectedSpaces[0] = obj;
 	} else if (obj.piece == null) {
 		if (this.history.selectedSpaces.length) {
 			this.history.selectedSpaces[1] = obj;
 			var piece = this.history.selectedSpaces;
 			var boardPlList = this.boardToPlList();

 			var request = 'movePiece(' + boardPlList + ',' + piece[0].y + ',' +
 			 piece[0].x + ',' + piece[1].y + ',' + piece[1].x + ','
 			  + this.history.playing + 'Player)';

			var obj = new Piece(this.scene, this.cylinder, this.top);
			if (this.history.playing == 'white') obj.color = 'white';

			this.orfanPieces.push(new OrfanPiece(this.scene, obj, piece[0].x, piece[0].y, piece[1].x, piece[1].y));

 			this.requestToPl(request);
 		}
 		this.history.selectedSpaces = [];
 	}

 }



 /**
 * Undoes previous moves by accessing moves history
 *	
 * @method undo
 *
 */


 Board.prototype.undo = function () {

 	var size = this.history.movesHistory.length;
 	if (!size) return;

 	var lastMove = size - 1;
 	var move = this.history.movesHistory[lastMove];

 	var lastOrfan = this.orfanPieces.length - 1;
 	if (this.orfanPieces.length)
 		if (!this.orfanPieces[lastOrfan].undoAnimation && this.orfanPieces[lastOrfan].animation.constructor === ArchAnimation) {
 			var x = this.orfanPieces[lastOrfan].x0; y = this.orfanPieces[lastOrfan].y0;
 			var piece = new Piece(this.scene, this.cylinder, this.top);
 			piece.color = this.orfanPieces[lastOrfan].piece.color;
 			this.matrix[y][x].piece = piece;
 			this.orfanPieces.splice(lastOrfan, 1);
 		}

 	move.undo();

 }

  /**
 * Replays previous moves by accessing moves history
 *	
 * @method replay
 *
 */


 Board.prototype.replay = function () {

 	if(!this.scene.replayStarted)
 		if(this.boardAnimating()) return;
 		else this.scene.replayStarted = true;

 	var size = this.history.movesReplay.length;
 	if (!size) {
 		var board = this;
 		setTimeout (function () {
 			board.scene.counter.timer.createTime();
 			board.scene.replaying = false;
 			board.scene.replayStarted = false;
 			board.scene.app.interface.replay(false);
 		}, 600);
 		return;
 	}

 	var lastOrfan = this.orfanPieces.length - 1;
 	if (this.orfanPieces.length)
 		return;

 	var lastMove = size - 1;
 	var move = this.history.movesReplay[lastMove];

 	move.replay();

    this.scene.app.interface.logItVal();


 }

 /**
 * Checks if board is animating
 *	
 * @method boardAnimating
 * @return {Boolean} 	true if board is being animated, false if it's not
 *
 */

 Board.prototype.boardAnimating = function () {

 	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++)
			if (this.matrix[y][x].animation != null)
			if (this.matrix[y][x].animation.constructor == RotationAnimation) return true;

	return false;

 }



 /**
 * Clears History, sets all to default, used when a game is started
 *	
 * @method clearHistory
 *
 */


 Board.prototype.clearHistory = function () {

 	this.history = new GameHistory();

 }