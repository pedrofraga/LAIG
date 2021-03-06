/**
 * Constructor of a Placard object. Used to display a algarism.
 *	
 * @constructor Placard
 *
 */

function Placard(scene, cube, translation) {

	CGFobject.call(this,scene);
	this.scene = scene;
	this.obj = cube;
	this.frontSquare = new Square(this.scene, - this.obj.width / 2, this.obj.width / 2, this.obj.height / 2, - this.obj.height / 2);

	this.initMatrixes(translation);

	this.newValue = 0;
	this.value = 0;
	this.animation = null;
};


Placard.prototype = Object.create(CGFobject.prototype);
Placard.prototype.constructor = Placard;

/**
 * Initiates the transformation matrixes that are used to display the placard object. 
 *	
 * @method initMatrixes
 *
 */

Placard.prototype.initMatrixes = function (translation) {

	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
 	mat4.translate(this.transformMatrix, this.transformMatrix, [translation, 0, 0]);

 	this.originalTransformMatrix = mat4.create();
 	mat4.identity(this.originalTransformMatrix);
 	mat4.copy(this.originalTransformMatrix, this.transformMatrix);

 	this.frontMatrix = mat4.create();
 	mat4.identity(this.frontMatrix);
 	mat4.translate(this.frontMatrix, this.frontMatrix, [0, 0, this.obj.depth + 0.01]);

}

/**
 * Used to display this object.
 *	
 * @method display
 *
 */

Placard.prototype.display = function () {

	this.scene.pushMatrix();
		this.scene.multMatrix(this.transformMatrix);
		this.scene.roomWallMaterial.apply();
		this.obj.display();
		this.frontDisplay();
	this.scene.popMatrix();

}

/**
 * Method to display a char in this object.
 *	
 * @method display
 *
 */

Placard.prototype.frontDisplay = function () {

	this.scene.setActiveShaderSimple(this.scene.textShader);

	this.scene.pushMatrix();
		this.scene.multMatrix(this.frontMatrix);
		this.scene.textMaterial.apply();
		this.scene.activeShader.setUniformsValues({'charCoords': [this.value % 10 - 0.15,3]});
		this.frontSquare.display();
	this.scene.popMatrix();

	this.scene.setActiveShaderSimple(this.scene.defaultShader);

}


/**
 * A method used to update/animate this object.
 *	
 * @method update
 * @param	{int} 	deltaTime 	Time since the last update in ms
 * @param	{int} 	value 	Value of the next char
 *
 */

Placard.prototype.update = function (deltaTime, value) {

	if (this.animation != null)
		switch (this.animation.constructor) {
			case RotationAnimation:
				this.rotate(deltaTime);
				break;
			case SpringAnimation:
				this.swing(deltaTime);
				break;
		}

	if (this.newValue != value) {

		this.animation = new RotationAnimation();
		this.newValue = value;

	}

}

/**
 * A method used to rotate this object, it's also used to replace the old value
 *	
 * @method rotate
 * @param	{int} 	deltaTime 	Time since the last update in ms
 *
 */

Placard.prototype.rotate = function (deltaTime) {


	if(this.animation.angle > Math.abs(this.animation.elapsedAngle)) {

		mat4.copy(this.transformMatrix, this.originalTransformMatrix);
		var angleToBeRotated = deltaTime * this.animation.angle / this.animation.time;
		this.animation.elapsedAngle += angleToBeRotated;


		mat4.rotate(this.transformMatrix, this.transformMatrix, this.animation.elapsedAngle, [1, 0, 0]);

		if (this.animation.angle / 2 <=  Math.abs(this.animation.elapsedAngle))
			this.value = this.newValue;

	} else {

		mat4.copy(this.transformMatrix, this.originalTransformMatrix);
		this.animation = new SpringAnimation(25, true, 800);


	}
}


/**
 * A method used to the apply the swing animation to a placard
 *	
 * @method swing
 * @param	{int} 	deltaTime 	Time since the last update in ms
 *
 */

Placard.prototype.swing = function (deltaTime) {

 	mat4.copy(this.transformMatrix, this.originalTransformMatrix);

 	if (Math.abs(this.animation.vy) < 0.01) {
		this.animation = null;
		return;
	}

	this.animation.time = deltaTime; 	
 	this.animation.update();
 	var y = this.animation.y;

 	mat4.rotate(this.transformMatrix, this.transformMatrix, y, [1, 0, 0]);

}