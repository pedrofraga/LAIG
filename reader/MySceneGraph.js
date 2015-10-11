
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
	this.diffuse = [];
	this.specular = [];
	this.shininess;
	
	getIllumination(illumination, this.ambient, this.background, this.diffuse, this.specular, this.shininess);
	
	this.lightsArray = [];

	getLights(rootElement, this.lightsArray);

	this.leavesArray = [];

	getLeaves(rootElement, this.leavesArray);

	this.rootNode;

	getGeometryNodes(rootElement, this.leavesArray ,this.rootNode);
	
	
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

function getIllumination(illumination, ambient, background, diffuse, specular, shininess){


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

	if(illumination[0].getElementsByTagName('diffuse')[0] != null){
		var illumiDiffuse = illumination[0].getElementsByTagName('diffuse')[0];
		diffuse['r'] = illumiDiffuse.attributes.getNamedItem("r").value;
		diffuse['g'] = illumiDiffuse.attributes.getNamedItem("g").value;
		diffuse['b'] = illumiDiffuse.attributes.getNamedItem("b").value;
		diffuse['a']= illumiDiffuse.attributes.getNamedItem("a").value;

	}

	if(illumination[0].getElementsByTagName('specular')[0] != null){
		var illumiSpecular = illumination[0].getElementsByTagName('specular')[0];
		specular['r'] = illumiSpecular.attributes.getNamedItem("r").value;
		specular['g'] = illumiSpecular.attributes.getNamedItem("g").value;
		specular['b'] = illumiSpecular.attributes.getNamedItem("b").value;
		specular['a']= illumiSpecular.attributes.getNamedItem("a").value;

	}

	
	if(illumination[0].getElementsByTagName('shininess')[0] != null){
		var illumiShininess = illumination[0].getElementsByTagName('shininess')[0];
		shininess = illumiShininess.attributes.getNamedItem("value").value;
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
		
		
		
		
		var light = new Light(enabled, position, ambient, diffuse, specular, shininess);
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


function getGeometryNodes(rootElement, leavesArray, rootNode){
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

	rootNode = new Node(rootID);
	
	if(constructTree(lsxNodesArray, leavesArray, rootNode) == -1){
		console.error("please reconstruct your .lsx file");
		rootNode = null;
	}
	
	console.log(rootNode);
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
				var node = new Node(id);
				root.descendants[i] = node;

				if(getNodeInfo(lsxDescendantsArray[i], root.descendants[i]) == -1) return -1;

				if(constructTree(lsxNodesArray, leavesArray, root.descendants[i]) == -1){
					return -1;
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
			if(checkLeafs(leavesArray, root.id) == -1){
				console.error("there's not a node with this id \"" + root.id + "\", geometry was not loaded");
				return -1;
			}
		}
	}
	return 0;
}

function checkLeafs(leavesArray, id){
	for(var i = 0; i < leavesArray.length; i++){
		if(leavesArray[i].id == id){
			return 0;
		}
	}
	return -1;
}

function getNodeInfo(lsxNode, node){
	var rotation = lsxNode.getElementsByTagName("ROTATION");
	if(rotation != null){
		console.log("rotation length = " + rotation.length);
		if(rotation.length == 1){	
				node.rotation = new Rotation(rotation[0].attributes.getNamedItem("axis").value,
												rotation[0].attributes.getNamedItem("angle").value);
		}else if(rotation.length > 1){
			console.log("there's more than 1 rotation tag in node with id " + node.id);
			return -1;
		}
	}

	var scale = lsxNode.getElementsByTagName("SCALE");
	if(scale != null){
		if(scale.length == 1){
				node.scale = new Scale(scale[0].attributes.getNamedItem("sx").value,
												scale[0].attributes.getNamedItem("sy").value,
												scale[0].attributes.getNamedItem("sz").value);
		}else if(scale.length > 1){
			console.log("there's more than 1 scale tag in node with id " + node.id);
			return -1;
		}
	}


	var translation = lsxNode.getElementsByTagName("TRANSLATION");
	if(translation != null){
		if(translation.length == 1){	
				node.translation = new Translation(translation[0].attributes.getNamedItem("x").value,
												translation[0].attributes.getNamedItem("y").value,
												translation[0].attributes.getNamedItem("z").value);
		}else if(translation.length > 1){
			console.log("there's more than 1 translation tag in node with id " + node.id);
			return -1;
		}
	}

	return 0;
}

/*
 *	Light Classes
 */
 
function Light(enable, position, ambient, diffuse, specular, shininess){
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
}


function Node(id){
	this.id = id;

	this.texture = null;
	this.material = null;

	this.translation = null;
	this.rotation = null;
	this.scale = null;

	this.descendants = [];
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

function Rotation(axis, angle){
	this.axis = axis;
	this.angle = angle
}


