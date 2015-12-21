
function Piece(scene, x, y) {
	CGFobject.call(this,scene);
	
	this.scene = scene;
	this.color = 'black';
	this.x = x;
	this.y = y;

	this.createPrimitives();
	
	this.createInitialMatrixes();

}


Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor= Piece;


Piece.prototype.display = function () {

	this.scene.pushMatrix();

	this.scene.multMatrix(this.transformMatrix);

	this.displayWhiteCylinder();
	this.displayWhiteTop();

	this.displayBlackCylinder();
	this.displayBlackTop();

	this.scene.popMatrix();

}


Piece.prototype.displayWhiteCylinder = function ()  {

	this.scene.pushMatrix();
	this.scene.whiteMaterial.apply();
	this.whiteCylinder.display();
	this.scene.popMatrix();

}


Piece.prototype.displayBlackCylinder = function ()  {

	this.scene.pushMatrix();
	this.scene.blackMaterial.apply();
	this.scene.multMatrix(this.blackCylinderTranslation);
	this.blackCylinder.display();
	this.scene.popMatrix();

}

Piece.prototype.displayWhiteTop = function ()  {

	this.scene.pushMatrix();
	this.scene.whiteMaterial.apply();
	this.scene.multMatrix(this.whiteTopMatrix);
	this.whiteTop.display();
	this.scene.popMatrix();

}

Piece.prototype.displayBlackTop = function ()  {

	this.scene.pushMatrix();
	this.scene.blackMaterial.apply();
	this.scene.multMatrix(this.blackTopTranslation);
	this.blackTop.display();
	this.scene.popMatrix();

}


Piece.prototype.createPrimitives = function () {

	this.whiteCylinder = new Cylinder(this.scene, 0.15, 1, 1, 1, 20);
	this.whiteTop = new MyCircle(this.scene, 1, 20);
	this.blackCylinder = new Cylinder(this.scene, 0.15, 1, 1, 1, 20);
	this.blackTop = new MyCircle(this.scene, 1, 20);

}

Piece.prototype.createInitialMatrixes = function () {

	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
 	mat4.translate(this.transformMatrix, this.transformMatrix, [5, 0, 5]);
 	mat4.rotate(this.transformMatrix, this.transformMatrix, -Math.PI / 2, [1, 0, 0]);

 	this.blackCylinderTranslation = mat4.create();
 	mat4.identity(this.blackCylinderTranslation);
 	mat4.translate(this.blackCylinderTranslation, this.blackCylinderTranslation, [0, 0, 0.15]);

 	this.whiteTopMatrix = mat4.create();
 	mat4.identity(this.whiteTopMatrix);
 	mat4.rotate(this.whiteTopMatrix, this.whiteTopMatrix, -Math.PI, [1, 0, 0]);

 	this.blackTopTranslation = mat4.create();
 	mat4.identity(this.blackTopTranslation);
 	mat4.translate(this.blackTopTranslation, this.blackTopTranslation, [0, 0, 0.3]);

}