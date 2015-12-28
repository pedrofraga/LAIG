/**
 * Constructor of a Counter object. It displays info about timeleft to play and number of captured pieces for each side 
 *	
 * @constructor GameHistory
 *
 */

function Counter(scene) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.initObjects();
	this.initMatrixes();

	this.lastCurrentTime = 0;

};

Counter.prototype = Object.create(CGFobject.prototype);
Counter.prototype.constructor = Counter;



Counter.prototype.initObjects = function () {

	this.timer = new Timer(this.scene);
	this.pieceCounter = new PieceCounter(this.scene);
	
}


Counter.prototype.initMatrixes = function () {

	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
 	mat4.translate(this.transformMatrix, this.transformMatrix, [20, 0, -10]);
 	//mat4.rotate(this.transformMatrix, this.transformMatrix, Math.PI / 2, [0, 1, 0]);

 	this.originalTransformMatrix = mat4.create();
 	mat4.identity(this.originalTransformMatrix);
 	mat4.copy(this.originalTransformMatrix, this.transformMatrix);


	this.timerMatrix = mat4.create();
	mat4.identity(this.timerMatrix);
	mat4.translate(this.timerMatrix, this.timerMatrix, [0, 3, 0]);

	this.pieceCounterMatrix = mat4.create();
	mat4.identity(this.pieceCounterMatrix);
	mat4.translate(this.pieceCounterMatrix, this.pieceCounterMatrix, [0, -3, 0]);
	
}


Counter.prototype.display = function () {

	var bot = (this.scene.board.black == 'Bot' && this.scene.board.history.playing == 'black'
				|| this.scene.board.white == 'Bot' && this.scene.board.history.playing == 'white') ? 
				true : false;

	this.scene.pushMatrix();
		this.scene.multMatrix(this.originalTransformMatrix);

		this.scene.pushMatrix();
			this.scene.multMatrix(this.pieceCounterMatrix);
			this.pieceCounter.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.multMatrix(this.timerMatrix);
			if (!this.scene.replaying && !bot) this.timer.display();
		this.scene.popMatrix();

	this.scene.popMatrix();
}


Counter.prototype.update = function (currTime) {

	var bot = (this.scene.board.black == 'Bot' && this.scene.board.history.playing == 'black'
				|| this.scene.board.white == 'Bot' && this.scene.board.history.playing == 'white') ? 
				true : false;
	
	var deltaTime = 0;
	
	if (this.lastCurrTime != 0)
		deltaTime = currTime - this.lastCurrTime;

	this.lastCurrTime = currTime;

	if (this.scene.board.initialized) {
		if (!this.scene.replaying && !bot) this.timer.update(deltaTime);
		this.pieceCounter.update(deltaTime);
	}
	
}