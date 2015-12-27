/**
 * constructor of the color replacer Animation
 * @constructor ReplaceAnimation
 *
 */

 function ReplaceAnimation() {

 	this.currY = 0;
 	this.time = 500;
 	this.angle = Math.PI;
 	this.elapsedAngle = 0;

 }


 /**
 * updates y each iteration
 * @method update
 *
 */

ReplaceAnimation.prototype.update = function (deltaTime) {

	var angle = this.angle * deltaTime / this.time;

	this.elapsedAngle += angle;

	this.currY = 6 * Math.sin(this.elapsedAngle);

}