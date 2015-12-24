/**
 * constructor of the arch Animation
 * @constructor ArchAnimation
 *
 */

 function ArchAnimation(x0, z0, xf, zf) {
 	
 	this.x0 = x0 * 2.5 + 5;
 	this.z0 = z0 * 2.5 + 5;
 	this.xf = xf * 2.5 + 5;
 	this.zf = zf * 2.5 + 5;

 	this.currX = 0;
 	this.currZ = 0;
 	this.currY = 0;

 	this.distance = Math.sqrt(Math.pow(this.xf - this.x0, 2) + Math.pow(this.zf - this.z0, 2));
 	this.acumulatedDistance = 0;
 	this.time = this.distance * 80;

 	this.gravity = 9.8 / 10000000;
 	var vy = 0.5 * this.time * this.gravity;
 	this.v0y = vy + this.gravity * Math.pow(this.time, 2);

 	this.elapsedTime = 0;
 }


/**
 * updates spring ay, vy and y each iteration
 * @method update
 *
 */

ArchAnimation.prototype.update = function (deltaTime) {

	this.elapsedTime += deltaTime;
	var dx = (this.xf - this.x0) * deltaTime / this.time;
	var dz = (this.zf - this.z0) * deltaTime / this.time;

	this.currX += dx;
	this.currZ += dz;
	this.currY = this.v0y * this.elapsedTime - 0.5 * this.gravity * Math.pow(this.elapsedTime, 2);

	console.log(this.currY);

	this.acumulatedDistance += Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

}