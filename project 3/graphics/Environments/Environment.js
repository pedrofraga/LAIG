

function Environment(scene) {

	this.scene = scene;
	this.initSceneAppearances();

	this.initRoom();
	this.initPorch();
	this.initCasino();

}


Environment.prototype.display = function () {

	switch (this.scene.app.interface.environment) {
		case 'Room':
			this.displayRoom();
			break;
		case 'Porch':
			this.displayPorch();
			break;
		case 'Casino':
			this.displayCasino();
			break;
	}
}


Environment.prototype.displayRoom = function () {

	this.scene.pushMatrix();
	this.scene.multMatrix(this.roomTableMatrix);
	this.scene.blackMaterial.apply();
	this.roomTable.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.roomWallMatrix);
	this.scene.roomWallMaterial.apply();
	this.roomWall.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.roomWallMatrix2);
	this.scene.roomWallMaterial.apply();
	this.roomWall.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.floorMatrix);
	this.scene.roomFloorMaterial.apply();
	this.roomFloor.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.carpetMatrix);
	this.scene.carpetMaterial.apply();
	this.carpet.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.paintMatrix);
	this.scene.paintMaterial.apply();
	this.paint.display();
	this.scene.popMatrix();

}

Environment.prototype.initRoom = function () {

	this.roomTable = new Obj(this.scene, 'res/table.obj');
	this.roomWall = new Cube(this.scene, 250, 200, 1);
	this.roomFloor = new Cube(this.scene, 400, 400, 1);
	this.carpet = new Cube(this.scene, 110, 1, 175);
	this.paint = new Cube(this.scene, 1, 50, 75);

	this.initRoomMatrixes();

}



Environment.prototype.initRoomMatrixes = function () {

	this.roomTableMatrix = mat4.create();
	mat4.identity(this.roomTableMatrix);
	mat4.translate(this.roomTableMatrix, this.roomTableMatrix, [20, -2, 20]);
	mat4.rotate(this.roomTableMatrix, this.roomTableMatrix, Math.PI / 2, [0, 1, 0]);

	this.roomWallMatrix = mat4.create();
	mat4.identity(this.roomWallMatrix);
	mat4.translate(this.roomWallMatrix, this.roomWallMatrix, [ -100, -50, -225]);

	this.roomWallMatrix2 = mat4.create();
	mat4.identity(this.roomWallMatrix2);
	mat4.translate(this.roomWallMatrix2, this.roomWallMatrix2, [ -225, -50, -100]);
	mat4.rotate(this.roomWallMatrix2, this.roomWallMatrix2, Math.PI / 2, [0, 1, 0]);

	this.floorMatrix = mat4.create();
	mat4.identity(this.floorMatrix);
	mat4.translate(this.floorMatrix, this.floorMatrix, [ -25, -150, -25]);
	mat4.rotate(this.floorMatrix, this.floorMatrix, Math.PI / 2, [1, 0, 0]);

	this.carpetMatrix = mat4.create();
	mat4.identity(this.carpetMatrix);
	mat4.translate(this.carpetMatrix, this.carpetMatrix, [ 60, -145, 25]);

	this.floorMatrix = mat4.create();
	mat4.identity(this.floorMatrix);
	mat4.translate(this.floorMatrix, this.floorMatrix, [ -25, -150, -25]);
	mat4.rotate(this.floorMatrix, this.floorMatrix, Math.PI / 2, [1, 0, 0]);

	this.paintMatrix = mat4.create();
	mat4.identity(this.paintMatrix);
	mat4.translate(this.paintMatrix, this.paintMatrix, [ -200, -50, -75]);

}

Environment.prototype.displayPorch = function () {

	this.scene.pushMatrix();
	this.scene.multMatrix(this.porchTableMatrix);
	this.scene.darkWoodMaterial.apply();
	this.porchTable.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.porchFloorMatrix);
	this.scene.tilesMaterial.apply();
	this.porchFloor.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.porchTableSupportMatrix1);
	this.scene.roomWallMaterial.apply();
	this.porchTableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.porchTableSupportMatrix2);
	this.scene.roomWallMaterial.apply();
	this.porchTableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.porchWallMatrix);
	this.scene.brickMaterial.apply();
	this.porchWall.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.railMatrix);
	this.scene.darkWoodMaterial2.apply();
	this.rail.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.railSupportMatrix);
	this.scene.darkWoodMaterial2.apply();
	this.porchTableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.railSupportMatrix2);
	this.scene.darkWoodMaterial2.apply();
	this.porchTableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.railSupportMatrix3);
	this.scene.darkWoodMaterial2.apply();
	this.porchTableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.landscapeMatrix);
	this.scene.landscapeMaterial.apply();
	this.landscape.display();
	this.scene.popMatrix();
}


