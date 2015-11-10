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


Node.prototype.animate = function (currTime) {

	if(this.lastTime > 0) {
		var deltaTime = currTime - this.lastTime;

		if(this.animation.constructor == CircularAnimation) {
			/*if(this.animatedObjects[i].transforms.length > 0)
				for(var j = 0; j < this.animatedObjects[i].transforms.length; j++) 
				if(this.animatedObjects[i].transforms[j].constructor == Translation) {
					this.animatedObjects[i].transforms[j].x += 1;
					this.animatedObjects[i].setMatrix();
				}
				*/
		} else if (this.animation.constructor == LinearAnimation) {

			if(this.animation.elapsedSpan < this.animation.span) {
				this.animation.elapsedSpan += deltaTime;
				for (var i = 0; i < this.animation.controlPoints.length; i++) {
					if ( this.animation.initialControlPoint[i] < this.animation.controlPointDistance[i]) {
						
						var distance = this.animation.velocity * deltaTime;

						var var1 = Math.sqrt(distance / (Math.pow(this.animation.controlPoints[i][0], 2) +  
															Math.pow(this.animation.controlPoints[i][1], 2) +
																Math.pow(this.animation.controlPoints[i][2], 2)));

						var x = this.animation.controlPoints[i][0] * var1;
						var y = this.animation.controlPoints[i][1] * var1;
						var z = this.animation.controlPoints[i][2] * var1;

						mat4.translate(this.transformMatrix, this.transformMatrix, [x, y, z]);

						this.animation.initialControlPoint[i] += distance;

						if(this.animation.initialControlPoint[i] > this.animation.controlPointDistance[i])
							this.animation.initialControlPoint[i + 1] += (Math.abs(this.animation.initialControlPoint[i] - this.animation.controlPointDistance[i]));

						i = this.animation.controlPoints.length;
					} 
				}

			}
		}
	}

	this.lastTime = currTime;

}
