/**
 * Load from lsx file
 * @constructor
 * @param {string} filename - name of .lsx file
 * @param {XMLScene} scene - webGL scene
 */
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;

	// File reading
	this.reader = new CGFXMLreader();


	this.animations = [];
	this.ambient = [];
	this.background = [];
	this.frustum = [];
	this.lightsArray = [];
	this.leavesArray = [];
	this.texturesArray = [];
	this.materialsArray = [];
	this.rootNode;

	this.initialTransforms = mat4.create();
	mat4.identity(this.initialTransforms);



	this.reference;

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



/**
 * Parser function
 * @param {documentElement} rootElement - .lsx file to read
 */
MySceneGraph.prototype.parser= function(rootElement) {

	//getting initials node

	console.log('Loading elements from .lsx file...');

	var initials = rootElement.getElementsByTagName('INITIALS');

	if(initials == null){
		return 'initials element is missing';
	}

	if(initials.length != 1){
		return "either zero or more than one initials element found.";
	}


	getInitials(initials, this.frustum, this.initialTransforms, this.reference);


	// getting illumination node
	var illumination =  rootElement.getElementsByTagName('ILLUMINATION');

	if (illumination == null) {
		return "illumi element is missing.";
	}

	if (illumination.length != 1) {
		return "either zero or more than one 'illumi' element found.";
	}


	getIllumination(illumination, this.ambient, this.background);

	var result = getAnimations(rootElement, this.animations);
	
	if(result != 0) {
		return result;
	}


	console.log(this.animations);

	

	if(	getLights(rootElement, this.lightsArray ) == -1){
		return ".lsx file has at least 2 lights with the same id";
	}

	
	if(getTextures(rootElement, this.texturesArray) == -1){
		return ".lsx file has at least 2 textures with the same id";
	}

	
	if(getMaterials(rootElement, this.materialsArray) == -1){
		return ".lsx file has at least 2 materials with the same id";
	}

	if(getLeaves(rootElement, this.leavesArray) == -1){
		return ".lsx file has at least 2 leaves with the same id";
	}

	this.rootNode = getGeometryNodes(rootElement, this.leavesArray, this.animations);

	if(this.rootNode == null){
		return ".lsx file nodes are not well formed";
	}

	console.log('Loading is complete!');

};

/*
 * Callback to be executed on any read error
 */


 MySceneGraph.prototype.onXMLError=function (message) {
 	console.error("XML Loading Error: "+message);
 	this.loadedOk=false;
 };



function getAnimations(rootElement, animationsArray) {

 	var animationsElement =  rootElement.getElementsByTagName('animations');

	if (animationsElement == null) {
		return "animations element is missing.";
	}

	if (animationsElement.length != 1) {
		return "either zero or more than one 'animations' element found.";
	}


	animations = animationsElement[0].getElementsByTagName('animation');


	for(var i = 0; i < animations.length; i++){
		
		var id = animations[i].attributes.getNamedItem("id").value;
		var span = parseFloat(animations[i].attributes.getNamedItem("span").value) * 1000;
		var type = animations[i].attributes.getNamedItem("type").value;

		if(type == 'circular') {
			var centerString = animations[i].attributes.getNamedItem("center").value.match(/[^ ]+/g);

			var center = [];

			center.push(parseFloat(centerString[0]));
			center.push(parseFloat(centerString[1]));
			center.push(parseFloat(centerString[2]));

			var radius = parseFloat(animations[i].attributes.getNamedItem("radius").value);

			var startAngle = toRadian(parseFloat(animations[i].attributes.getNamedItem("startang").value));

			var rotationAngle = toRadian(parseFloat(animations[i].attributes.getNamedItem("rotang").value));

			animationsArray.push(new CircularAnimation(id, span, center, radius, startAngle, rotationAngle));

		} else if (type == 'linear'){
			var controlPointsXML = animations[i].getElementsByTagName('controlpoint');

			var controlPointToBeSaved = [];

			for(var j = 0; j < controlPointsXML.length; j++) {
				var x = parseFloat(controlPointsXML[j].attributes.getNamedItem("xx").value);
				var y = parseFloat(controlPointsXML[j].attributes.getNamedItem("yy").value);
				var z = parseFloat(controlPointsXML[j].attributes.getNamedItem("zz").value);

				controlPointToBeSaved.push(vec3.fromValues(x, y, z));
			}

			var distance = 0;

			var distanceEachPhase = [];

			for(var j = 0; j < controlPointToBeSaved.length; j++) {
				distance += Math.sqrt(Math.pow(controlPointToBeSaved[j][0], 2) + Math.pow(controlPointToBeSaved[j][1], 2) + Math.pow(controlPointToBeSaved[j][2], 2));
				distanceEachPhase[j] = Math.sqrt(Math.pow(controlPointToBeSaved[j][0], 2) + Math.pow(controlPointToBeSaved[j][1], 2) + Math.pow(controlPointToBeSaved[j][2], 2));
			}

			var velocity = distance / span;

			if(controlPointsXML.length == 0)
				return 'There\'s no control points on linear animation with id: ' + id;
			else
				animationsArray.push(new LinearAnimation(id, span, controlPointToBeSaved, velocity, distanceEachPhase));

		} else {
			return 'Animation with type \"' + type + '\" it\'s not recognized by this parser, reconstruct your .lsx';
		}


	}

	return 0;
	
 };


