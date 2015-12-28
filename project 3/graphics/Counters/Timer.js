/**
 * Constructor of a Timer object. Used to display decrescing time.
 *	
 * @constructor Timer
 *
 */

function Timer(scene) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.initPrimitives();
	this.initPlacards();
	this.initMatrixes();

	this.createTime(30);

};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;



Timer.prototype.initPrimitives = function () {
	this.cube = new Cube(this.scene, 3, 3, 0.1);
}

Timer.prototype.initMatrixes = function () {
	this.textMatrix = mat4.create();
	mat4.identity(this.textMatrix);
	mat4.translate(this.textMatrix, this.textMatrix, [0, 5, -0.6]);
}


Timer.prototype.initPlacards = function () {
	this.dozensPlacard = new Placard(this.scene, this.cube, -1.7);
	this.unitsPlacard = new Placard(this.scene, this.cube, 1.7);
	this.text = new Obj(this.scene, 'Objs/text.obj');
}


Timer.prototype.display = function () {

	this.scene.pushMatrix();
		this.dozensPlacard.display();
		this.unitsPlacard.display();
		this.scene.multMatrix(this.textMatrix);
		this.text.display();
	this.scene.popMatrix();

}



Timer.prototype.update = function (deltaTime) {

	this.elapsedMiliSeconds -= deltaTime;

	if (this.elapsedMiliSeconds > 0) {
		this.elapsedSeconds = this.elapsedMiliSeconds < this.elapsedSeconds * 1000 ? this.elapsedSeconds - 1 : this.elapsedSeconds;
		this.elapsedDozens = this.elapsedMiliSeconds < this.elapsedDozens * 10000 ? this.elapsedDozens - 1 : this.elapsedDozens;

		this.unitsPlacard.update(deltaTime, this.elapsedSeconds);
		this.dozensPlacard.update(deltaTime, this.elapsedDozens);

	} else {
		this.createTime(30);
	}

}


Timer.prototype.createTime = function (seconds) {

	this.elapsedSeconds = seconds;
	this.elapsedDozens = seconds / 10 - seconds % 10;
	this.elapsedMiliSeconds = (seconds + 1) * 1000;

}