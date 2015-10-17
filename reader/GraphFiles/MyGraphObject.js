/**
 * MyGraphObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyGraphObject(scene, rootNode, leaves, textures, materials, transf) {
	CGFobject.call(this,scene);

	this.rootNode = rootNode;
	this.leaves = leaves;
	this.textures = textures;
	this.materials = materials;
	this.transf = transf;
	
	this.childObjects = [];
	
	this.getObjectsFromLeaves();
	this.getTextureAppearance();
	
	return;
};

MyGraphObject.prototype = Object.create(CGFobject.prototype);
MyGraphObject.prototype.constructor= MyGraphObject;

MyGraphObject.prototype.display = function () {
	this.displayTree(this.rootNode, this.transf, [], []);
};


MyGraphObject.prototype.displayTree = function (rootNode, transf, textur, mater){
	
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

							var textureApplied = false;

							for(var k = 0; k < this.textures.length; k++){
								if(this.textures[k].id == textur[textur.length - 1]){
									var cgfClone = clone(this.textures[k].cgfAppearance);
									for(var z = 0; z < this.materials.length; z++){
										if(this.materials[z].id == mater[mater.length -1]){
											this.materialApply(cgfClone, this.materials[z]);
											textureApplied = true;
										}
									}
									cgfClone.apply();
								}
							}

							/*if(!textureApplied){
								var cgfA = new CGFappearance(this.scene);
								for(var z = 0; z < this.materials.length; z++){
									if(this.materials[z].id == mater[mater.length -1]){
										this.materialApply(cgfA, this.materials[z]);
									}
								}
								cgfA.apply();
							}*/
							
							this.childObjects[j].object.display();
							this.scene.popMatrix();
						}
					}
					
			
		}
	}

	return 0;
}

MyGraphObject.prototype.getTextureAppearance = function (){
	for(var a = 0; a < this.textures.length; a++){
		var texture = new CGFappearance(this.scene);
		texture.setTextureWrap(this.textures[a].amplif_factor.s, this.textures[a].amplif_factor.t);
		texture.loadTexture(this.textures[a].path);
		this.textures[a].cgfAppearance = texture;
	}
}


MyGraphObject.prototype.materialApply = function (cgfClone, material){
	
	if(material.ambient != null){
		cgfClone.setAmbient(parseFloat(material.ambient.r), 
								parseFloat(material.ambient.g),
								parseFloat(material.ambient.b), 
								parseFloat(material.ambient.a));
	}

	if(material.specular != null){
		cgfClone.setSpecular(parseFloat(material.specular.r), 
								parseFloat(material.specular.g),
								parseFloat(material.specular.b), 
								parseFloat(material.specular.a));
	}

	if(material.diffuse != null){
		cgfClone.setDiffuse(parseFloat(material.diffuse.r), 
								parseFloat(material.diffuse.g),
								parseFloat(material.diffuse.b), 
								parseFloat(material.diffuse.a));
	}

	if(material.shininess != null){
		cgfClone.setShininess(parseFloat(material.shininess));
	}

}


MyGraphObject.prototype.getObjectsFromLeaves = function(){
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
							}else if(this.leaves[a].type == "triangle"){
								var object = new MyTriangle(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), parseFloat(this.leaves[a].args[2])
																		, parseFloat(this.leaves[a].args[3]), parseFloat(this.leaves[a].args[4]), parseFloat(this.leaves[a].args[5])
																		, parseFloat(this.leaves[a].args[6]), parseFloat(this.leaves[a].args[7]), parseFloat(this.leaves[a].args[8]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.childObjects.push(geometry);
							}
			
				
		}
}


MyGraphObject.prototype.rotate = function (rotation){
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

MyGraphObject.prototype.scale = function (scale){
	this.scene.scale(parseFloat(scale.sx), parseFloat(scale.sy), parseFloat(scale.sz));
}


MyGraphObject.prototype.translate = function (translation){
	this.scene.translate(parseFloat(translation.x), parseFloat(translation.y), parseFloat(translation.z));
}

MyGraphObject.prototype.toRadian = function (degrees){
	return parseFloat(degrees) * Math.PI / 180;
}

function clone( original )  
{
    // First create an empty object with
    // same prototype of our original source
    var clone = Object.create( Object.getPrototypeOf( original ) ) ;

    var i , keys = Object.getOwnPropertyNames( original ) ;

    for ( i = 0 ; i < keys.length ; i ++ )
    {
        // copy each property into the clone
        Object.defineProperty( clone , keys[ i ] ,
            Object.getOwnPropertyDescriptor( original , keys[ i ] )
        ) ;
    }

    return clone ;
}


function Geometry(object, id){
	this.object = object;
	this.id = id;
}