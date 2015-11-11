/*
  *	Node Class
  */

 function Node(id) {

 	this.id = id;

 	this.texture = null;
 	this.material = null;

 	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);

 	this.transforms = [];

 	this.animation = null;

 	this.descendants = [];

 	this.lastTime = 0;

 	this.inititalRotation = 0;

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


};


Node.prototype.animate = function (currTime, expectedUpdatePeriod) {

	if(this.lastTime > 0) {
		
		var deltaTime = currTime - this.lastTime;


		if(!updatePeriodDiffers(deltaTime, expectedUpdatePeriod))
			if(this.animation.constructor == CircularAnimation) {
			/*if(this.animatedObjects[i].transforms.length > 0)
				for(var j = 0; j < this.animatedObjects[i].transforms.length; j++) 
				if(this.animatedObjects[i].transforms[j].constructor == Translation) {
					this.animatedObjects[i].transforms[j].x += 1;
					this.animatedObjects[i].setMatrix();
				}
				*/
			} else if (this.animation.constructor == LinearAnimation) {

				for (var i = 0; i < this.animation.controlPoints.length; i++) {
					if ( this.animation.initialControlPoint[i] < this.animation.controlPointDistance[i]) {

						if(this.animation.initialControlPoint[0] == 0) {
							this.transforms[this.transforms.length] = new Translation(0 , 0 , 0);
						}

						if(this.animation.initialControlPoint[i] == 0) {

							if(this.animation.controlPoints[i][2] != 0 &&  this.animation.controlPoints[i][0] != 0) {
								
								if(this.animation.rotated)
									this.transforms.shift();

								this.initialRotation = Math.asin(this.animation.controlPoints[i][0] / this.animation.controlPoints[i][2]);

								this.transforms.unshift(new Rotation('y', this.initialRotation));
								this.animation.rotated = true;
							} else if(this.animation.controlPoints[i][2] == 0 && this.animation.controlPoints[i][0] != 0) {

								this.initialRotation = toRadian(90);
								this.transforms.unshift(new Rotation('y', this.initialRotation));
								this.animation.rotated = true;
								
							} else {
								if(this.animation.rotated)
									this.transforms.shift();
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



						var var1 = Math.sqrt(distance / (Math.pow(this.animation.controlPoints[i][0], 2) +  
							Math.pow(this.animation.controlPoints[i][1], 2) +
							Math.pow(this.animation.controlPoints[i][2], 2)));

						var x = this.animation.controlPoints[i][0] * var1;
						var y = this.animation.controlPoints[i][1] * var1;
						var z = this.animation.controlPoints[i][2] * var1;


						this.transforms[this.transforms.length - 1].x += x;
						this.transforms[this.transforms.length - 1].y += y;
						this.transforms[this.transforms.length - 1].z += z;

						this.setMatrix();
						console.log(this.transforms);

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