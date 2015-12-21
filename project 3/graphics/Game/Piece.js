/**
 * Constructor of a Piece object. It contains info about the piece position and the color to be taken by. 
 *	
 * @constructor Piece
 * @param  {CGFScene}	scene	current scene
 * @param  {int}		x		border x position
 * @param  {int}		y		border y position
 * @param  {CGFObject}	cylinder		this cylinder object is passed as argument to save resources (see initPrimitives method in Board.js)
 * @param  {CGFObject}	top		this top object is passed as argument to save resources (see initPrimitives method in Board.js)
 *
 */

function Piece(scene, x, y, cylinder, top) {

	CGFobject.call(this,scene);
	
	this.scene = scene;
	this.color = 'black';
	this.x = x;
	this.y = y;

	this.cylinder = cylinder;
	this.top = top;
	
	this.createInitialMatrixes();

}

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

/**
 * Displays pieces by manipulating white and black elements. 
 *	
 * @method display
 *
 */

Piece.prototype.display = function () {

	this.scene.pushMatrix();

	this.scene.multMatrix(this.transformMatrix);

	this.displayWhiteCylinder();
	this.displayWhiteTop();

	this.displayBlackCylinder();
	this.displayBlackTop();

	this.scene.popMatrix();

}


/*
 *	Not sure if it is worth to display white and black tops.
 */

Piece.prototype.displayWhiteCylinder = function ()  {

	this.scene.pushMatrix();
	this.scene.whiteMaterial.apply();
	this.cylinder.display();
	this.scene.popMatrix();

}


Piece.prototype.displayBlackCylinder = function ()  {

	this.scene.pushMatrix();
	this.scene.blackMaterial.apply();
	this.scene.multMatrix(this.blackCylinderTranslation);
	this.cylinder.display();
	this.scene.popMatrix();

}

Piece.prototype.displayWhiteTop = function ()  {

	this.scene.pushMatrix();
	this.scene.whiteMaterial.apply();
	this.scene.multMatrix(this.whiteTopMatrix);
	this.top.display();
	this.scene.popMatrix();

}

Piece.prototype.displayBlackTop = function ()  {

	this.scene.pushMatrix();
	this.scene.blackMaterial.apply();
	this.scene.multMatrix(this.blackTopTranslation);
	this.top.display();
	this.scene.popMatrix();

}

/**
 * Creates initial transform matrixes, it is important to don't create them everytime a display occurs. 
 *	
 * @method createInitialMatrixes
 *
 */


Piece.prototype.createInitialMatrixes = function () {

	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
 	var posx = 5 + 2.5 * this.x; var posy =  5 + 2.5 * this.y;
 	mat4.translate(this.transformMatrix, this.transformMatrix, [posx, 0.2, posy]);
 	mat4.rotate(this.transformMatrix, this.transformMatrix, -Math.PI / 2, [1, 0, 0]);

 	this.blackCylinderTranslation = mat4.create();
 	mat4.identity(this.blackCylinderTranslation);
 	mat4.translate(this.blackCylinderTranslation, this.blackCylinderTranslation, [0, 0, 0.11]);

 	this.whiteTopMatrix = mat4.create();
 	mat4.identity(this.whiteTopMatrix);
 	mat4.rotate(this.whiteTopMatrix, this.whiteTopMatrix, -Math.PI, [1, 0, 0]);

 	this.blackTopTranslation = mat4.create();
 	mat4.identity(this.blackTopTranslation);
 	mat4.translate(this.blackTopTranslation, this.blackTopTranslation, [0, 0, 0.2]);

}