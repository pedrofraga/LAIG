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

	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++)
			this.matrix[y][x].display();

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

	this.matrix = [];

	for (var y = 0; y < 13; y++) {

		this.matrix.push([]);

		for (var x = 0; x < 13; x++) {

			this.matrix[y].push( new BoardSpace(this.scene, x, y, this.space) );
			if (y == 0 || x == 0 || y == 12 || x == 12) 
				this.matrix[y][x].piece = new Piece(this.scene, x, 0, this.cylinder, this.top);

		}

	}

}



/**
 * Interprets a board string from ProLog and converts it to JavaScript arrays.
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
 * Displays new game state.
 *	
 * @method intrepertPlBoard
 * @param	{array}		newMatrix	matrix to be displayed
 *
 */


 Board.prototype.replaceMatrix = function (newMatrix) {
 	
 	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++) {

			if (newMatrix[y][x] == '2' && this.matrix[y][x].piece.color == 'black')
				this.matrix[y][x].animation = new ReplaceColorAnimation('white');
			else if (newMatrix[y][x] == '1' && this.matrix[y][x].piece.color == 'white')
				this.matrix[y][x].animation = new ReplaceColorAnimation('black');
		}

 }


/**
 * Updates the whole board, reponsible for animations.
 *	
 * @method update
 * @param	{int}	currTime	system time
 *
 */

Board.prototype.update = function (currTime) {

	for (var y = 0; y < this.matrix.length; y++)
		for (var x = 0; x < this.matrix[y].length; x++)
			this.matrix[y][x].update(currTime);

}