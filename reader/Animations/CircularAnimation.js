/*
*
* Circular Animation Class
*
*/


function CircularAnimation (id, span, centerPoint, initialAngle, rotationAngle) {

	this.id = id;
	this.span = span;
	this.center = centerPoint;
	this.initialAngle = initialAngle;
	this.rotationAngle = rotationAngle;

	this.rotated = false;

}