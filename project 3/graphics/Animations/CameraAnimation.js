/**
 * constructor of the camera Animation
 * @constructor CameraAnimation
 *
 */

 function CameraAnimation(originPerspective, destinationPerspective) {

 	this.originPerspective = originPerspective;
 	this.destinationPerspective = destinationPerspective;
 	this.time = 750;


 	var originPos = this.originPerspective.position;
 	var destinationPos = this.destinationPerspective.position;

 	this.posDist = vec3.create();

 	vec3.subtract(this.posDist, destinationPos, originPos);
	
	this.velPos = vec3.create(); 
 	this.velPos[0] = this.posDist[0] / this.time;
 	this.velPos[1] = this.posDist[1] / this.time;
 	this.velPos[2] = this.posDist[2] / this.time;
	
 	this.travelledPosDist = vec3.create(0, 0, 0);


 	var originDir = this.originPerspective.direction;
 	var destinationDir = this.destinationPerspective.direction;

 	this.dirDist = vec3.create();

 	vec3.subtract(this.dirDist, destinationDir, originDir);
	
	this.velDir = vec3.create(); 
 	this.velDir[0] = this.dirDist[0] / this.time;
 	this.velDir[1] = this.dirDist[1] / this.time;
 	this.velDir[2] = this.dirDist[2] / this.time;
	
 	this.travelledDirDist = vec3.create(0, 0, 0);

 }