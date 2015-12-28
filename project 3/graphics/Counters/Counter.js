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

	this.lastCurrentTime = 0;

};

Counter.prototype = Object.create(CGFobject.prototype);
Counter.prototype.constructor = Counter;



Counter.prototype.initObjects = function () {

	this.timer = new Timer(this.scene);
	
}


Counter.prototype.display = function () {

	this.scene.pushMatrix();
		this.timer.display();
	this.scene.popMatrix();

}


Counter.prototype.update = function (currTime) {
	
	var deltaTime = 0;
	
	if (this.lastCurrTime != 0)
		deltaTime = currTime - this.lastCurrTime;

	this.lastCurrTime = currTime;

	this.timer.update(deltaTime);
	
}