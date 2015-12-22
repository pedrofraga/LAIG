
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

	this.board = new Board(this);

};

Scene.prototype.initLights = function () {
 
	this.lights[0].setPosition(0, 0, 0, 0);
    this.lights[0].setDiffuse(1.0,1.0,1.0,0);
    this.lights[0].setAmbient(1.0,1.0,1.0,0);
    this.lights[0].setSpecular(1.0,1.0,1.0,0.5);
    this.lights[0].enable();
    this.lights[0].update();
    

};

Scene.prototype.setInterface = function (interface) {

	this.interface = interface;

}

Scene.prototype.initCameras = function () {

    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(65, 48, 65), vec3.fromValues(0, -27, 0));

};

Scene.prototype.setDefaultAppearance = function () {

    this.setAmbient(0.2, 0.4, 0.8, 0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 0);
    this.setShininess(0);

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

	this.board.display();

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

	this.redMaterial = new CGFappearance(this);
	this.redMaterial.setAmbient(1,0.2,0.2,0);
	this.redMaterial.setDiffuse(1,0.2,0.2,0.5);
	this.redMaterial.setSpecular(1,0.2,0.2,0);
	this.redMaterial.setShininess(0);


	this.orangeMaterial = new CGFappearance(this);
	this.orangeMaterial.setAmbient(1,0.6,0.2,0);
	this.orangeMaterial.setDiffuse(1,0.6,0.2,0.5);
	this.orangeMaterial.setSpecular(1,0.6,0.2,0);
	this.orangeMaterial.setShininess(0);

	this.yellowMaterial = new CGFappearance(this);
	this.yellowMaterial.setAmbient(1,1,0.2,0);
	this.yellowMaterial.setDiffuse(1,1,0.2,0.5);
	this.yellowMaterial.setSpecular(1,1,0.2,0);
	this.yellowMaterial.setShininess(0);

	this.greenMaterial = new CGFappearance(this);
	this.greenMaterial.setAmbient(0.2,1,0.2,0);
	this.greenMaterial.setDiffuse(0.2,1,0.2,0.5);
	this.greenMaterial.setSpecular(0.2,1,0.2,0);
	this.greenMaterial.setShininess(0);

	this.blueMaterial = new CGFappearance(this);
	this.blueMaterial.setAmbient(0,0.5,1,0);
	this.blueMaterial.setDiffuse(0,0.5,1,0.5);
	this.blueMaterial.setSpecular(0,0.5,1,0);
	this.blueMaterial.setShininess(0);

	this.purpleMaterial = new CGFappearance(this);
	this.purpleMaterial.setAmbient(0.4,0.1,1,0);
	this.purpleMaterial.setDiffuse(0.4,0.1,1,0.5);
	this.purpleMaterial.setSpecular(0.4,0.1,1,00);
	this.purpleMaterial.setShininess(0);

	this.lilacMaterial = new CGFappearance(this);
	this.lilacMaterial.setAmbient(0.78,0.27,1,0);
	this.lilacMaterial.setDiffuse(0.78,0.27,1,0.5);
	this.lilacMaterial.setSpecular(0.78,0.27,1,0);
	this.lilacMaterial.setShininess(0);

}
