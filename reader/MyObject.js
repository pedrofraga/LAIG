/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyObject(scene, rootNode, leaves, textures, materials) {
	CGFobject.call(this,scene);

	this.rootNode = rootNode;
	this.leaves = leaves;
	this.textures = textures;
	this.materials = materials;
	
	this.childObjects = [];
	
	this.getObjectsFromLeaves();
	this.getTextureAppearance();
	
	return;
};

MyObject.prototype = Object.create(CGFobject.prototype);
MyObject.prototype.constructor= MyObject;

MyObject.prototype.display = function () {
	this.displayTree(this.rootNode, [], [], []);
};


MyObject.prototype.displayTree = function (rootNode, transf, textur, mater){
	
	if(rootNode != null){

		for(var a = 0; a < this.leaves.length; a++){
			if(rootNode.id == this.leaves[a].id)
					return rootNode.id;
		}

		for(var i = 0; i < rootNode.transforms.length; i++){
			transf.push(rootNode.transforms[i]);
		}
		
		if(rootNode.texture != null){
			textur.push(rootNode.texture);
		}
		
		if(rootNode.material != null){
			mater.push(rootNode.material);
		}

		for(var i = 0; i < rootNode.descendants.length; i++){

			var transfClone = [];
			
			transfClone = transf.slice(0);
			
			var texturClone = [];
			
			texturClone = textur.slice(0);
			
			var materClone = [];
			
			materClone = mater.slice(0);
			
			var returnValue = this.displayTree(rootNode.descendants[i], transfClone, texturClone, materClone);
			
					
					for(var j = 0; j < this.childObjects.length; j++){
						if(this.childObjects[j].id == returnValue){
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
							
							for(var k = 0; k < this.textures.length; k++){
								if(this.textures[k].id == textur[textur.length - 1]){
									var cgfClone =  this.textures[k].cgfAppearance.slice(0);
									for(var z = 0; z < this.materials.length; z++){
										if(this.materials[z].id == mater[mater.length -1]){
											this.materialApply(cgfClone, this.materials[z]);
											break;
										}
									}
									cgfAppearance.apply();
								}
							}
							
							
							this.childObjects[j].object.display();
							this.scene.popMatrix();
						}
					}
					
			
		}
	}

	return 0;
}

MyObject.prototype.getTextureAppearance = function (){
	for(var a = 0; a < this.textures.length; a++){
		var texture = new CGFappearance(this.scene);
		texture.setTextureWrap(this.textures[a].amplif_factor.s, this.textures[a].amplif_factor.t);
		texture.loadTexture(this.textures[a].path);
		this.textures[a].cgfAppearance = texture;
	}
}

MyObject.prototype.getObjectsFromLeaves = function(){
	for(var a = 0; a < this.leaves.length; a++){
			if(this.leaves[a].type == "rectangle"){
								var object = new Square(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), 
parseFloat(this.leaves[a].args[2]), parseFloat(this.leaves[a].args[3]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.childObjects.push(geometry);
							}else if(this.leaves[a].type == "cylinder"){
								var object = new Cylinder(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), 
parseFloat(this.leaves[a].args[2]), parseFloat(this.leaves[a].args[3]), 
parseFloat(this.leaves[a].args[4]));								
								var geometry = new Geometry(object, this.leaves[a].id);
								this.childObjects.push(geometry);
							}else if(this.leaves[a].type == "sphere"){
								var object = new MySphere(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), parseFloat(this.leaves[a].args[2]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.childObjects.push(geometry);
							}
			
				
		}
}

MyObject.prototype.materialApply = function (cgfAppearance, material){
	
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


function Geometry(object, id){
	this.object = object;
	this.id = id;
}