
function Scene() {
    CGFscene.call(this);
}

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.interface = null;

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

	this.createAppearances();

	this.piece = new Piece(this);

};

Scene.prototype.initLights = function () {

 
	this.lights[0].setPosition(0, 0, 0, 0);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].setAmbient(1.0,1.0,1.0,0);
    this.lights[0].setSpecular(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    this.lights[0].enable();
 

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

/*
*	displays any element in the scene
*	@method display
*/

Scene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();

    this.loadIdentity();

	this.applyViewMatrix();

	this.axis.display();

	this.setDefaultAppearance();

	for(var i = 0; i < this.lights.length; i++){
		this.lights[i].update();
	}

	this.piece.display();

};


Scene.prototype.update = function(currTime) {
};




Scene.prototype.createAppearances = function () {

	this.blackMaterial = new CGFappearance(this);
	this.blackMaterial.setAmbient(0.1,0.1,0.1,1);
	this.blackMaterial.setDiffuse(0.1,0.1,0.1,1);
	this.blackMaterial.setSpecular(0.1,0.1,0.1,1);
	this.blackMaterial.setShininess(0);

	this.whiteMaterial = new CGFappearance(this);
	this.whiteMaterial.setAmbient(0.8,0.8,0.8,0.5);
	this.whiteMaterial.setDiffuse(0.8,0.8,0.8,0.5);
	this.whiteMaterial.setSpecular(0.8,0.8,0.8,0.5);
	this.whiteMaterial.setShininess(0);

}
