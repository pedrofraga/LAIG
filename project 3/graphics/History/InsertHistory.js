/**
 * Constructor of an insert history object to save info about tower inserts. This object improves project organization.
 *	
 * @constructor InsertHistory
 * @param 	{string}	color 		Color of inserted tower
 * @param 	{int}		x 		Optional x of inserted piece
 * @param 	{int}		y 		Optional y of inserted piece
 *
 */


function InsertHistory (scene, color, x, y) {
	this.scene = scene;
	this.color = color
	this.x = typeof x === 'undefined' ? 6 : x;
	this.y = typeof y === 'undefined' ? 6 : y;
}


/**
 * Undoes previous moves by accessing moves history
 *	
 * @method undo
 *
 */

InsertHistory.prototype.undo = function () {

	for (var y = 0; y < this.scene.board.matrix.length; y++)
		for (var x = 0; x < this.scene.board.matrix[y].length; x++)
			if (this.x == x && this.y == y) {

				this.scene.board.matrix[y][x].animation = new RotationAnimation('', 'remove');

				var last = this.scene.board.history.movesHistory.length - 1;
				this.scene.board.history.movesHistory.splice(last, 1);

				this.scene.board.undo();
			}


}



/**
 * Replays previous moves by accessing moves history
 *	
 * @method replay
 *
 */

InsertHistory.prototype.replay = function () {

	for (var y = 0; y < this.scene.board.matrix.length; y++)
		for (var x = 0; x < this.scene.board.matrix[y].length; x++)
			if (this.x == x && this.y == y) {

				this.scene.board.matrix[y][x].animation = new RotationAnimation(this.color, 'insert');

				var last = this.scene.board.history.movesReplay.length - 1;
				this.scene.board.history.movesReplay.splice(last, 1);
				this.scene.board.history.replayIt++;

				this.scene.board.replay();
			}


}