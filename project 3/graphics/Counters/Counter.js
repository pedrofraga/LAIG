/**
 * Constructor of a Counter object. It displays info about timeleft to play and number of captured pieces for each side 
 *	
 * @constructor GameHistory
 *
 */

function Counter(scene) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.initPrimitives();

};

Counter.prototype = Object.create(CGFobject.prototype);
Counter.prototype.constructor = Counter;



Counter.prototype.initPrimitives = function () {

	this.placard = new Cube(this.scene, 3, 0.1, 3);
	
}