Environment.prototype.initPorch = function () {

	this.porchTable = new Cube(this.scene, 50, 1, 60);
	this.porchTableSupport = new Cylinder(this.scene, 40, 2, 2, 1, 20);
	this.porchFloor = new Cube(this.scene, 150, 250, 1);
	this.porchWall = new Cube(this.scene, 75, 150, 1);
	this.rail = new Cylinder(this.scene, 300, 6, 3, 1, 4);
	this.landscape = new Cube(this.scene, 1, 180, 300);

	this.initPorchMatrixes();

}



Environment.prototype.initPorchMatrixes = function () {

	this.porchTableMatrix = mat4.create();
	mat4.identity(this.porchTableMatrix);
	mat4.translate(this.porchTableMatrix, this.porchTableMatrix, [ 20, -3, 15]);

	this.porchTableSupportMatrix1 = mat4.create();
	mat4.identity(this.porchTableSupportMatrix1);
	mat4.translate(this.porchTableSupportMatrix1, this.porchTableSupportMatrix1, [ 1, -3, 42]);
	mat4.rotate(this.porchTableSupportMatrix1, this.porchTableSupportMatrix1, Math.PI / 2, [1, 0, 0]);

	this.porchTableSupportMatrix2 = mat4.create();
	mat4.identity(this.porchTableSupportMatrix2);
	mat4.translate(this.porchTableSupportMatrix2, this.porchTableSupportMatrix2, [ 42, -3, -9]);
	mat4.rotate(this.porchTableSupportMatrix2, this.porchTableSupportMatrix2, Math.PI / 2, [1, 0, 0]);

	this.porchWallMatrix = mat4.create();
	mat4.identity(this.porchWallMatrix);
	mat4.translate(this.porchWallMatrix, this.porchWallMatrix, [ -10, -50, -125]);

	this.railMatrix = mat4.create();
	mat4.identity(this.railMatrix);
	mat4.translate(this.railMatrix, this.railMatrix, [ -50, -10, -150]);

	this.railSupportMatrix = mat4.create();
	mat4.identity(this.railSupportMatrix);
	mat4.translate(this.railSupportMatrix, this.railSupportMatrix, [ -50, -10, -10]);
	mat4.rotate(this.railSupportMatrix, this.railSupportMatrix, Math.PI / 2, [1, 0, 0]);

	this.railSupportMatrix2 = mat4.create();
	mat4.identity(this.railSupportMatrix2);
	mat4.translate(this.railSupportMatrix2, this.railSupportMatrix2, [ -50, -10, -60]);
	mat4.rotate(this.railSupportMatrix2, this.railSupportMatrix2, Math.PI / 2, [1, 0, 0]);


	this.railSupportMatrix3 = mat4.create();
	mat4.identity(this.railSupportMatrix3);
	mat4.translate(this.railSupportMatrix3, this.railSupportMatrix3, [ -50, -10, 40]);
	mat4.rotate(this.railSupportMatrix3, this.railSupportMatrix3, Math.PI / 2, [1, 0, 0]);

	this.porchFloorMatrix = mat4.create();
	mat4.identity(this.porchFloorMatrix);
	mat4.translate(this.porchFloorMatrix, this.porchFloorMatrix, [ 25, -50, -25]);
	mat4.rotate(this.porchFloorMatrix, this.porchFloorMatrix, Math.PI / 2, [1, 0, 0]);

	this.landscapeMatrix = mat4.create();
	mat4.identity(this.landscapeMatrix);
	mat4.translate(this.landscapeMatrix, this.landscapeMatrix, [ -80, -40, -50]);
}