/**
 * Method to get elements from INITIALS tag
 * @method getInitials
 * @param  {array}    initials    array with .lsx info
 * @param  {array}    frustum     array with frustum info
 * @param  {array}    translation array to get intial translation
 * @param  {array}    rotation    array with initial rotation
 * @param  {array}    scale       array with initial scale
 * @param  {int}    reference   	value of reference
 * @return {int}     							-1 if error, 0 if okay
 */
function getInitials(initials, frustum, transforms, reference){

	if(initials[0].getElementsByTagName('frustum')[0] != null){
		var initialsFrustum = initials[0].getElementsByTagName('frustum')[0];
		frustum['near'] = initialsFrustum.attributes.getNamedItem("near").value;
		frustum['far'] = initialsFrustum.attributes.getNamedItem("far").value;
	}

	if(initials[0].getElementsByTagName('translation')[0] != null){
		for(var i = 0; i < initials[0].getElementsByTagName('translation').length; i++){
			
			var initialsTransl = initials[0].getElementsByTagName('translation')[i];
			
			var x = parseFloat(initialsTransl.attributes.getNamedItem("x").value);
			var y = parseFloat(initialsTransl.attributes.getNamedItem("y").value);
			var z = parseFloat(initialsTransl.attributes.getNamedItem("z").value);
			
			mat4.translate(transforms, transforms, [x, y, z]);
		}
	}

	if(initials[0].getElementsByTagName('rotation')[0] != null){
		for(var i = 0; i < initials[0].getElementsByTagName('rotation').length; i++){
			
			var initialsRot = initials[0].getElementsByTagName('rotation')[i];

			var angle = toRadian(parseFloat(initialsRot.attributes.getNamedItem("angle").value));
			switch(initialsRot.attributes.getNamedItem("axis").value) {
				case 'y':
					mat4.rotate(transforms, transforms, angle, [0,1,0]);
					break;
				case 'x':
					mat4.rotate(transforms, transforms, angle, [1,0,0]);
					break;
				case 'z':
					mat4.rotate(transforms, transforms, angle, [0,0,1]);
					break;
				default:
					throw new Error('There is no axis ' + childrenArray[i].attributes.getNamedItem("axis").value + ' .lsx not well formed');
					break;
			}
		}
	}

	if(initials[0].getElementsByTagName('scale')[0] != null){
		for(var i = 0; i < initials[0].getElementsByTagName('scale').length; i++){
			var initialsScale = initials[0].getElementsByTagName('scale')[i];

			var sx = parseFloat(initialsScale.attributes.getNamedItem("sx").value);
			var sy = parseFloat(initialsScale.attributes.getNamedItem("sy").value);
			var sz = parseFloat(initialsScale.attributes.getNamedItem("sz").value);
			mat4.scale(transforms, transforms, [sx, sy, sz]);
		}
	}

	if(initials[0].getElementsByTagName('reference')[0] != null){
		var initialsRef = initials[0].getElementsByTagName('reference')[0];
		reference = initialsRef.attributes.getNamedItem("length").value;
	}

}

