
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;
	
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	 this.reader.open('scenes/'+filename, this);  
	}

/*
 * Callback to be executed after successful reading
 */
 MySceneGraph.prototype.onXMLReady=function() 
 {
 	console.log("XML Loading finished.");
 	var rootElement = this.reader.xmlDoc.documentElement;
 	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parser(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};




MySceneGraph.prototype.parser= function(rootElement) {
	
	//getting initials node

	var initials = rootElement.getElementsByTagName('INITIALS');

	if(initials == null){
		return 'initials element is missing';
	}

	if(initials.length != 1){
		return "either zero or more than one initials element found.";
	}

	this.frustum = [];
	this.rotation = [];
	this.translation = [];
	this.scale = [];
	this.reference;

	getInitials(initials, this.frustum, this.translation, this.rotation, this.scale, this.reference);

	// getting illumination node
	var illumination =  rootElement.getElementsByTagName('ILLUMINATION');

	if (illumination == null) {
		return "illumi element is missing.";
	}

	if (illumination.length != 1) {
		return "either zero or more than one 'illumi' element found.";
	}

	this.ambient = [];
	this.background = [];
	
	
	getIllumination(illumination, this.ambient, this.background);
	
	this.lightsArray = [];

	getLights(rootElement, this.lightsArray);

	this.leavesArray = [];

	this.texturesArray = [];

	getTextures(rootElement, this.texturesArray);

	this.materialsArray = [];

	getMaterials(rootElement, this.materialsArray);

	getLeaves(rootElement, this.leavesArray);

	this.geometryObjects = [];

	this.rootNode = getGeometryNodes(rootElement, this.leavesArray);
	
	if(this.rootNode == null){
		return ".lsx file it's not well formed";
	}

};

/*
 * Callback to be executed on any read error
 */
 
 
 MySceneGraph.prototype.onXMLError=function (message) {
 	console.error("XML Loading Error: "+message);	
 	this.loadedOk=false;
 };


/*
*	Some more needed
*	functions
*
*/

function getInitials(initials, frustum, translation, rotation, scale, reference){

	if(initials[0].getElementsByTagName('frustum')[0] != null){
		var initialsFrustum = initials[0].getElementsByTagName('frustum')[0];
		frustum['near'] = initialsFrustum.attributes.getNamedItem("near").value;
		frustum['far'] = initialsFrustum.attributes.getNamedItem("far").value;
	}

	if(initials[0].getElementsByTagName('translation')[0] != null){
		for(var i = 0; i < initials[0].getElementsByTagName('translation').length; i++){
			var initialsTransl = initials[0].getElementsByTagName('translation')[i];
			var t = new Translation(parseFloat(initialsTransl.attributes.getNamedItem("x").value),
				parseFloat(initialsTransl.attributes.getNamedItem("y").value),
				parseFloat(initialsTransl.attributes.getNamedItem("z").value));
			translation[i] = t;
		}
	}

	if(initials[0].getElementsByTagName('rotation')[0] != null){
		for(var i = 0; i < initials[0].getElementsByTagName('rotation').length; i++){
			var initialsRot = initials[0].getElementsByTagName('rotation')[i];
			var r = new Rotation(initialsRot.attributes.getNamedItem("axis").value,
				parseFloat(initialsRot.attributes.getNamedItem("angle").value));
			rotation[i] = r;
		}
	}

	if(initials[0].getElementsByTagName('scale')[0] != null){
		for(var i = 0; i < initials[0].getElementsByTagName('scale').length; i++){
			var initialsScale = initials[0].getElementsByTagName('scale')[i];
			var s = new Scale(parseFloat(initialsScale.attributes.getNamedItem("sx").value),
				parseFloat(initialsScale.attributes.getNamedItem("sy").value),
				parseFloat(initialsScale.attributes.getNamedItem("sz").value));
			scale[i] = s;
		}
	}

	if(initials[0].getElementsByTagName('reference')[0] != null){
		var initialsRef = initials[0].getElementsByTagName('reference')[0];
		reference = initialsRef.attributes.getNamedItem("length").value;
	}

}


function getIllumination(illumination, ambient, background){


	if(illumination[0].getElementsByTagName('ambient')[0] != null){
		var illumiAmbient = illumination[0].getElementsByTagName('ambient')[0];
		ambient['r'] = illumiAmbient.attributes.getNamedItem("r").value;
		ambient['g'] = illumiAmbient.attributes.getNamedItem("g").value;
		ambient['b'] = illumiAmbient.attributes.getNamedItem("b").value;
		ambient['a']= illumiAmbient.attributes.getNamedItem("a").value;
	}

	if(illumination[0].getElementsByTagName('background')[0] != null){
		var illumiBackground = illumination[0].getElementsByTagName('background')[0];
		background['r'] = illumiBackground.attributes.getNamedItem("r").value;
		background['g'] = illumiBackground.attributes.getNamedItem("g").value;
		background['b'] = illumiBackground.attributes.getNamedItem("b").value;
		background['a']= illumiBackground.attributes.getNamedItem("a").value;
	}
}

function getTextures(rootElement, texturesArray){

	var textures =  rootElement.getElementsByTagName('TEXTURES');
	
	if (textures == null) {
		console.log("textures element is missing.");
		return;
	}

	if (textures.length != 1) {
		console.error("Either 0 or more than 1 'textures' elements found, textures were not loaded");
		return;
	}

	var lsxTexturesArray = textures[0].getElementsByTagName('TEXTURE');
	
	if (lsxTexturesArray == null) {
		console.log("texturesArray element is missing.");
		return;
	}

	if (lsxTexturesArray.length == 0) {
		console.error("zero 'texturesArray' elements found.");
		return;
	}
	
	for(var i = 0; i < lsxTexturesArray.length; i++){
		
		var id = lsxTexturesArray[i].attributes.getNamedItem("id").value;
		
		if(lsxTexturesArray[i].getElementsByTagName('file')[0] != null){
			var fileTexture = lsxTexturesArray[i].getElementsByTagName('file')[0];
			var path = fileTexture.attributes.getNamedItem("path").value;
		}


		if(lsxTexturesArray[i].getElementsByTagName('amplif_factor')[0] != null){
			var amplif_factorTexture = lsxTexturesArray[i].getElementsByTagName('amplif_factor')[0];
			var amplif_factor = new Amplif(amplif_factorTexture.attributes.getNamedItem("s").value
				,amplif_factorTexture.attributes.getNamedItem("t").value)		
		}

		var texture = new Texture(id, path, amplif_factor);
		texturesArray[i] = texture;

	}
	
}

function getMaterials(rootElement, materialsArray){

	var materials =  rootElement.getElementsByTagName('MATERIALS');
	
	if (materials == null) {
		console.log("materials element is missing.");
		return;
	}

	if (materials.length != 1) {
		console.error("Either 0 or more than 1 'materials' elements found, materials were not loaded");
		return;
	}

	var lsxMaterialsArray = materials[0].getElementsByTagName('MATERIAL');
	
	if (lsxMaterialsArray == null) {
		console.log("materialsArray element is missing.");
		return;
	}

	if (lsxMaterialsArray.length == 0) {
		console.error("zero 'materialsArray' elements found.");
		return;
	}

	
	for(var i = 0; i < lsxMaterialsArray.length; i++){
		
		var id = lsxMaterialsArray[i].attributes.getNamedItem("id").value;
		

		if(id != "null"){
			if(lsxMaterialsArray[i].getElementsByTagName('shininess')[0] != null){
				var shininessMaterial = lsxMaterialsArray[i].getElementsByTagName('shininess')[0];
				var shininess = shininessMaterial.attributes.getNamedItem("value").value;
			}


			if(lsxMaterialsArray[i].getElementsByTagName('specular')[0] != null){
				var specularMaterial = lsxMaterialsArray[i].getElementsByTagName('specular')[0];
				var specular = new RGBA(specularMaterial.attributes.getNamedItem("r").value
					,specularMaterial.attributes.getNamedItem("g").value
					,specularMaterial.attributes.getNamedItem("b").value
					,specularMaterial.attributes.getNamedItem("a").value);
			}
			if(lsxMaterialsArray[i].getElementsByTagName('diffuse')[0] != null){
				var diffuseMaterial = lsxMaterialsArray[i].getElementsByTagName('diffuse')[0];
				var diffuse = new RGBA(diffuseMaterial.attributes.getNamedItem("r").value
					,diffuseMaterial.attributes.getNamedItem("g").value
					,diffuseMaterial.attributes.getNamedItem("b").value
					,diffuseMaterial.attributes.getNamedItem("a").value);
			}
			if(lsxMaterialsArray[i].getElementsByTagName('ambient')[0] != null){
				var ambientMaterial = lsxMaterialsArray[i].getElementsByTagName('ambient')[0];
				var ambient = new RGBA(ambientMaterial.attributes.getNamedItem("r").value
					,ambientMaterial.attributes.getNamedItem("g").value
					,ambientMaterial.attributes.getNamedItem("b").value
					,ambientMaterial.attributes.getNamedItem("a").value);
			}
			if(lsxMaterialsArray[i].getElementsByTagName('emission')[0] != null){
				var emissionMaterial = lsxMaterialsArray[i].getElementsByTagName('emission')[0];
				var emission = new RGBA(emissionMaterial.attributes.getNamedItem("r").value
					,emissionMaterial.attributes.getNamedItem("g").value
					,emissionMaterial.attributes.getNamedItem("b").value
					,emissionMaterial.attributes.getNamedItem("a").value);
			}


			var material = new Material(id, shininess, specular, diffuse, ambient, emission);
			materialsArray[i] = material;
		}
	}
	
}



function getLights(rootElement, lightsArray){

	var lights =  rootElement.getElementsByTagName('LIGHTS');
	
	if (lights == null) {
		console.log("lights element is missing.");
		return;
	}

	if (lights.length != 1) {
		console.error("Either 0 or more than 1 'lights' elements found, lights were not loaded");
		return;
	}

	var lsxLightsArray = lights[0].getElementsByTagName('LIGHT');
	
	if (lsxLightsArray == null) {
		console.log("lightsArray element is missing.");
		return;
	}

	if (lsxLightsArray.length == 0) {
		console.error("zero 'lightsArray' elements found.");
		return;
	}

	for(var i = 0; i < lsxLightsArray.length; i++){
		
		var id = lsxLightsArray[i].attributes.getNamedItem("id").value; 

		if(lsxLightsArray[i].getElementsByTagName('enable')[0] != null){
			var lightEnabled = lsxLightsArray[i].getElementsByTagName('enable')[0];
			var enabled = lightEnabled.attributes.getNamedItem("value").value;
		}else{
			var enabled = null;
		}

		if(lsxLightsArray[i].getElementsByTagName('position')[0] != null){
			var lightPosition = lsxLightsArray[i].getElementsByTagName('position')[0];
			var position = new Position(lightPosition.attributes.getNamedItem("x").value
				, lightPosition.attributes.getNamedItem("y").value
				, lightPosition.attributes.getNamedItem("z").value
				, lightPosition.attributes.getNamedItem("w").value);
		}else{
			var position = null;
		}
		
		if(lsxLightsArray[i].getElementsByTagName('ambient')[0] != null){
			var lightAmbient = lsxLightsArray[i].getElementsByTagName('ambient')[0];
			var ambient = new RGBA(lightAmbient.attributes.getNamedItem("r").value
				,lightAmbient.attributes.getNamedItem("g").value
				,lightAmbient.attributes.getNamedItem("b").value
				,lightAmbient.attributes.getNamedItem("a").value);
		}else{
			var ambient = null;
		}

		if(lsxLightsArray[i].getElementsByTagName('diffuse')[0] != null){
			var lightDiffuse = lsxLightsArray[i].getElementsByTagName('diffuse')[0];
			var diffuse = new RGBA(lightDiffuse.attributes.getNamedItem("r").value
				,lightDiffuse.attributes.getNamedItem("g").value
				,lightDiffuse.attributes.getNamedItem("b").value
				,lightDiffuse.attributes.getNamedItem("a").value);
		}else{
			var diffuse = null;
		}


		if(lsxLightsArray[i].getElementsByTagName('specular')[0] != null){
			var lightSpecular = lsxLightsArray[i].getElementsByTagName('specular')[0];
			var specular = new RGBA(lightSpecular.attributes.getNamedItem("r").value
				,lightSpecular.attributes.getNamedItem("g").value
				,lightSpecular.attributes.getNamedItem("b").value
				,lightSpecular.attributes.getNamedItem("a").value);
		}else{
			var specular = null;
		}

		if(lsxLightsArray[i].getElementsByTagName('shininess')[0] != null){
			var lightShininess = lsxLightsArray[i].getElementsByTagName('shininess')[0];
			var shininess = lightShininess.attributes.getNamedItem("value").value;
		}else{
			var shininess = null;
		}
		
		
		
		
		var light = new Light(id, enabled, position, ambient, diffuse, specular, shininess);
		lightsArray[i] = light;
	}
}


function getLeaves(rootElement, leavesArray) {
	var leaves = rootElement.getElementsByTagName('LEAVES');

	if (leaves == null) {
		console.log("leaves element is missing.");
		return;
	}

	if (leaves.length != 1) {
		console.error("Either 0 or more than 1 'leaves' elements found.");
		return;
	}

	var lsxLeavesArray = leaves[0].getElementsByTagName('LEAF');

	if (lsxLeavesArray == null) {
		console.log("there is no leaf elements");
		return;
	}

	if (lsxLeavesArray.length == 0) {
		console.error("0 LEAF elements found, there is a leaves node but not a leaf element");
		return;
	}

	for(var i = 0; i < lsxLeavesArray.length; i++){

		var type = lsxLeavesArray[i].attributes.getNamedItem("type").value;
		var id = lsxLeavesArray[i].attributes.getNamedItem("id").value;
		var args = lsxLeavesArray[i].attributes.getNamedItem("args").value.match(/[^ ]+/g);

		var object = new Leaf(id, type, args);
		leavesArray[i] = object;
	}
}


function getGeometryNodes(rootElement, leavesArray){
	var nodes = rootElement.getElementsByTagName("NODES");
	
	if(nodes == null){
		console.log("There's not a \"nodes\" tag");
		return;
	}
	
	if(nodes.length != 1){
		console.error("There's more than 1 \"nodes\" tag, geometry nodes were not loaded");
		return;
	}
	
	var rootNode = nodes[0].getElementsByTagName('ROOT');
	
	if(rootNode == null){
		console.error("Couldn't read \"ROOT\" element from .lsx file");
		return;
	}
	
	if(rootNode.length != 1){
		console.error("either there is 0 or more than 1 \"ROOT\" node, couldn't build a geometry");
		return;
	}
	
	var rootID = rootNode[0].attributes.getNamedItem("id").value;
	
	var lsxNodesArray = nodes[0].getElementsByTagName('NODE');
	
	if(lsxNodesArray == null){
		console.log("Couldn't read a single \"node\" element from .lsx file");
		return;
	}
	
	if(lsxNodesArray.length == 0){
		console.error("there's not \"node\" elements");
		return;
	}
	
	returnRootNode = new Node(rootID);
	
	if(constructTree(lsxNodesArray, leavesArray, returnRootNode) == -1){
		console.error("please reconstruct your .lsx file");
		returnRootNode = null;
	}
	
	
	return returnRootNode;
}

MySceneGraph.prototype.nodeExistInGeometrical = function(id) {
	for(var i = 0; i < this.geometryObjects.length; i++){
		if(this.geometryObjects[i].id == id)
			return this.geometryObjects[i];
	}
	return null;
}


function getGeometry(lsxNodesArray, leavesArray, root, i){
	var descendants = lsxNodesArray[i].getElementsByTagName("DESCENDANTS");
	
	if(descendants == null){
		console.error("node with id " + root.id + " has no descendants, geometry scene was not loaded");
		return -1;
	}
	
	if(descendants.length != 1){
		console.error("node with id " + root.id + " either has 0 or more than 1 \"DESCENDANTS\" tags, scene was not loaded");
		return -1;
	}
	
	var lsxDescendantsArray = descendants[0].getElementsByTagName("DESCENDANT");
	
	for(var i = 0; i < lsxDescendantsArray.length; i++){
		if(lsxDescendantsArray[i].attributes.getNamedItem("id") != null){
			var id = lsxDescendantsArray[i].attributes.getNamedItem("id").value;
			var result = this.nodeExistInGeometrical(id);
			if(result == null){
				root.descendants[i] = result;
			}else{
				var node = new Node(id);
				root.descendants[i] = node;

				for(var a = 0; a < lsxNodesArray.length; a++){
					if(lsxNodesArray[a].attributes.getNamedItem("id").value == id){
						if(getNodeInfo(lsxNodesArray[a], root.descendants[i]) == -1) return -1;
						break;
					}
				}
				var isGeometrical = constructTree(lsxNodesArray, leavesArray, root.descendants[i]);
				if(isGeometrical == -1){
					return -1;
				}else if(isGeometrical == 0){
					this.geometryObjects.push(node);
				}
			}
		} else{
			console.error("node with id " + root.id + " has a descendant with no id");
			return -1;
		}
	}
	return 0;
}

function constructTree(lsxNodesArray, leavesArray, root){
	for(var i = 0; i < lsxNodesArray.length; i++){
		if(lsxNodesArray[i].attributes.getNamedItem("id").value == root.id){

			if(getGeometry(lsxNodesArray, leavesArray, root, i) == -1){
				return -1;
			}

			break;
		}

		if(i == lsxNodesArray.length - 1){
			var exist = checkLeafs(leavesArray, root);
			if(exist == -1){
				console.error("there's not a node with this id \"" + root.id + "\", geometry was not loaded");
				return -1;
			}else if(exist == 1){
				return 1;
			}
		}
	}
	return 0;
}

function checkLeafs(leavesArray, root){
	for(var i = 0; i < leavesArray.length; i++){
		if(leavesArray[i].id == root.id){
			root = leavesArray[i];
			return 1;
		}
	}
	return -1;
}

function getNodeInfo(lsxNode, node){

	var childrenArray = lsxNode.children;

	for(var i = 0; i < childrenArray.length; i++){
		if(childrenArray[i].localName == "ROTATION"){
			node.transforms.push(new Rotation(childrenArray[i].attributes.getNamedItem("axis").value,
				childrenArray[i].attributes.getNamedItem("angle").value));
		}

		if(childrenArray[i].localName == "SCALE"){
			node.transforms.push(new Scale(childrenArray[i].attributes.getNamedItem("sx").value,
				childrenArray[i].attributes.getNamedItem("sy").value,
				childrenArray[i].attributes.getNamedItem("sz").value));
		}

		if(childrenArray[i].localName == "TRANSLATION"){
			node.transforms.push(new Translation(childrenArray[i].attributes.getNamedItem("x").value,
				childrenArray[i].attributes.getNamedItem("y").value,
				childrenArray[i].attributes.getNamedItem("z").value));
		}

		if(childrenArray[i].localName == "TEXTURE"){
			node.texture = childrenArray[i].attributes.getNamedItem("id").value;
		}

		if(childrenArray[i].localName == "MATERIAL"){
			node.material = childrenArray[i].attributes.getNamedItem("id").value;
		}
	}

	return 0;
}


/*
* Texture Classes
*/

function Texture(id, path, amplif_factor){
	this.id = id;
	this.path = path;
	this.amplif_factor = amplif_factor;
}

function Amplif(s, t){
	this.s = s;
	this.t = t;
}

/*
* Material Classes
*/
function Material(id, shininess, specular, diffuse, ambient, emission){
	this.id = id;
	this.shininess = shininess;
	this.specular = specular;
	this.diffuse = diffuse;
	this.ambient = ambient;
	this.emission = emission;
	this.cgfAppearance = null;
}

/*
 *	Light Classes
 */
 
 function Light(id, enable, position, ambient, diffuse, specular, shininess){
 	this.id = id;
 	this.enabled = enable;
 	this.position = position;
 	this.ambient = ambient;
 	this.diffuse = diffuse;
 	this.specular = specular;
 	this.shininess = shininess;
 }


 function Position(x, y, z, w){
 	this.x = x;
 	this.y = y;
 	this.z = z;
 	this.w = w;
 }

 function RGBA(r, g, b, a){
 	this.r = r;
 	this.g = g;
 	this.b = b;
 	this.a = a;
 }


 function Leaf(id, type, args){
 	this.id = id;
 	this.type = type;
 	this.args = args;
 	this.object = null;
 }


 function Node(id){
 	this.id = id;

 	this.texture = null;
 	this.material = null;

 	this.transforms = [];

 	this.descendants = [];
 }


 function Rotation(axis, angle){
 	this.axis = axis;
 	this.angle = angle;
 }


 function Translation(x, y, z){
 	this.x = x;
 	this.y = y;
 	this.z = z;
 }


 function Scale(sx, sy, sz){
 	this.sx = sx;
 	this.sy = sy;
 	this.sz = sz;
 }





