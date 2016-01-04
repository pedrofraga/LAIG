/**
 * Constructor of a PieceCounter object. Used to display current number of pieces for each side.
 *	
 * @constructor PieceCounter
 *
 */

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

/**
 * Initiates the primitives that are part of this counter. 
 *	
 * @method initPrimitives
 *
 */

PieceCounter.prototype.initPrimitives = function () {
	this.cube = new Cube(this.scene, 3, 3, 0.1);
	this.support = new Cube(this.scene, 8, 11, 0.3);
	this.rotationAxis = new Cube(this.scene, 8, 0.05, 0.05);
}


/**
 * Initiates the transformation matrixes that are used to display the piece counter. 
 *	
 * @method initMatrixes
 */

PieceCounter.prototype.initMatrixes = function () {
	this.blackTextMatrix = mat4.create();
	mat4.identity(this.blackTextMatrix);
	mat4.translate(this.blackTextMatrix, this.blackTextMatrix, [8.55, 5, 0.4]);

	this.whiteTextMatrix = mat4.create();
	mat4.identity(this.whiteTextMatrix);
	mat4.translate(this.whiteTextMatrix, this.whiteTextMatrix, [-8.55, 5, 0.4]);

	this.supportMatrix = mat4.create();
	mat4.identity(this.supportMatrix);
	mat4.translate(this.supportMatrix, this.supportMatrix, [0, 3, -0.2]);

	this.rotationAxisMatrix = mat4.create();
	mat4.identity(this.rotationAxisMatrix);
	mat4.translate(this.rotationAxisMatrix, this.rotationAxisMatrix, [0, -5, -0.4]);

	this.rotationAxisSupportMatrixLeft = mat4.create();
	mat4.identity(this.rotationAxisSupportMatrixLeft);
	mat4.translate(this.rotationAxisSupportMatrixLeft, this.rotationAxisSupportMatrixLeft, [-4, -1, -0.4]);
	mat4.rotate(this.rotationAxisSupportMatrixLeft, this.rotationAxisSupportMatrixLeft, Math.PI / 2, [0, 0, 1]);

	this.rotationAxisSupportMatrixRight = mat4.create();
	mat4.identity(this.rotationAxisSupportMatrixRight);
	mat4.translate(this.rotationAxisSupportMatrixRight, this.rotationAxisSupportMatrixRight, [ 4, -1, -0.4]);
	mat4.rotate(this.rotationAxisSupportMatrixRight, this.rotationAxisSupportMatrixRight, Math.PI / 2, [0, 0, 1]);

}

/**
 * Initiates the objects that are part of this counter, including .obj files.
 *	
 * @method initPrimitives
 *
 */

PieceCounter.prototype.initObjects = function () {

	this.blackText = new Obj(this.scene, 'res/blackText.obj');
	this.blackDozensPlacard = new Placard(this.scene, this.cube, 6.7);
	this.blackUnitsPlacard = new Placard(this.scene, this.cube, 10.4);

	this.whiteText = new Obj(this.scene, 'res/whiteText.obj');
	this.whiteDozensPlacard = new Placard(this.scene, this.cube, -10.4);
	this.whiteUnitsPlacard = new Placard(this.scene, this.cube, -6.7);

}



/**
 * Used to displays this object.
 *	
 * @method display
 *
 */

PieceCounter.prototype.display = function () {

	this.scene.pushMatrix();
		this.blackDozensPlacard.display();
		this.blackUnitsPlacard.display();
		this.whiteDozensPlacard.display();
		this.whiteUnitsPlacard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.blackTextMatrix);
		this.displaySupport();
		this.blackText.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.whiteTextMatrix);
		this.displaySupport();
		this.whiteText.display();
	this.scene.popMatrix();

}


/**
 * Used to display the pieceCounter support (visual purposes).
 *	
 * @method displaySupport
 *
 */

PieceCounter.prototype.displaySupport = function () {
	this.scene.pushMatrix();
		this.scene.multMatrix(this.supportMatrix);
		this.scene.woodMaterial.apply();
		this.support.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.rotationAxisMatrix);
		this.scene.roomWallMaterial.apply();
		this.rotationAxis.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.rotationAxisSupportMatrixLeft);
		this.scene.roomWallMaterial.apply();
		this.rotationAxis.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.multMatrix(this.rotationAxisSupportMatrixRight);
		this.scene.roomWallMaterial.apply();
		this.rotationAxis.display();
	this.scene.popMatrix();
}


/**
 * A method used to update/animate this object.
 *	
 * @method update
 * @param	{int} 	deltaTime 	time since last update in ms
 *
 */

PieceCounter.prototype.update = function (deltaTime) {


	var blackDozens = this.blackPiecesNumber / 10 - (this.blackPiecesNumber % 10) / 10;
	this.blackDozensPlacard.update(deltaTime, blackDozens);
	this.blackUnitsPlacard.update(deltaTime, this.blackPiecesNumber % 10);

	var whiteDozens = this.whitePiecesNumber / 10 - (this.whitePiecesNumber % 10) / 10;
	this.whiteDozensPlacard.update(deltaTime, whiteDozens);
	this.whiteUnitsPlacard.update(deltaTime, this.whitePiecesNumber % 10);

}


/**
 * A method used to save the right number of pieces to each side.
 *	
 * @method checkPieceNumbers
 *
 */

PieceCounter.prototype.checkPieceNumbers = function () {
	this.blackPiecesNumber = 0;
	this.whitePiecesNumber = 0;

	for (var y = 0; y < this.scene.board.matrix.length; y++ )
		for (var x = 0; x < this.scene.board.matrix.length; x++ )
			if(!(x == 6 && y== 6))
			if (this.scene.board.matrix[y][x].piece != null) 
				this.scene.board.matrix[y][x].piece.color == 'black' ? this.blackPiecesNumber++ : this.whitePiecesNumber++;
			

}