/*
*
* Circular Animation Class
*
*/


function CircularAnimation (id, span, centerPoint, radius, initialAngle, rotationAngle) {

	this.id = id;
	this.span = span;
	this.center = centerPoint;
	this.initialAngle = initialAngle;

	this.radius = radius;

	this.initialRotAngle = 0;
	this.rotationAngle = rotationAngle;


}