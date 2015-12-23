/**
 * constructor of a 360 Rotation Animation, mainly used to replace a piece color in a certain space
 * @constructor ReplaceColorAnimation
 * @param 	{String}	color  		future color
 *
 */

 function ReplaceColorAnimation(color) {

 	this.time = 350;
 	this.angle = 2 * Math.PI;
 	this.elapsedAngle = 0;
 	this.color = color;

 }