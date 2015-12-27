/**
 * Constructor of a move object to save info about made moves. This object improves project organization.
 *	
 * @constructor MoveHistory
 * @param 	{CGFScene}	scene	Current scene
 * @param 	{int}	x0 		Initial piece x coord
 * @param	{int}	y0 		Initial piece y coord
 * @param 	{int}	xf 		Final piece x coord
 * @param	{int}	yf 		Final piece y coord
 *
 */


function MoveHistory (scene, x0, y0, xf, yf) {

	this.scene = scene;
	this.x0 = x0;
	this.y0 = y0;
	this.xf = xf;
	this.yf = yf;

}


/**
 * Undoes previous moves by accessing moves history
 *	
 * @method undo
 *
 */

MoveHistory.prototype.undo = function () {

	for (var y = 0; y < this.scene.board.matrix.length; y++)
		for (var x = 0; x < this.scene.board.matrix[y].length; x++)
			if (this.xf == x && this.yf == y) {

				if (this.scene.board.matrix[y][x].piece == null) {
					var last = this.scene.board.history.movesHistory.length - 1;
					this.scene.board.history.movesHistory.splice(last, 1);
					this.scene.board.undo();
					return; 
				} 

				var color = this.scene.board.matrix[y][x].piece.color;
				var cylinder = this.scene.board.matrix[y][x].piece.height == 0.15 ? this.scene.board.towerCylinder : this.scene.board.cylinder;

				var piece =	new Piece(this.scene, cylinder, this.scene.board.top);
				piece.color = color;

				var orfanPiece = new OrfanPiece(this.scene, piece, this.xf, this.yf, this.x0, this.y0);
				orfanPiece.visible = true;
				orfanPiece.undoAnimation = true;
				this.scene.board.orfanPieces.push(orfanPiece);
				var size = this.scene.board.orfanPieces.length - 1;
				this.scene.board.orfanPieces[size].undo = true;
				this.scene.board.matrix[y][x].piece = null;
				this.scene.board.matrix[y][x].animation = new SpringAnimation(-40);

				var last = this.scene.board.history.movesHistory.length - 1;
				this.scene.board.history.movesHistory.splice(last, 1);
				this.scene.board.history.playing = this.scene.board.history.playing == 'black' ? 'white' : 'black';
				return;
			}
}