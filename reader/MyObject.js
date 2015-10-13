/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyObject(scene, rootNode) {
	CGFobject.call(this,scene);

	this.rootNode = rootNode;

};

MyObject.prototype = Object.create(CGFobject.prototype);
MyObject.prototype.constructor= MyObject;

MyObject.prototype.display = function () {
	this.displayRoot(this.rootNode, []);
};


MyObject.prototype.displayRoot = function (rootNode, transf){
	
	if(rootNode != null){

		if(rootNode.id == "square" || 
			rootNode.id == "sphere" || 
			rootNode.id == "cylinder")
				return rootNode.id;

		for(var i = 0; i < rootNode.transforms.length; i++){
			transf.push(rootNode.transforms[i]);
		}

		for(var i = 0; i < rootNode.descendants.length; i++){

			var transfClone = [];
			
			transfClone = transf.slice(0);
			
			var returnValue = this.displayRoot(rootNode.descendants[i], transfClone);
			

			switch(returnValue){
				case "square":

					this.scene.pushMatrix();
					var object = new Square(this.scene, 0, 1, 1, 0);
					
					for(var a = 0; a < transf.length; a++){
						if(transf[a].constructor.name == "Rotation"){
							this.rotate(transf[a]);
						}else if(transf[a].constructor.name == "Translation"){
							this.translate(transf[a]);
						}else if(transf[a].constructor.name == "Scale"){
							this.scale(transf[a]);
						}
					}
					

					object.display();
					this.scene.popMatrix();

					break;
				case "sphere":
					break;
				case "cylinder":
					var object2 = new Cylinder(this.scene, 25, 20);
					this.scene.pushMatrix();
					for(var a = 0; a < transf.length; a++){
						if(transf[a].constructor.name == "Rotation"){
							this.rotate(transf[a]);
						}else if(transf[a].constructor.name == "Translation"){
							this.translate(transf[a]);
						}else if(transf[a].constructor.name == "Scale"){
							this.scale(transf[a]);
						}
					}
					object2.display();
					this.scene.popMatrix();
					break;
			}
			
		}
	}

	return 0;
}


MyObject.prototype.rotate = function (rotation){
	switch (rotation.axis){
		case "x":
			this.scene.rotate(this.toRadian(rotation.angle),1,0,0);
			break;
		case "y":
			this.scene.rotate(this.toRadian(rotation.angle),0,1,0);
			break;
		case "z":
			this.scene.rotate(this.toRadian(rotation.angle),0,0,1);
			break;
		default:
			console.error("there is no " + rotation.axis + " axis");
			break;
	}
}

MyObject.prototype.scale = function (scale){
	this.scene.scale(parseFloat(scale.sx), parseFloat(scale.sy), parseFloat(scale.sz));
}


MyObject.prototype.translate = function (translation){
	this.scene.translate(parseFloat(translation.x), parseFloat(translation.y), parseFloat(translation.z));
}

MyObject.prototype.toRadian = function (degrees){
	return parseFloat(degrees) * Math.PI / 180;
}