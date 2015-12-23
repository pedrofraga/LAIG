/**
 * constructor of a Swing Rotation Animation, an effect animation
 * @constructor SwingAnimation
 *
 */

 function SwingAnimation(direction, v0, radius) {

 	this.elapsedTime = 0;
 	this.angle = 0;
 	this.radius = radius;
 	this.v0 = v0;
 	this.velocity = v0;

 }


 SwingAnimation.prototype.calcVelocity = function () {
 	
 	var vy = this.angle > 0 ? this.v0 - 9.8 * this.elapsedTime : this.v0 + 9.8 * this.elapsedTime;

 	var vx = Math.tan(this.angle) * vy;

  	if (vy < 0) 
 		this.velocity = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));

 }