
/**
 * Object to contain all graph info and to display it
 * @constructor MyGraphObject
 * @param  {scene}      scene     scene to display
 * @param  {Node}      rootNode  root node
 * @param  {array}      leaves    primitives array
 * @param  {array}      textures  textures array
 * @param  {array}      materials textures array
 * @param  {array}      transf    array with intial transformations
 */
function MyGraphObject(scene, rootNode, leaves, textures, materials, transf) {
	CGFobject.call(this,scene);

	this.rootNode = rootNode;
	this.leaves = leaves;
	this.textures = textures;
	this.materials = materials;
	this.transf = transf;

	this.primitives = [];

	this.animatedObjects = [];

	this.texturesLoaded = false;

	this.getObjectsFromLeaves();
	this.getTextureAppearance();

	return;
};

MyGraphObject.prototype = Object.create(CGFobject.prototype);
MyGraphObject.prototype.constructor= MyGraphObject;

/**
 * Method to display graph
 * @method display
 */
MyGraphObject.prototype.display = function () {
	this.displayTree(this.rootNode, this.transf, [], []);
};

/**
 * Recursive function to display tree
 * @method displayTree
 * @param  {Node}    rootNode Node to be displayed
 * @param  {array}    transf   array with transforms
 * @param  {array}    textur   array of textures
 * @param  {array}    mater    array of materials
 * @return {string/int}            return id of leaf (string), or 0 if okay
 */
MyGraphObject.prototype.displayTree = function (rootNode, transf, textur, mater){

	if(rootNode != null){

		for(var a = 0; a < this.leaves.length; a++){
			if(rootNode.id == this.leaves[a].id)
					return rootNode.id;
		}

		mat4.multiply(transf, transf, rootNode.transformMatrix);


		if(rootNode.animation != null) {

			if(!containsObject(rootNode, this.animatedObjects)) {
				this.animatedObjects.push(rootNode);
			}
		}

		if(rootNode.texture != null) {
			textur.push(rootNode.texture);
		}

		if(rootNode.material != null) {
			mater.push(rootNode.material);
		}

		if(textur.length > 0)
			if(textur[textur.length - 1] == "clear")
				textur = [];

		for(var i = 0; i < rootNode.descendants.length; i++) {

			var transfClone = mat4.create();

			mat4.copy(transfClone, transf);

			var texturClone = [];

			texturClone = textur.slice(0);

			var materClone = [];

			materClone = mater.slice(0);

			var returnValue = this.displayTree(rootNode.descendants[i], transfClone, texturClone, materClone);


					for(var j = 0; j < this.primitives.length; j++){
						if(this.primitives[j].id == returnValue){
							this.scene.pushMatrix();
							
							this.scene.multMatrix(transf);

							var texture = this.getTextureId(textur);
							textur.reverse();
							var material = this.getMaterialId(mater);
							mater.reverse();

							var textureApplied = false;
							var texCoordsChanged = false;
							for(var k = 0; k < this.textures.length; k++){
								if(this.textures[k].id == texture){
									var cgfClone = clone(this.textures[k].cgfAppearance);
									if(this.textures[k].amplif_factor.s != 1 || this.textures[k].amplif_factor.t != 1){
										this.primitives[j].object.scaleTexCoords(this.textures[k].amplif_factor.s, this.textures[k].amplif_factor.t);
										texCoordsChanged = true;
									}

									for(var z = 0; z < this.materials.length; z++){
										if(this.materials[z].id == material){
											this.materialApply(cgfClone, this.materials[z]);
											break;
										}
									}
									textureApplied = true;
									cgfClone.apply();
									break;
								}
							}

							if(!textureApplied){
								var cgfApp = new CGFappearance(this.scene);
								for(var z = 0; z < this.materials.length; z++){
									if(this.materials[z].id == material){
										this.materialApply(cgfApp, this.materials[z]);
										break;
									}
								}
								cgfApp.apply();
							}
							this.primitives[j].object.display();
							this.scene.popMatrix();

							if(texCoordsChanged){
								this.primitives[j].object.texCoords = this.primitives[j].object.originalTexCoords.slice();
								this.primitives[j].object.updateTexCoordsGLBuffers();
							}

						}
					}


		}
	}

	return 0;
}
/**load textures to appearance */
MyGraphObject.prototype.getTextureAppearance = function (){
	for(var a = 0; a < this.textures.length; a++){
		var texture = new CGFappearance(this.scene);
		texture.loadTexture(this.textures[a].path);
		this.textures[a].cgfAppearance = texture;
	}

	this.texturesLoaded = true;
}
/**
 * get last texture valid id
 * @method getTextureId
 * @param  {array}     textures 	array with textures id
 * @return {string}              string with texture id to be used
 */
