
function Scene() {
    CGFscene.call(this);
}

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (application) {

    CGFscene.prototype.init.call(this, application);

    this.app = application;

    this.interface = null;
    this.lastCurrTime = 0;

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(150.0);

    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.expectedUpdatePeriod = 20;

	this.setUpdatePeriod(this.expectedUpdatePeriod);

	this.enableTextures(true);

	this.setPickEnabled(true);

	this.replaying = false;
	this.replayStarted = false;

	this.environment = new Environment(this);
	this.board = new Board(this);
	this.counter = new Counter(this);

};

Scene.prototype.initLights = function () {
 	
	this.lights[0].setPosition(20, 20 , 100, 20);
    this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setLinearAttenuation(1);
	this.lights[0].setConstantAttenuation(0);
	this.lights[0].setQuadraticAttenuation(0);
    this.lights[0].enable();
    this.lights[0].update();

    this.lights[1].setAmbient(-30, 0, -30, 1);
	this.lights[1].setDiffuse(0.15, 0.15, 0.15, 1.0);
	this.lights[1].enable();
	this.lights[1].update();

};


Scene.prototype.initCameras = function () {

	this.cameraPerspectives = [];
	this.cameraPerspectives[0] = new CameraPerspective('Camera 1', vec3.fromValues(85, 57, 85), vec3.fromValues(0, -15, 0));
	this.cameraPerspectives[1] = new CameraPerspective('Camera 2', vec3.fromValues(-18, 120, 18), vec3.fromValues(18, 0, 18));

	this.cameraAnimation = null;

    this.camera = new CGFcamera(0.4, 0.1, 500, /*vec3.fromValues(30, 30, 30), vec3.fromValues( 0, 0, 0)*/this.cameraPerspectives[0].position, this.cameraPerspectives[0].direction);

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

	if(!this.replaying) {
		this.getPicking();
		this.clearPickRegistration();	
	}

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

	this.updateProjectionMatrix();

    this.loadIdentity();

	this.applyViewMatrix();

	this.setDefaultAppearance();

	if (this.cameraAnimation == null) this.counter.display();
	this.board.display();
	if (this.app.interface.environment) this.environment.display();



};


Scene.prototype.update = function(currTime) {
	
	this.counter.update(currTime);
	this.board.update(currTime);


	if (this.lastCurrTime != 0)
		if (this.cameraAnimation != null) {
			var deltaTime = currTime - this.lastCurrTime;
			this.animateCamera(deltaTime);
		}

	this.lastCurrTime = currTime;
};





Scene.prototype.getPerspesctiveNames = function () {
	
	var names = [];
	
	for (var i = 0; i < this.cameraPerspectives.length; i++)
		names.push(this.cameraPerspectives[i].name);

	return names;

}



Scene.prototype.updateCamera = function (perspective) {
	
	var perspectiveObj = null;
	
	for (var i = 0; i < this.cameraPerspectives.length; i++) {
		if (perspective == this.cameraPerspectives[i].name)
			perspectiveObj = this.cameraPerspectives[i];
	}

	this.cameraAnimation = new CameraAnimation(this.camera, perspectiveObj);

}



Scene.prototype.animateCamera = function (deltaTime) {

	var animation = this.cameraAnimation;
	var camera = this.camera
	
	if (this.lastCurrTime != 0) 
		if (Math.abs(animation.travelledPosDist[0]) < Math.abs(animation.posDist[0]) ||
			Math.abs(animation.travelledPosDist[1]) < Math.abs(animation.posDist[1]) ||
			Math.abs(animation.travelledPosDist[2]) < Math.abs(animation.posDist[2]) ||
			Math.abs(animation.travelledDirDist[0]) < Math.abs(animation.dirDist[0]) ||
			Math.abs(animation.travelledDirDist[1]) < Math.abs(animation.dirDist[1]) ||
			Math.abs(animation.travelledDirDist[2]) < Math.abs(animation.dirDist[2]) ) {

			
			var distPosX = animation.velPos[0] * deltaTime;
			var distPosY = animation.velPos[1] * deltaTime;
			var distPosZ = animation.velPos[2] * deltaTime;

			if(Math.abs(animation.travelledPosDist[0]) < Math.abs(animation.posDist[0])) {
				
				camera.position[0] += distPosX;
				animation.travelledPosDist[0] += distPosX;

			}

			if(Math.abs(animation.travelledPosDist[1]) < Math.abs(animation.posDist[1])) {
				
				camera.position[1] += distPosY;
				animation.travelledPosDist[1] += distPosY;

			}
			
			if(Math.abs(animation.travelledPosDist[2]) < Math.abs(animation.posDist[2])) {
				
				camera.position[2] += distPosZ;
				animation.travelledPosDist[2] += distPosZ;

			}

			var distDirX = animation.velDir[0] * deltaTime;
			var distDirY = animation.velDir[1] * deltaTime;
			var distDirZ = animation.velDir[2] * deltaTime;

			if(Math.abs(animation.travelledDirDist[0]) < Math.abs(animation.dirDist[0])) { 
				
				camera.target[0] += distDirX;
				camera.direction[0] += distDirX;
				animation.travelledDirDist[0] += distDirX;

			}

			if(Math.abs(animation.travelledDirDist[1]) < Math.abs(animation.dirDist[1])) {
				
				camera.target[1] += distDirY;
				camera.direction[1] += distDirY;
				animation.travelledDirDist[1] += distDirY;

			}

			if(Math.abs(animation.travelledDirDist[2]) < Math.abs(animation.dirDist[2])) {
				
				camera.target[2] += distDirZ;
				camera.direction[2] += distDirZ;
				animation.travelledDirDist[2] += distDirZ;

			}
		
		} else {

			vec3.copy(camera.position, animation.destinationPerspective.position);
			vec3.copy(camera.direction, animation.destinationPerspective.direction);
			vec3.copy(camera.target, animation.destinationPerspective.direction);
			this.cameraAnimation = null;

		}

}


Scene.prototype.getPicking = function () {

	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj) {
					var customId = this.pickResults[i][1];				
					this.board.pick(customId, obj);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}



Scene.prototype.replay = function () {

	this.replaying = !this.board.history.movesHistory.length ? false : true;

	if (this.replaying == false) swal("Oops...", "There is nothing to replay yet.", "error");
	else {

		this.app.interface.replay(true);
		this.board.history.movesReplay = this.board.history.movesHistory.slice();
		this.board.history.movesReplay.reverse();
		this.board.black = 'Human';
		this.board.white = 'Human';
		if (this.board.history.swaps == 0) { this.board.history.playing = 'black'; this.app.interface.playing = 'black'; } 
		else { var playing = this.board.history.swaps % 2 == 0 ? 'black' : 'white'; this.board.history.playing = playing; this.app.interface.playing = playing; }
		var matrix = this.board.history.initialMatrix;
		this.board.orfanPieces = [];
		this.board.replaceMatrix(matrix, false, true);

	}
	
}