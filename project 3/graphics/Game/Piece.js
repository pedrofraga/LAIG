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

	var bottomMaterial = this.color == 'black' ? this.scene.whiteMaterial : this.scene.blackMaterial;
	var topMaterial = this.color != 'black' ? this.scene.whiteMaterial : this.scene.blackMaterial;

	this.displayBottomCylinder(bottomMaterial);
	this.displayBottomTop(bottomMaterial);

	this.displayTopCylinder(topMaterial);
	this.displayTopTop(topMaterial);

	this.scene.popMatrix();

}


Piece.prototype.displayBottomCylinder = function (material)  {

	this.scene.pushMatrix();
	material.apply();
	this.cylinder.display();
	this.scene.popMatrix();

}


Piece.prototype.displayTopCylinder = function (material)  {

	this.scene.pushMatrix();
	material.apply();
	this.scene.multMatrix(this.cylinderTranslation);
	this.cylinder.display();
	this.scene.popMatrix();

}

Piece.prototype.displayBottomTop = function (material)  {

	this.scene.pushMatrix();
	if (this.cylinder.height == 0.2) {
		var texture = this.color != 'black' ? this.scene.blacktower : this.scene.whitetower;
		this.scene.defaultMaterial.setTexture(texture);
		this.scene.defaultMaterial.apply();
	} else {
		material.apply();
	}

	this.scene.multMatrix(this.topMatrix);
	this.top.display();
	this.scene.popMatrix();

}

Piece.prototype.displayTopTop = function (material)  {

	this.scene.pushMatrix();
	if (this.cylinder.height == 0.2) {
		var texture = this.color == 'black' ? this.scene.blacktower : this.scene.whitetower;
		this.scene.defaultMaterial.setTexture(texture);
		this.scene.defaultMaterial.apply();
	} else {
		material.apply();
	}
	this.scene.multMatrix(this.bottomMatrix);
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

	var height = this.cylinder.height
	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
 	mat4.translate(this.transformMatrix, this.transformMatrix, [0, 0.2, 0]);
 	mat4.rotate(this.transformMatrix, this.transformMatrix, -Math.PI / 2, [1, 0, 0]);

 	this.cylinderTranslation = mat4.create();
 	mat4.identity(this.cylinderTranslation);
 	mat4.translate(this.cylinderTranslation, this.cylinderTranslation, [0, 0, height]);

 	this.topMatrix = mat4.create();
 	mat4.identity(this.topMatrix);
 	mat4.rotate(this.topMatrix, this.topMatrix, -Math.PI, [1, 0, 0]);

 	this.bottomMatrix = mat4.create();
 	mat4.identity(this.bottomMatrix);
 	mat4.translate(this.bottomMatrix, this.bottomMatrix, [0, 0, height * 2]);

}