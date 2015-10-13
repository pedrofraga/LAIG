/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyObject(scene, rootNode, leaves) {
	CGFobject.call(this,scene);

	this.rootNode = rootNode;
	this.leaves = leaves;

};

MyObject.prototype = Object.create(CGFobject.prototype);
MyObject.prototype.constructor= MyObject;

MyObject.prototype.display = function () {
	this.displayRoot(this.rootNode, []);
};


MyObject.prototype.displayRoot = function (rootNode, transf){
	
	if(rootNode != null){

		for(var a = 0; a < this.leaves.length; a++){
			if(rootNode.id == this.leaves[a].id)
					return rootNode.id;
		}

		for(var i = 0; i < rootNode.transforms.length; i++){
			transf.push(rootNode.transforms[i]);
		}

		for(var i = 0; i < rootNode.descendants.length; i++){

			var transfClone = [];
			
			transfClone = transf.slice(0);
			
			var returnValue = this.displayRoot(rootNode.descendants[i], transfClone);
			
					
					for(var a = 0; a < this.leaves.length; a++){
						if(this.leaves[a].id == returnValue){
							if(this.leaves[a].type == "rectangle"){
								this.scene.pushMatrix();
								var object = new Square(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), parseFloat(this.leaves[a].args[2]), parseFloat(this.leaves[a].args[3]));
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
							}else if(this.leaves[a].type == "cylinder"){
								var object2 = new Cylinder(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), parseFloat(this.leaves[a].args[2]), parseFloat(this.leaves[a].args[3]), parseFloat(this.leaves[a].args[4]));
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
							}else if(this.leaves[a].type == "sphere"){
								var object3 = new MySphere(this.scene, this.leaves[a].args);
								
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
								object3.display();
								this.scene.popMatrix();
							}
							
						}
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