/**
 * method to get illumination values
 * @method getIllumination
 * @param  {array}        illumination array with .lsx info
 * @param  {array}        ambient      array with ambient info
 * @param  {array}        background   array with background info
 * @return {int}                    -1 if error, 0 if okay
 */
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


/**
 * method to get textures info from .lsx file
 * @method getTextures
 * @param  {documentElement}    rootElement   tree of arrays with .lsx info
 * @param  {array}    texturesArray array to get textures
 * @return {int}                  0 if is okay, -1 if error
 */
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

	for(var i = 0; i < texturesArray.length; i++){
		for(var j = 0; j < texturesArray.length; j++){
			if(i != j){
				if(texturesArray[i].id == texturesArray[j].id)
					return -1;
			}
		}
	}

	return 0;

}


/**
 * method to get materials from .lsx file
 * @method getMaterials
 * @param  {documentElement}     rootElement    var with .lsx info
 * @param  {array}     materialsArray array to get materials form .lsx
 * @return {int}                    0 if is okay, -1 if error
 */
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

	for(var i = 0; i < materialsArray.length; i++){
		for(var j = 0; j < materialsArray.length; j++){
			if(i != j){
				if(materialsArray[i].id == materialsArray[j].id)
					return -1;
			}
		}
	}

	return 0;

}


/**
 * method to get lights from .lsx file
 * @method getLights
 * @param  {documentElement}  rootElement 	var with .lsx info
 * @param  {array}  lightsArray array to get lights from .lsx
 * @return {int}              0 if is okay, -1 if error
 */
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

	for(var i = 0; i < lightsArray.length; i++){
		for(var j = 0; j < lightsArray.length; j++){
			if(i != j){
				if(lightsArray[i].id == lightsArray[j].id)
					return -1;
			}
		}
	}

	return 0;
}

/**
 * method to get leaves from .lsx file
 * @method getLeaves
 * @param  {documentElement}  rootElement 	var with .lsx info
 * @param  {array}  lavesArray array to get leaves from .lsx
 * @return {int}              0 if is okay, -1 if error
 */
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
		if(type != 'patch' && type != 'terrain') {
			var args = lsxLeavesArray[i].attributes.getNamedItem("args").value.match(/[^ ]+/g);
			var object = new Leaf(id, type, args);
			leavesArray[i] = object;
		} else if(type == 'patch') {
			var order = parseFloat(lsxLeavesArray[i].attributes.getNamedItem("order").value);
			var partsU = parseFloat(lsxLeavesArray[i].attributes.getNamedItem("partsU").value);
			var partsV = parseFloat(lsxLeavesArray[i].attributes.getNamedItem("partsV").value);

			var controlPointsXML = lsxLeavesArray[i].getElementsByTagName('controlpoint');

			var controlPointsArray = [];

			if(Math.pow((order + 1), 2) != controlPointsXML.length) {
				console.error('There\'s a patch primitive with a number of control points which differs from it\'s order');
				return -1;
			}

			for(var j = 0; j < controlPointsXML.length; j++) {
				var x = parseFloat(controlPointsXML[j].attributes.getNamedItem("x").value);
				var y = parseFloat(controlPointsXML[j].attributes.getNamedItem("y").value);
				var z = parseFloat(controlPointsXML[j].attributes.getNamedItem("z").value);
				var w = 1;
				controlPointsArray.push(vec4.fromValues(x, y, z, w));
			}

			var object = new Nurbs(id, type, order, partsU, partsV, controlPointsArray);

			leavesArray[i] = object;
		}else if(type == 'terrain') {
			
			var texture = lsxLeavesArray[i].attributes.getNamedItem("texture").value;
			var heightmap = lsxLeavesArray[i].attributes.getNamedItem("heightmap").value;

			var object = new TerrainLSX(id, type, texture, heightmap);

			leavesArray[i] = object;
		}
	}

	for(var i = 0; i < leavesArray.length; i++){
		for(var j = 0; j < leavesArray.length; j++){
			if(i != j){
				if(leavesArray[i].id == leavesArray[j].id)
					return -1;
			}
		}
	}
	return 0;
}


