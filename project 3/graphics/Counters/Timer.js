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
	this.initObjects();
	this.initMatrixes();

	this.roundTime = 30;
	this.roundTimeChanged = false;
	this.createTime();

};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;


/**
 * Initiates the primitives that are part of this counter. 
 *	
 * @method initPrimitives
 *
 */

Timer.prototype.initPrimitives = function () {
	this.cube = new Cube(this.scene, 3, 3, 0.1);
	this.support = new Cube(this.scene, 10, 5, 0.3);
	this.rotationAxis = new Cube(this.scene, 10, 0.05, 0.05);
}


/**
 * Initiates the transformation matrixes that are used to display the timer. 
 *	
 * @method initMatrixes
 */


Timer.prototype.initMatrixes = function () {
	this.textMatrix = mat4.create();
	mat4.identity(this.textMatrix);
	mat4.translate(this.textMatrix, this.textMatrix, [0, 5, 0.3]);

	this.supportMatrix = mat4.create();
	mat4.identity(this.supportMatrix);
	mat4.translate(this.supportMatrix, this.supportMatrix, [0, 0, -0.1]);

	this.rotationAxisMatrix = mat4.create();
	mat4.identity(this.rotationAxisMatrix);
	mat4.translate(this.rotationAxisMatrix, this.rotationAxisMatrix, [0, -5, -0.25]);
}


/**
 * Initiates the objects that are part of the timer.
 *	
 * @method initPrimitives
 *
 */

Timer.prototype.initObjects = function () {
	this.dozensPlacard = new Placard(this.scene, this.cube, -1.7);
	this.unitsPlacard = new Placard(this.scene, this.cube, 1.7);
	this.text = new Obj(this.scene, 'res/timer.obj');
}


/**
 * Used to display the object.
 *	
 * @method display
 *
 */

Timer.prototype.display = function () {


	this.scene.pushMatrix();
		this.dozensPlacard.display();
		this.unitsPlacard.display();
		this.scene.multMatrix(this.textMatrix);
		this.displaySupport();
		this.text.display();
	this.scene.popMatrix();

}

/**
 * Used to display the timer support (visual purposes).
 *	
 * @method displaySupport
 *
 */

Timer.prototype.displaySupport = function () {
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

}



/**
 * A method used to update/animate this object.
 *	
 * @method update
 * @param	{int} 	deltaTime 	time since last update in ms
 *
 */

Timer.prototype.update = function (deltaTime) {

	this.elapsedMiliSeconds -= deltaTime;

	var bot = (this.scene.board.black == 'Bot' && this.scene.board.history.playing == 'black'
				|| this.scene.board.white == 'Bot' && this.scene.board.history.playing == 'white' || this.scene.board.finished) ? 
				true : false;

	if (bot || this.scene.replaying) { this.elapsedSeconds = 0; this.elapsedDozens = 0;}

	if (this.elapsedMiliSeconds > 0) {
		this.elapsedSeconds = this.elapsedMiliSeconds < this.elapsedSeconds * 1000 ? this.elapsedSeconds - 1 : this.elapsedSeconds;
		this.elapsedDozens = this.elapsedMiliSeconds < this.elapsedDozens * 10000 ? this.elapsedDozens - 1 : this.elapsedDozens;
		
		this.unitsPlacard.update(deltaTime, this.elapsedSeconds);
		this.dozensPlacard.update(deltaTime, this.elapsedDozens);

	} else {
		
		if (!this.roundTimeChanged) {
			this.scene.app.interface.playing = this.scene.board.history.playing = this.scene.board.history.playing == 'black' ? 'white' : 'black';
			this.scene.board.history.swaps++;
		}

		this.createTime();

		this.roundTimeChanged = false;
	}

}


/**
 * A function used to create a new countdown.
 *	
 * @method createTime
 *
 */

Timer.prototype.createTime = function () {

	var seconds = this.roundTime;
	this.elapsedSeconds = seconds;
	this.elapsedDozens = seconds / 10 - (seconds % 10 * 0.1);
	this.elapsedMiliSeconds = (seconds + 1) * 1000;

}