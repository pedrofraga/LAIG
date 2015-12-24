/**
 * constructor of the picking animation
 * @constructor PickAnimation
 *
 */

 function PickAnimation() {

 	this.time = 0;
 	this.k = -30;
	this.b = -0.97;
	this.mass = 0.1;

	this.y = 0;
	this.vy = -50;

 }


PickAnimation.prototype.update = function () {

 	var spring_y = this.k * ( this.y ); 
 	var damper_y = this.b * ( this.vy );
 	this.ay = ( spring_y + damper_y ) / this.mass;
 	this.vy += this.ay * (this.time/1000);
 	this.y += this.vy * (this.time/1000);

}