/**
 * method to get nodes from .lsx file
 * @method getGeometryNodes
 * @param  {documentElement}  rootElement 	var with .lsx info
 * @param  {array}  leavesArray			for error checking purposes
 * @return {int}              rootNode if is okay, -1 if error
 */
function getGeometryNodes(rootElement, leavesArray, animationsArray){
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

	for(var a = 0; a < lsxNodesArray.length; a++){
		if(lsxNodesArray[a].attributes.getNamedItem("id").value == rootID){
			if(getNodeInfo(lsxNodesArray[a], returnRootNode, animationsArray) == -1) return -1;
			break;
		}
	}

	if(constructTree(lsxNodesArray, leavesArray, returnRootNode, animationsArray) == -1){
		console.error("please reconstruct your .lsx file");
		returnRootNode = null;
	}


	return returnRootNode;
}


/**
 * function to get descendeants from a node
 * @method getGeometry
 * @param  {array}    lsxNodesArray  array with lsx node info
 * @param  {array}    leavesArray   array with leaves
 * @param  {Node}    root          Node to be constructed
 * @param  {int}    	a         lsxNodeArray indice
 * @return {int}                  -1 if error, 0 if okay
 */
function getGeometry(lsxNodesArray, leavesArray, root, a, animationsArray){
	var descendants = lsxNodesArray[a].getElementsByTagName("DESCENDANTS");

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

			for(var a = 0; a < lsxNodesArray.length; a++){

				if(lsxNodesArray[a].attributes.getNamedItem("id").value == id){

					if(root.descendants[i].id == 'seabird')
						console.log(animationsArray);
					
					if(getNodeInfo(lsxNodesArray[a], root.descendants[i], animationsArray) == -1) return -1;
					else root.descendants[i].setMatrix();

					break;
				}

			}

			if(constructTree(lsxNodesArray, leavesArray, root.descendants[i], animationsArray) == -1){
				return -1;
			}

		} else{
			console.error("node with id " + root.id + " has a descendant with no id");
			return -1;
		}
	}
	return 0;
}
/**
 * main function to construct tree
 * @method constructTree
 * @param  {array}      lsxNodesArray array with .lsx node info
 * @param  {array}      leavesArray   array with primitives
 * @param  {Node}      root          Node to be constructed
 * @return {int}                    -1 if error, 0 if okay
 */
function constructTree(lsxNodesArray, leavesArray, root, animationsArray){
	for(var i = 0; i < lsxNodesArray.length; i++){
		if(lsxNodesArray[i].attributes.getNamedItem("id").value == root.id){

			if(getGeometry(lsxNodesArray, leavesArray, root, i, animationsArray) == -1){
				return -1;
			}

			break;
		}

		if(i == lsxNodesArray.length - 1){
			if(checkLeafs(leavesArray, root) == -1){
				console.error("there's not a node with this id \"" + root.id + "\", geometry was not loaded");
				return -1;
			}
		}
	}
	return 0;
}

function checkLeafs(leavesArray, root){
	for(var i = 0; i < leavesArray.length; i++){
		if(leavesArray[i].id == root.id){
			return 0;
		}
	}
	return -1;
}


/**
 * get transforms, textures and materials from lsxNode
 * @method getNodeInfo
 * @param  {lsxNode}    lsxNode Node from lsx
 * @param  {Node}    node    node to give info
 */
