
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



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
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
	
	
	//getting lights
	var lights =  rootElement.getElementsByTagName('LIGHTS');
	
	if (lights == null) {
		return "lights element is missing.";
	}

	if (lights.length != 1) {
		return "Either 0 or more than 1 'lights' elements found.";
	}

	var lsxLightsArray = lights[0].getElementsByTagName('LIGHT');
	
	if (lsxLightsArray == null) {
		return "lightsArray element is missing.";
	}

	if (lsxLightsArray.length == 0) {
		return "zero 'lightsArray' elements found.";
	}
	
	this.lightsArray = [];

	getLights(lsxLightsArray, this.lightsArray);

	var leaves = rootElement.getElementsByTagName('LEAVES');

	if (leaves == null) {
		return "leaves element is missing.";
	}

	if (leaves.length != 1) {
		return "Either 0 or more than 1 'leaves' elements found.";
	}

	var lsxLeavesArray = leaves[0].getElementsByTagName('LEAF');

	if (lsxLeavesArray == null) {
		return "there is no leaf elements";
	}

	if (lsxLeavesArray.length == 0) {
		return "0 LEAF elements found";
	}

	this.leavesArray = [];

	getLeaves(lsxLeavesArray, this.leavesArray);
	
	
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



function getLights(lsxLightsArray, lightsArray){

	for(var i = 0; i < lsxLightsArray.length; i++){
		
		if(lsxLightsArray[i].getElementsByTagName('enable')[0] != null){
			var lightEnabled = lsxLightsArray[i].getElementsByTagName('enable')[0];
			var enabled = lightEnabled.attributes.getNamedItem("value").value;
		}else{
			var enabled = null;
		}

		if(lsxLightsArray[i].getElementsByTagName('position')[0] != null){
			var lightPosition = lsxLightsArray[i].getElementsByTagName('position')[0];
			var position = new LightPosition(lightPosition.attributes.getNamedItem("x").value
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


function getLeaves(lsxLeavesArray, leavesArray) {
	for(var i = 0; i < lsxLeavesArray.length; i++){

		var type = lsxLeavesArray[i].attributes.getNamedItem("type").value;
		var id = lsxLeavesArray[i].attributes.getNamedItem("id").value;
		var args = lsxLeavesArray[i].attributes.getNamedItem("args").value.match(/[^ ]+/g);

		var object = new Leaf(id, type, args);
		leavesArray[i] = object;
	}
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

function LightPosition(x, y, z, w){
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