Environment.prototype.displayCasino = function () {
	
	this.scene.pushMatrix();
	this.scene.multMatrix(this.casinoTableMatrix);
	this.scene.casinoTableMaterial.apply();
	this.casinoTable.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.railTableMatrix);
	this.scene.darkWoodMaterial2.apply();
	this.tableRail.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.railTableMatrix2);
	this.scene.darkWoodMaterial2.apply();
	this.tableRail.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.sideRailTableMatrix);
	this.scene.darkWoodMaterial2.apply();
	this.tableRail.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.sideRailTableMatrix2);
	this.scene.darkWoodMaterial2.apply();
	this.tableRail.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.casinoFloorMatrix);
	this.scene.casinoFloorMaterial.apply();
	this.casinoFloor.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.counterMatrix);
	this.scene.woodMaterial.apply();
	this.counter.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.counterTopMatrix);
	this.scene.darkWoodMaterial2.apply();
	this.counterTop.display();
	this.scene.popMatrix()

	this.scene.pushMatrix();
	this.scene.multMatrix(this.casinoChairMatrix);
	this.scene.blackMaterial.apply();
	this.counterChair.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.casinoChairMatrix2);
	this.scene.blackMaterial.apply();
	this.counterChair.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.casinoChairMatrix3);
	this.scene.blackMaterial.apply();
	this.counterChair.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.casinoChairMatrix4);
	this.scene.blackMaterial.apply();
	this.counterChair.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.sideCounterMatrix);
	this.scene.woodMaterial.apply();
	this.sideCounter.display();
	this.scene.popMatrix()

}


Environment.prototype.initCasino = function () {

	this.casinoTable = new Cube(this.scene, 51, 1, 51);
	this.tableRail = new Cube(this.scene, 6, 1, 60);
	this.counter = new Cube(this.scene, 10, 50, 200);
	this.counterTop = new Cube(this.scene, 20, 10, 200);
	this.sideCounter = new Cube(this.scene, 100, 50, 10);
	this.casinoFloor = new Cube(this.scene, 170, 280, 1);
	this.counterChair = new Obj(this.scene, 'res/counterChair.obj');

	this.initCasinoMatrixes();

}



Environment.prototype.initCasinoMatrixes = function () {

	this.casinoTableMatrix = mat4.create();
	mat4.identity(this.casinoTableMatrix);
	mat4.translate(this.casinoTableMatrix, this.casinoTableMatrix, [ 20, -3, 19]);

	this.railTableMatrix = mat4.create();
	mat4.identity(this.railTableMatrix);
	mat4.translate(this.railTableMatrix, this.railTableMatrix, [ -5, -1, 20]);

	this.railTableMatrix2 = mat4.create();
	mat4.identity(this.railTableMatrix2);
	mat4.translate(this.railTableMatrix2, this.railTableMatrix2, [ 45, -1, 20]);

	this.sideRailTableMatrix = mat4.create();
	mat4.identity(this.sideRailTableMatrix);
	mat4.translate(this.sideRailTableMatrix, this.sideRailTableMatrix, [ 20, -1, -7]);
	mat4.scale(this.sideRailTableMatrix, this.sideRailTableMatrix, [0.75, 1, 1]);
	mat4.rotate(this.sideRailTableMatrix, this.sideRailTableMatrix, Math.PI / 2, [ 0, 1, 0]);

	this.sideRailTableMatrix2 = mat4.create();
	mat4.identity(this.sideRailTableMatrix2);
	mat4.translate(this.sideRailTableMatrix2, this.sideRailTableMatrix2, [ 20, -1, 47]);
	mat4.scale(this.sideRailTableMatrix2, this.sideRailTableMatrix2, [0.75, 1, 1]);
	mat4.rotate(this.sideRailTableMatrix2, this.sideRailTableMatrix2, Math.PI / 2, [ 0, 1, 0]);

	this.counterMatrix = mat4.create();
	mat4.identity(this.counterMatrix);
	mat4.translate(this.counterMatrix, this.counterMatrix, [ -70, -25, -50]);

	this.counterTopMatrix = mat4.create();
	mat4.identity(this.counterTopMatrix);
	mat4.translate(this.counterTopMatrix, this.counterTopMatrix, [ -70, -4, -50]);


	this.casinoFloorMatrix = mat4.create();
	mat4.identity(this.casinoFloorMatrix);
	mat4.translate(this.casinoFloorMatrix, this.casinoFloorMatrix, [ 5, -50, -5]);
	mat4.rotate(this.casinoFloorMatrix, this.casinoFloorMatrix, Math.PI / 2, [1, 0, 0]);


	this.casinoChairMatrix = mat4.create();
	mat4.identity(this.casinoChairMatrix);
	mat4.translate(this.casinoChairMatrix, this.casinoChairMatrix, [ -45, -23, 10]);


	this.casinoChairMatrix2 = mat4.create();
	mat4.identity(this.casinoChairMatrix2);
	mat4.translate(this.casinoChairMatrix2, this.casinoChairMatrix2, [ -45, -23, -40]);

	this.casinoChairMatrix3 = mat4.create();
	mat4.identity(this.casinoChairMatrix3);
	mat4.translate(this.casinoChairMatrix3, this.casinoChairMatrix3, [ -45, -23, -90]);

	this.casinoChairMatrix4 = mat4.create();
	mat4.identity(this.casinoChairMatrix4);
	mat4.translate(this.casinoChairMatrix4, this.casinoChairMatrix4, [ 0, -23, -100]);
	mat4.rotate(this.casinoChairMatrix4, this.casinoChairMatrix4, -Math.PI / 2, [0, 1, 0]);

	this.sideCounterMatrix = mat4.create();
	mat4.identity(this.sideCounterMatrix);
	mat4.translate(this.sideCounterMatrix, this.sideCounterMatrix, [ -10, -25, -125]);
	
}


