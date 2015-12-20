
function Scene() {
    CGFscene.call(this);
}

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.interface = null;

    this.lightsEnabled = [];

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);

    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.expectedUpdatePeriod = 50;

	this.setUpdatePeriod(this.expectedUpdatePeriod);

};

Scene.prototype.initLights = function () {

 
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
 

};

Scene.prototype.setInterface = function (interface) {
	this.interface = interface;
}

Scene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 20), vec3.fromValues(0, 0, 0));
};

Scene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);

};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
Scene.prototype.onGraphLoaded = function () 
{
	if(this.graph.frustum['near'] != null)
		this.camera.near = parseFloat(this.graph.frustum['near']);

	if(this.graph.frustum['far'] != null)
		this.camera.far = parseFloat(this.graph.frustum['far']);

	if (parseFloat(this.graph.reference) > 0)
	   this.axis = new CGFaxis(this, parseFloat(this.graph.referenceLength));

	this.getLSXIllumination();

	this.getLSXLights();


	this.graphObject = new MyGraphObject(this, this.graph.rootNode, this.graph.leavesArray, this.graph.texturesArray, this.graph.materialsArray, this.graph.initialTransforms, this.expectedUpdatePeriod); 


	this.interface.onGraphLoaded();

};

Scene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();

    this.loadIdentity();

	this.applyViewMatrix();

	this.axis.display();

	this.setDefaultAppearance();

};



/*
*	function to update any of the lights called from the interface
*	@method updateLight
*	@param {string}	lightId  string containing light id
*	@param {boolean}	enable 	enable or disable light
*/

Scene.prototype.updateLight = function(lightId, enable) {
	for (var i = 0; i < this.graph.lightsArray.length; ++i) {
		if (this.graph.lightsArray[i].id == lightId) {
			var light = this.lights[i];
			enable ? light.enable() : light.disable();
			return;
		}
	}
}




Scene.prototype.update = function(currTime) {
	console.log("updating");
};


