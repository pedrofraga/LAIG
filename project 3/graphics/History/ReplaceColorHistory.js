/**
 * Constructor of a replace color object to save info about pieces which color was replaced. This object improves project organization.
 *	
 * @constructor ReplaceColorHistory
 * @param 	 {CGFScene}	 scene 	Current scene
 * @param 	 {string}	color 	Piece previous color
 * @param 	 {int}	x 		Piece x coord
 * @param	 {int}	y 		Piece y coord

 *
 */

function ReplaceColorHistory (scene, color, x, y) {
	
	this.scene = scene;
	this.color = color;
	this.x = x;
	this.y = y;

}


/**
 * Undoes previous moves by accessing moves history
 *	
 * @method undo
 *
 */

ReplaceColorHistory.prototype.undo = function () {

	for (var y = 0; y < this.scene.board.matrix.length; y++)
		for (var x = 0; x < this.scene.board.matrix[y].length; x++)
			if (this.x == x && this.y == y) {

				var color = this.scene.board.matrix[y][x].piece.color;
				var cylinder = this.scene.board.matrix[y][x].piece.cylinder.height == 0.15 ? this.scene.board.towerCylinder : this.scene.board.cylinder;
				var obj = new Piece(this.scene, cylinder, this.scene.board.top);
				obj.color = color;
				var orfanPiece = new OrfanPiece(this.scene, obj, x, y);
				orfanPiece.undoAnimation = true;
				this.scene.board.orfanPieces.push(orfanPiece);
				this.scene.board.matrix[y][x].piece = null;
				this.scene.board.matrix[y][x].animation = new SpringAnimation(-30);

				var last = this.scene.board.history.movesHistory.length - 1;
				this.scene.board.history.movesHistory.splice(last, 1);
				this.scene.board.history.movesHistory.splice(last - 1, 1);

				this.scene.board.undo();

			}

}



/**
 * Replays previous moves by accessing moves history
 *	
 * @method replay
 *
 */

ReplaceColorHistory.prototype.replay = function () {

	for (var y = 0; y < this.scene.board.matrix.length; y++)
		for (var x = 0; x < this.scene.board.matrix[y].length; x++)
			if (this.x == x && this.y == y) {

				var color = this.scene.board.matrix[y][x].piece.color;
				var cylinder = this.scene.board.matrix[y][x].piece.cylinder.height == 0.15 ? this.scene.board.towerCylinder : this.scene.board.cylinder;
				var obj = new Piece(this.scene, cylinder, this.scene.board.top);
				obj.color = color;
				var orfanPiece = new OrfanPiece(this.scene, obj, x, y);
				this.scene.board.orfanPieces.push(orfanPiece);
				this.scene.board.matrix[y][x].piece = null;
				this.scene.board.matrix[y][x].animation = new SpringAnimation(-30);

				var last = this.scene.board.history.movesReplay.length - 1;
				this.scene.board.history.movesReplay.splice(last, 1);

				var lastHis = this.scene.board.history.movesHistory.length - 1;
				this.scene.board.history.movesHistory.splice(lastHis, 1);

				
				this.scene.board.history.replayIt++;

				this.scene.board.replay();

			}

}