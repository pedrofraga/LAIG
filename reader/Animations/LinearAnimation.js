/*
*
* Linear Animation Class
*
*/


function LinearAnimation(id, time, controlPoints, velocity, controlPointDistance) {
	

	this.id = id;

	this.velocity = velocity;

	this.elapsedSpan = 0;

	this.span = time;

	this.controlPoints = controlPoints;

	this.controlPointDistance = controlPointDistance;

	this.initialControlPoint = [];

	this.rotated = false;

	for (var i = 0; i < this.controlPointDistance.length; i++)
			this.initialControlPoint[i] = 0;
	
}