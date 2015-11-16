/*
  *	Node Class
  */

 function Node(id) {

 	this.id = id;

 	this.texture = null;
 	this.material = null;

 	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
	
	this.originalTransformMatrix = mat4.create();

 	this.transforms = [];

 	this.animation = null;

 	this.descendants = [];

 	this.lastTime = 0;
	


 }



Node.prototype.setMatrix = function () {

 	mat4.identity(this.transformMatrix);

 	for(var i = 0; i < this.transforms.length; i++) {

 		switch (this.transforms[i].constructor) {
 			case Translation :
 				var x = this.transforms[i].x;
 				var y = this.transforms[i].y;
 				var z = this.transforms[i].z;

 				mat4.translate(this.transformMatrix, this.transformMatrix, [x, y, z]);
 				break;
 			case Scale :
 				var sx = this.transforms[i].sx;
 				var sy = this.transforms[i].sy;
 				var sz = this.transforms[i].sz;
 				
 				mat4.scale(this.transformMatrix, this.transformMatrix, [sx, sy, sz]);
 				break;
 			case Rotation :
 				switch(this.transforms[i].axis) {

				case 'y':
					mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [0,1,0]);
					break;
				case 'x':
					mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [1,0,0]);
					break;
				case 'z':
					mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [0,0,1]);
					break;
				default:
					throw new Error('There is no axis ' + childrenArray[i].attributes.getNamedItem("axis").value + ' .lsx not well formed');
					break;
				}
 				break;

 		}
 	}

	mat4.copy(this.originalTransformMatrix, this.transformMatrix);
};


Node.prototype.animate = function (currTime, expectedUpdatePeriod) {

	if(this.lastTime > 0) {
		
		
		var deltaTime = currTime - this.lastTime;


		if(!updatePeriodDiffers(deltaTime, expectedUpdatePeriod))
			if(this.animation.constructor == CircularAnimation) {
			  if( this.animation.initialRotAngle < this.animation.rotationAngle) {
				  
				mat4.copy(this.transformMatrix, this.originalTransformMatrix);
				mat4.translate(this.transformMatrix, this.transformMatrix, [this.animation.center[0], this.animation.center[1], this.animation.center[2]]);
			 	
				var angleToBeRotated = deltaTime * this.animation.rotationAngle / this.animation.span;
				
				this.animation.initialAngle += angleToBeRotated;

			  	this.animation.initialRotAngle += angleToBeRotated;
				

			  	var x = this.animation.radius * Math.sin(this.animation.initialRotAngle);
			  	var z = this.animation.radius * Math.cos(this.animation.initialRotAngle);
				
				mat4.translate(this.transformMatrix, this.transformMatrix, [x, 0, z]);
				mat4.rotate(this.transformMatrix, this.transformMatrix, this.animation.initialAngle, [0, 1, 0]);
				
			  }
				
			} else if (this.animation.constructor == LinearAnimation) {
				

				for (var i = 0; i < this.animation.controlPoints.length; i++) {

					if ( this.animation.initialControlPoint[i] < this.animation.controlPointDistance[i]) {
						
						
						mat4.copy(this.transformMatrix, this.originalTransformMatrix);
						
						
						if(this.animation.initialControlPoint[i] == 0) {

							if(this.animation.controlPoints[i][2] != 0 && this.animation.controlPoints[i][0] != 0) {
								
								mat4.identity(this.animation.rotationMatrix);

								this.initialRotation = Math.asin(this.animation.controlPoints[i][0] / this.animation.controlPoints[i][2]);

								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);

							} else if(this.animation.controlPoints[i][2] == 0 && this.animation.controlPoints[i][0] != 0) {

								mat4.identity(this.animation.rotationMatrix);

								var sign = this.animation.controlPoints[i][0] && this.animation.controlPoints[i][0] / Math.abs(this.animation.controlPoints[i][0]);

								this.initialRotation = sign * toRadian(90);

								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);
								
							} else if (this.animation.controlPoints[i][2] != 0 && this.animation.controlPoints[i][0] == 0){

								mat4.identity(this.animation.rotationMatrix);

								if (this.animation.controlPoints[i][2] > 0)
									this.initialRotation = 0;
								else
									this.initialRotation = toRadian(180);

								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);

							} else {
								mat4.identity(this.animation.rotationMatrix);
								
								this.initialRotation = 0;
								
								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);
							}
						}
						
								
						var distance = this.animation.velocity * deltaTime;

						this.animation.initialControlPoint[i] += distance;
						
						var distance2 = 0;

						if(this.animation.initialControlPoint[i] > this.animation.controlPointDistance[i]) {
							distance2 = (this.animation.initialControlPoint[i] - this.animation.controlPointDistance[i]);
						}

						distance -= distance2;
						this.animation.initialControlPoint[i] -= distance2;



						var distanceVar = Math.sqrt(distance / (Math.pow(this.animation.controlPoints[i][0], 2) +  
							Math.pow(this.animation.controlPoints[i][1], 2) +
							Math.pow(this.animation.controlPoints[i][2], 2)));


						var x = this.animation.controlPoints[i][0] * distanceVar;
						var y = this.animation.controlPoints[i][1] * distanceVar;
						var z = this.animation.controlPoints[i][2] * distanceVar;
						
					
							
						mat4.translate(this.animation.translationMatrix, this.animation.translationMatrix, [x, y, z]);
						
						
						mat4.multiply(this.transformMatrix, this.transformMatrix, this.animation.translationMatrix);
						
						mat4.multiply(this.transformMatrix, this.transformMatrix, this.animation.rotationMatrix);
						
						i = this.animation.controlPoints.length;
					} 
				}
			}
		}

		this.lastTime = currTime;
}



function updatePeriodDiffers(currTime, expectedUpdatePeriod) {
    return currTime > (expectedUpdatePeriod + 50);
}