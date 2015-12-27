/**
 * constructor of the spring animation, some physics
 * @constructor SpringAnimation
 *
 */

 function SpringAnimation(v0y) {

 	this.time = 0;
 	this.k = -30;
	this.b = -0.97;
	this.mass = 0.1;

	this.y = 0;
	this.vy = v0y; 

 }


/**
 * updates spring ay, vy and y each iteration
 * @method update
 *
 */

SpringAnimation.prototype.update = function () {

 	var spring_y = this.k * ( this.y ); 
 	var damper_y = this.b * ( this.vy );
 	this.ay = ( spring_y + damper_y ) / this.mass;
 	this.vy += this.ay * (this.time/1250);
 	this.y += this.vy * (this.time/1250);

}