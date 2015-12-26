
function LightingScene() {
    CGFscene.call(this);
    this.texture = null;
   	this.appearance = null;
   	this.surfaces = [];
   	this.translations = [];
   	this.selectedExampleShader=0;
   	this.wireframe=false;

}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.initCameras();

    this.initLights();

    this.gl.clearColor(0,0,0, 1.0);
    this.gl.clearDepth(1000.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
	this.axis=new CGFaxis(this);
	this.enableTextures(true);
   
    this.setUpdatePeriod(500);
	
	this.appearance = new CGFappearance(this);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);

	// font texture: 16 x 16 characters
	// http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
	this.fontTexture = new CGFtexture(this, "textures/oolite-font.png");
	this.appearance.setTexture(this.fontTexture);

	// plane where texture character will be rendered
	this.plane=new Plane(this);
	
	// instatiate text shader
	this.textShader=new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");

	// set number of rows and columns in font texture
	this.textShader.setUniformsValues({'dims': [16, 16]});

};

LightingScene.prototype.initLights = function () {

	if (this.lights.length > 0) {
		this.lights[0].setPosition(3,3,3,1);
		this.lights[0].setAmbient(0.2,0.2,0.2,1);
		this.lights[0].setDiffuse(0.9,0.9,1,1);
		this.lights[0].setSpecular(0,0,0,1);
		this.lights[0].enable();		
		this.lights[0].update();
	}
};


LightingScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 100), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.1,0.1,0.1, 1.0);
    this.setDiffuse(0.8,0.8,0.8, 1.0);
    this.setSpecular(0.0, 0.0, 0.0,1.0);
    this.setShininess(10.0);	
};

LightingScene.prototype.display = function () 
{
	// Clear image and depth buffer every time we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// An example of how to show something that is not affected by the camera (e.g. a HUP display)
	this.pushMatrix();
		this.translate(-1,1.5,-10);
		this.plane.display();
	this.popMatrix();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	
	// Update all lights used
	this.lights[0].update();

	// Draw axis
	this.axis.display();	

	// activate shader for rendering text characters
	this.setActiveShaderSimple(this.textShader);

	// activate texture containing the font
	this.appearance.apply();

	this.pushMatrix();

		this.scale(10,10,10);

		// set character to display to be in the 6th column, 5th line (0-based)
		// the shader will take care of computing the correct texture coordinates 
		// of that character inside the font texture (check shaders/font.vert )
		// Homework: This should be wrapped in a function/class for displaying a full string

		this.activeShader.setUniformsValues({'charCoords': [12,4]});
		this.plane.display();

		this.translate(1,0,0);
		this.activeShader.setUniformsValues({'charCoords': [1,4]});
		this.plane.display();

		this.translate(1,0,0);
		this.activeShader.setUniformsValues({'charCoords': [9,4]});
		this.plane.display();

		this.translate(1,0,0);
		this.activeShader.setUniformsValues({'charCoords': [7,4]});
		this.plane.display();

	this.popMatrix();

	this.setActiveShaderSimple(this.defaultShader);

}
