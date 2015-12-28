
function PieceCounter(scene) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.initMatrixes();
	this.initPrimitives();
	this.initObjects();

	this.blackPiecesNumber = 13;
	this.whitePiecesNumber = 13;

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

	this.blackDozensPlacard.update(deltaTime, 1);
	this.blackUnitsPlacard.update(deltaTime, 3);

	this.whiteDozensPlacard.update(deltaTime, 1);
	this.whiteUnitsPlacard.update(deltaTime, 3);
	
}
