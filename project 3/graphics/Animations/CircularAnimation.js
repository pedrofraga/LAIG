/**
 * constructor of CircularAnimation object
 * @constructor CircularAnimation
 * @param  {string} id     string of id
 * @param  {float} span   span of the animation 
 * @param  {array} centerPoint   center of the animation 
 * @param  {int} radius   radius of circular animation 
 * @param  {int} initialAngle   value of the initial Angle 
 * @param  {int} initialAngle   value of the rotation Angle 
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