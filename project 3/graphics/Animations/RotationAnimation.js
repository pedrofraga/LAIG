/**
 * constructor of a 360 Rotation Animation, mainly used to replace a piece color in a certain space
 * @constructor RotationAnimation
 * @param 	{String}	color  		future color
 * @param 	{String}	purpose		remove, replace, insert piece
 *
 */

 function RotationAnimation(color, purpose) {

 	this.time = 500;
 	this.angle = 2 * Math.PI;
 	this.elapsedAngle = 0;
 	this.color = color;
 	this.purpose = purpose;

 }