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

	this.initPrimitives();

	this.initBoardMatrix();
}

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor= Board;


/**
 * Displays board elements (pieces and board spaces). 
 *	
 * @method display
 *
 */

Board.prototype.display = function () {

	for (var i = 0; i < this.pieces.length; i++) {
		this.pieces[i].display();
	}

	for (var i = 0; i < this.spaces.length; i++) {
		this.spaces[i].display();
	}

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
	
	this.cylinder = new Cylinder(this.scene, 0.2, 0.8, 0.8, 1, 20);
	this.top = new MyCircle(this.scene, 0.8, 20);

}


/**
 * Initializes a default morelli game with black pieces on the borders of the board.
 *	
 * @method initBoardMatrix
 *
 */

Board.prototype.initBoardMatrix = function () {

	this.pieces = [];
	this.spaces = [];

	for (var y = 0; y < 13; y++) {
		for (var x = 0; x < 13; x++) {
			this.spaces.push( new BoardSpace(this.scene, x, y, this.space) );

			if (y == 0) {
				this.pieces.push( new Piece(this.scene, x, 0, this.cylinder, this.top) );
				this.pieces.push( new Piece(this.scene, x, 12, this.cylinder, this.top) );

				this.pieces.push( new Piece(this.scene, 0, x, this.cylinder, this.top) );
				this.pieces.push( new Piece(this.scene, 12, x, this.cylinder, this.top) );
			}
		}
	}

}



/**
 * Interprets a board string from ProLog and converts it to JavaScript arrays
 *	
 * @method intrepertPlBoard
 * @param 	{string} 		plBoard  	a string containing a ProLog formated board 
 * @return 	{array}			board   	represents a game state
 *
 */


 Board.prototype.intrepertPlBoard = function (plBoard) {

 	plBoard = plBoard.substring(plBoard.indexOf("[")+1, plBoard.lastIndexOf("]"));
 	var lines = plBoard.match(/\[(.*?)\|/g);
 	var board = [];

 	for (var i = 0; i < lines.length; i++) 
 		board.push(lines[i].match(/(\d|-\d+)/g));

 	return board;

 }


 /**
 * Displays new game state
 *	
 * @method intrepertPlBoard
 * @param	{array}		newMatrix	matrix to be displayed
 *
 */


 Board.prototype.replaceMatrix = function (newMatrix) {

 	for (var i = 0; i < this.pieces.length; i++) {
		
		var x = this.pieces[i].x;
		var y = this.pieces[i].y;

		switch (newMatrix[y][x]) {
			case '1':
				this.pieces[i].color = 'black';
				break;
			case '2':
				this.pieces[i].color = 'white';
				break;
		}

	}


 }