function getNodeInfo(lsxNode, node, animationsArray){


	var childrenArray = lsxNode.children;

	for(var i = 0; i < childrenArray.length; i++){
		if(childrenArray[i].localName == "ROTATION"){

			var angle = toRadian(parseFloat(childrenArray[i].attributes.getNamedItem("angle").value));
			var axis = childrenArray[i].attributes.getNamedItem("axis").value;

			node.transforms.push(new Rotation(axis, angle));

		}
	

		if(childrenArray[i].localName == "SCALE"){
			var sx = parseFloat(childrenArray[i].attributes.getNamedItem("sx").value);
			var sy = parseFloat(childrenArray[i].attributes.getNamedItem("sy").value);
			var sz = parseFloat(childrenArray[i].attributes.getNamedItem("sz").value);

			node.transforms.push(new Scale(sx, sy, sz));

		}

		if(childrenArray[i].localName == "TRANSLATION"){
			var x = parseFloat(childrenArray[i].attributes.getNamedItem("x").value);
			var y = parseFloat(childrenArray[i].attributes.getNamedItem("y").value);
			var z = parseFloat(childrenArray[i].attributes.getNamedItem("z").value);

			node.transforms.push(new Translation(x, y, z));

		}

		if(childrenArray[i].localName == "TEXTURE"){
			node.texture = childrenArray[i].attributes.getNamedItem("id").value;
		}

		if(childrenArray[i].localName == "MATERIAL"){
			node.material = childrenArray[i].attributes.getNamedItem("id").value;
		}

		if(childrenArray[i].localName == "animationref"){
			var id = childrenArray[i].attributes.getNamedItem("id").value;

			for(var j = 0; j < animationsArray.length; j++)
				if(animationsArray[j].id == id) {
					switch (animationsArray[j].constructor) {
					case CircularAnimation:

						var id = animationsArray[j].id;
						var span = animationsArray[j].span;
						var centerPoint = animationsArray[j].center;
						var initialAngle = animationsArray[j].initialAngle
						var radius = animationsArray[j].radius;
						var rotationAngle = animationsArray[j].rotationAngle;
						node.animation = new CircularAnimation(id, span, centerPoint, radius, initialAngle, rotationAngle);
						break;
					
					case LinearAnimation:
					
						var id = animationsArray[j].id;
						var span = animationsArray[j].span;
						var controlPoints = animationsArray[j].controlPoints;
						var velocity = animationsArray[j].velocity;
						var controlPointDistance = animationsArray[j].controlPointDistance;
						node.animation = new LinearAnimation(id, span, controlPoints, velocity, controlPointDistance);
						break;
					
					}
				}
		}
	}

	return 0;

}


/*
* Texture Class
*/

function Texture(id, path, amplif_factor){
	this.id = id;
	this.path = path;
	this.amplif_factor = amplif_factor;
	this.cgfAppearance = null;
}

function Amplif(s, t){
	this.s = s;
	this.t = t;
}

/*
* Material Class
*/
function Material(id, shininess, specular, diffuse, ambient, emission){
	this.id = id;
	this.shininess = shininess;
	this.specular = specular;
	this.diffuse = diffuse;
	this.ambient = ambient;
	this.emission = emission;
}

/*
 *	Light Class
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
 /*
  *	Position Class
  */
 function Position(x, y, z, w){
 	w = typeof w !== 'undefined' ? w : false;

 	this.x = x;
 	this.y = y;
 	this.z = z;
 	this.w = w;
 }
 /*
  *	RGBA Class
  */
 function RGBA(r, g, b, a){
 	this.r = r;
 	this.g = g;
 	this.b = b;
 	this.a = a;
	
	if(parseFloat(r) > 1 || parseFloat(r) < 0 ||
		parseFloat(g) > 1 || parseFloat(g) < 0 ||
		parseFloat(b) > 1 || parseFloat(b) < 0 ||
		parseFloat(a) > 1 || parseFloat(a) < 0){
		throw new Error("RGBA with values > 1 or < 0");
	}
 }

 /*
  *	Leaf Class
  */
 function Leaf(id, type, args){
 	this.id = id;
 	this.type = type;
 	this.args = args;
	this.object = null;
 }


 /*
  *	Rotation Class
  */
 function Rotation(axis, angle){
 	this.axis = axis;
 	this.angle = angle;
 }

 /*
  *	Translation Class
  */
 function Translation(x, y, z){
 	this.x = x;
 	this.y = y;
 	this.z = z;
 }

 /*
  *	Scale Class
  */
 function Scale(sx, sy, sz){
 	this.sx = sx;
 	this.sy = sy;
 	this.sz = sz;
 }


function Nurbs(id, type, order, partsU, partsV, controlPoints){
 	this.id = id;
 	this.type = type;
 	this.order = order;
 	this.partsU = partsU;
 	this.partsV = partsV;
 	this.controlPoints = controlPoints;
 }


 function TerrainLSX(id, type, texture, heightmap){
 	this.id = id;
 	this.type = type;
 	this.texture = texture;
 	this.heightmap = heightmap;
 }



function toRadian(degrees){
	return parseFloat(degrees) * Math.PI / 180;
}
