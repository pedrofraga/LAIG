
function Board(scene) {
	CGFobject.call(this,scene);

	this.initialized = false;

	this.boardMatrix = this.initBoardMatrix();

	this.pieces = [];
}



Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor= Board;



Board.prototype.initBoardMatrix = function () {

	for (var i = 0; i < 13; i++) {
		this.pieces.push( new Piece( i, 0) );
	} 

}