MyGraphObject.prototype.getTextureId= function (textures){

	textures.reverse();
	for(var a = 0; a < textures.length; a++){
		if(textures[a] != "null"){
			return textures[a];
		}
	}
}

/**
 * get last material valid id
 * @method getMaterialId
 * @param  {array}     materials 	array with materials id
 * @return {string}              string with materials id to be used
 */
MyGraphObject.prototype.getMaterialId= function (materials){

	materials.reverse();
	for(var a = 0; a < materials.length; a++){
		if(materials[a] != "null"){
			return materials[a];
		}
	}
}

/**
 * method to apply a material
 * @method materialApply
 * @param  {CGFappearance}      cgfClone 	clone of CGFappearance to apply material
 * @param  {Material}      material 	material to be applied
 */
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

	if(material.emission != null){
		cgfClone.setEmission(parseFloat(material.emission.r),
								parseFloat(material.emission.g),
								parseFloat(material.emission.b),
								parseFloat(material.emission.a));
	}


}

/**
 * function to build primitives
 * @method getObjectsFromLeaves
 */
MyGraphObject.prototype.getObjectsFromLeaves = function(){
	for(var a = 0; a < this.leaves.length; a++){
			if(this.leaves[a].type == "rectangle"){
								var object = new Square(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]),
parseFloat(this.leaves[a].args[2]), parseFloat(this.leaves[a].args[3]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.primitives.push(geometry);
							}else if(this.leaves[a].type == "cylinder"){
								var object = new Cylinder(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]),
parseFloat(this.leaves[a].args[2]), parseFloat(this.leaves[a].args[3]),
parseFloat(this.leaves[a].args[4]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.primitives.push(geometry);
							}else if(this.leaves[a].type == "sphere"){
								var object = new MySphere(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), parseFloat(this.leaves[a].args[2]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.primitives.push(geometry);
							}else if(this.leaves[a].type == "triangle"){
								var object = new MyTriangle(this.scene, parseFloat(this.leaves[a].args[0]), parseFloat(this.leaves[a].args[1]), parseFloat(this.leaves[a].args[2])
																		, parseFloat(this.leaves[a].args[3]), parseFloat(this.leaves[a].args[4]), parseFloat(this.leaves[a].args[5])
																		, parseFloat(this.leaves[a].args[6]), parseFloat(this.leaves[a].args[7]), parseFloat(this.leaves[a].args[8]));
								var geometry = new Geometry(object, this.leaves[a].id);
								this.primitives.push(geometry);
							}else if(this.leaves[a].type == "patch") {

								var object = new Patch(this.scene, this.leaves[a]);
								var geometry = new Geometry(object, this.leaves[a].id);
								this.primitives.push(geometry);
								
							}else if(this.leaves[a].type == "terrain") {
								var object = new Terrain(this.scene, this.leaves[a]);
								var geometry = new Geometry(object, this.leaves[a].id);
								this.primitives.push(geometry);
							}


		}
}
/**
 * function to clone a object
 * @method clone
 */
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

/**
 * constructor of geometry object
 * @constructor Geometry
 * @param  {CGFobject} object object to be displayed
 * @param  {string} id     string of id
 */
function Geometry(object, id){
	this.object = object;
	this.id = id;
}


function containsObject(obj, list) {

    for (var i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}



MyGraphObject.prototype.update = function(currTime, expectedUpdatePeriod) {

	for(var i = 0; i < this.animatedObjects.length; i++) {

		this.animatedObjects[i].animate(currTime, expectedUpdatePeriod);

	}

}
