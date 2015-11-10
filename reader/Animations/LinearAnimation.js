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

	for (var i = 0; i < this.controlPointDistance.length; i++)
			this.initialControlPoint[i] = 0;
	
}