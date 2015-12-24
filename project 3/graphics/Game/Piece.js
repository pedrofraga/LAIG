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

function Piece(scene, cylinder, top) {

	CGFobject.call(this,scene);
	
	this.scene = scene;
	this.color = 'black';

	this.cylinder = cylinder;
	this.top = top;
	
	this.createInitialMatrixes();

}

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

/**
 * Displays pieces by manipulating circle and cylinder primitives. 
 *	
 * @method display
 *
 */

Piece.prototype.display = function () {

	this.scene.pushMatrix();

	this.scene.multMatrix(this.transformMatrix);

	this.displayPiece();

	this.scene.popMatrix();

}


/*
 *	Not sure if it is worth to display white and black tops.
 */

Piece.prototype.displayPiece = function ()  {

	var material = this.color == 'black' ? this.scene.blackMaterial : this.scene.whiteMaterial;

	this.scene.pushMatrix();
	material.apply();
	this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	material.apply();
	this.scene.multMatrix(this.bottomMatrix);
	this.top.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	material.apply();
	this.scene.multMatrix(this.topMatrix);
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
 	mat4.translate(this.transformMatrix, this.transformMatrix, [0, 0.2, 0]);
 	mat4.rotate(this.transformMatrix, this.transformMatrix, -Math.PI / 2, [1, 0, 0]);

 	this.bottomMatrix = mat4.create();
 	mat4.identity(this.bottomMatrix);
 	mat4.rotate(this.bottomMatrix, this.bottomMatrix, -Math.PI, [1, 0, 0]);

 	this.topMatrix = mat4.create();
 	mat4.identity(this.topMatrix);
 	mat4.translate(this.topMatrix, this.topMatrix, [0, 0, 0.2]);

}