Environment.prototype.initSceneAppearances = function () {

	this.scene.defaultMaterial = new CGFappearance(this.scene);
	this.scene.roomWallMaterial = new CGFappearance(this.scene);
	this.scene.textMaterial = new CGFappearance(this.scene);
	this.scene.woodMaterial = new CGFappearance(this.scene);
	this.scene.carpetMaterial = new CGFappearance(this.scene);
	this.scene.roomFloorMaterial = new CGFappearance(this.scene);
	this.scene.paintMaterial = new CGFappearance(this.scene);
	this.scene.darkWoodMaterial = new CGFappearance(this.scene);
	this.scene.darkWoodMaterial2 = new CGFappearance(this.scene);
	this.scene.tilesMaterial = new CGFappearance(this.scene);
	this.scene.brickMaterial = new CGFappearance(this.scene);
	this.scene.landscapeMaterial = new CGFappearance(this.scene);
	this.scene.casinoTableMaterial = new CGFappearance(this.scene);
	this.scene.casinoFloorMaterial = new CGFappearance(this.scene);

	this.scene.blackMaterial = new CGFappearance(this.scene);
	this.scene.blackMaterial.setAmbient(0.13,0.13,0.13,1);
	this.scene.blackMaterial.setDiffuse(0.13,0.13,0.13,1);
	this.scene.blackMaterial.setSpecular(0.13,0.13,0.13,1);
	this.scene.blackMaterial.setShininess(0);

	this.scene.whiteMaterial = new CGFappearance(this.scene);
	this.scene.whiteMaterial.setAmbient(0.9,0.9,0.9,1);
	this.scene.whiteMaterial.setDiffuse(0.9,0.9,0.9,1);
	this.scene.whiteMaterial.setSpecular(0.9,0.9,0.9,1);
	this.scene.whiteMaterial.setShininess(0);

	this.scene.redMaterial = new CGFappearance(this.scene);
	this.scene.redMaterial.setAmbient(1,0.2,0.2,1);
	this.scene.redMaterial.setDiffuse(1,0.2,0.2,1);
	this.scene.redMaterial.setSpecular(1,0.2,0.2,1);
	this.scene.redMaterial.setShininess(0);

	this.scene.orangeMaterial = new CGFappearance(this.scene);
	this.scene.orangeMaterial.setAmbient(1,0.6,0.2,1);
	this.scene.orangeMaterial.setDiffuse(1,0.6,0.2,1);
	this.scene.orangeMaterial.setSpecular(1,0.6,0.2,1);
	this.scene.orangeMaterial.setShininess(0);

	this.scene.yellowMaterial = new CGFappearance(this.scene);
	this.scene.yellowMaterial.setAmbient(1,1,0.2,1);
	this.scene.yellowMaterial.setDiffuse(1,1,0.2,1);
	this.scene.yellowMaterial.setSpecular(1,1,0.2,1);
	this.scene.yellowMaterial.setShininess(0);

	this.scene.greenMaterial = new CGFappearance(this.scene);
	this.scene.greenMaterial.setAmbient(0.2,1,0.2,1);
	this.scene.greenMaterial.setDiffuse(0.2,1,0.2,1);
	this.scene.greenMaterial.setSpecular(0.2,1,0.2,1);
	this.scene.greenMaterial.setShininess(0);

	this.scene.blueMaterial = new CGFappearance(this.scene);
	this.scene.blueMaterial.setAmbient(0,0.5,1,1);
	this.scene.blueMaterial.setDiffuse(0,0.5,1,1);
	this.scene.blueMaterial.setSpecular(0,0.5,1,1);
	this.scene.blueMaterial.setShininess(0);

	this.scene.purpleMaterial = new CGFappearance(this.scene);
	this.scene.purpleMaterial.setAmbient(0.4,0.1,1,1);
	this.scene.purpleMaterial.setDiffuse(0.4,0.1,1,1);
	this.scene.purpleMaterial.setSpecular(0.4,0.1,1,1);
	this.scene.purpleMaterial.setShininess(0);

	this.scene.lilacMaterial = new CGFappearance(this.scene);
	this.scene.lilacMaterial.setAmbient(0.78,0.27,1,1);
	this.scene.lilacMaterial.setDiffuse(0.78,0.27,1,1);
	this.scene.lilacMaterial.setSpecular(0.78,0.27,1,1);
	this.scene.lilacMaterial.setShininess(0);

	this.scene.textShader = new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");
	this.scene.textShader.setUniformsValues({'dims': [16, 16]});
	this.scene.fontTexture = new CGFtexture(this.scene, "res/oolite-font.png");

	this.scene.whitetower = new CGFtexture(this.scene, "res/whitetower.png");
	this.scene.blacktower = new CGFtexture(this.scene, "res/blacktower.png");
	this.scene.wood = new CGFtexture(this.scene, "res/wood.jpeg");
	this.scene.carpet = new CGFtexture(this.scene, "res/carpet.jpg");
	this.scene.floor = new CGFtexture(this.scene, "res/floor.jpg");
	this.scene.paint = new CGFtexture(this.scene, "res/paint.jpg");
	this.scene.darkWood = new CGFtexture(this.scene, "res/darkWood.jpg");
	this.scene.darkWood2 = new CGFtexture(this.scene, "res/darkWood2.jpg");
	this.scene.tiles = new CGFtexture(this.scene, "res/tiles.jpg");
	this.scene.brick = new CGFtexture(this.scene, "res/brick.jpg");
	this.scene.landscape = new CGFtexture(this.scene, "res/landscape.jpg");
	this.scene.casinoTable = new CGFtexture(this.scene, "res/casinoTable.jpg");
	this.scene.casinoFloor = new CGFtexture(this.scene, "res/casinoFloor.jpg");

	this.scene.textMaterial.setTexture(this.scene.fontTexture);
	this.scene.woodMaterial.setTexture(this.scene.wood);
	this.scene.carpetMaterial.setTexture(this.scene.carpet);
	this.scene.paintMaterial.setTexture(this.scene.paint);
	this.scene.roomFloorMaterial.setTexture(this.scene.floor);
	this.scene.darkWoodMaterial.setTexture(this.scene.darkWood);
	this.scene.darkWoodMaterial2.setTexture(this.scene.darkWood2);
	this.scene.tilesMaterial.setTexture(this.scene.tiles);
	this.scene.brickMaterial.setTexture(this.scene.brick);
	this.scene.landscapeMaterial.setTexture(this.scene.landscape);
	this.scene.casinoTableMaterial.setTexture(this.scene.casinoTable);
	this.scene.casinoFloorMaterial.setTexture(this.scene.casinoFloor);

}
