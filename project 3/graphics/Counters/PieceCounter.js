
function PieceCounter(scene) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.initMatrixes();
	this.initPrimitives();
	this.initObjects();

	this.blackPiecesNumber = 24;
	this.whitePiecesNumber = 24;

};

PieceCounter.prototype = Object.create(CGFobject.prototype);
PieceCounter.prototype.constructor = PieceCounter;

PieceCounter.prototype.initPrimitives = function () {
	this.cube = new Cube(this.scene, 3, 3, 0.1);
}


PieceCounter.prototype.initMatrixes = function () {
	this.blackTextMatrix = mat4.create();
	mat4.identity(this.blackTextMatrix);
	mat4.translate(this.blackTextMatrix, this.blackTextMatrix, [6.55, 5, -0.6]);

	this.whiteTextMatrix = mat4.create();
	mat4.identity(this.whiteTextMatrix);
	mat4.translate(this.whiteTextMatrix, this.whiteTextMatrix, [-6.55, 5, -0.6]);
}

PieceCounter.prototype.initObjects = function () {

	this.blackText = new Obj(this.scene, 'Objs/blackText.obj');
	this.blackDozensPlacard = new Placard(this.scene, this.cube, 4.7);
	this.blackUnitsPlacard = new Placard(this.scene, this.cube, 8.4);

	this.whiteText = new Obj(this.scene, 'Objs/whiteText.obj');
	this.whiteDozensPlacard = new Placard(this.scene, this.cube, -8.4);
	this.whiteUnitsPlacard = new Placard(this.scene, this.cube, -4.7);

}




PieceCounter.prototype.display = function () {

	this.scene.pushMatrix();
		this.blackDozensPlacard.display();
		this.blackUnitsPlacard.display();
		this.whiteDozensPlacard.display();
		this.whiteUnitsPlacard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.blackTextMatrix);
		this.blackText.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.whiteTextMatrix);
		this.whiteText.display();
	this.scene.popMatrix();

}


PieceCounter.prototype.update = function (deltaTime) {


	var blackDozens = this.blackPiecesNumber / 10 - (this.blackPiecesNumber % 10) / 10;
	this.blackDozensPlacard.update(deltaTime, blackDozens);
	this.blackUnitsPlacard.update(deltaTime, this.blackPiecesNumber % 10);

	var whiteDozens = this.whitePiecesNumber / 10 - (this.whitePiecesNumber % 10) / 10;
	this.whiteDozensPlacard.update(deltaTime, whiteDozens);
	this.whiteUnitsPlacard.update(deltaTime, this.whitePiecesNumber % 10);

}


PieceCounter.prototype.checkPieceNumbers = function (deltaTime) {
	this.blackPiecesNumber = 0;
	this.whitePiecesNumber = 0;

	for (var y = 0; y < this.scene.board.matrix.length; y++ )
		for (var x = 0; x < this.scene.board.matrix.length; x++ )
			if (this.scene.board.matrix[y][x].piece != null) 
				this.scene.board.matrix[y][x].piece.color == 'black' ? this.blackPiecesNumber++ : this.whitePiecesNumber++;
			

}