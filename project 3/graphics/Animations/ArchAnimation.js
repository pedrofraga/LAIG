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
 	this.time = 100 * 4//this.distance * 80;

 	this.angle = Math.PI;
 	this.elapsedAngle = 0;
 }


/**
 * updates spring ay, vy and y each iteration
 * @method update
 *
 */

ArchAnimation.prototype.update = function (deltaTime) {

	this.dx = (this.xf - this.x0) * deltaTime / this.time;
	this.dz = (this.zf - this.z0) * deltaTime / this.time;
	var angle = this.angle * deltaTime / this.time;

	this.currX += this.dx;
	this.currZ += this.dz;
	this.elapsedAngle += angle;

	this.currY = 6 * Math.sin(this.elapsedAngle);

	this.acumulatedDistance += Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dz, 2));

}