

function Environment(scene) {

	this.scene = scene;
	this.initSceneAppearances();


	this.table = new Obj(this.scene, 'res/table.obj');
	this.shuttle = new Obj(this.scene, 'res/shuttle.obj');
	this.chess = new Obj(this.scene, 'res/chess.obj');
	this.wall = new Cube(this.scene, 200, 200, 1);
	this.floor = new Cube(this.scene, 400, 400, 1);
	this.carpet = new Cube(this.scene, 110, 1, 175);

	this.initMatrixes();

}

Environment.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.multMatrix(this.tableMatrix);
	this.scene.blackMaterial.apply();
	this.table.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.shuttleMatrix);
	this.scene.whiteMaterial.apply();
	this.shuttle.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.chessMatrix);
	this.scene.whiteMaterial.apply();
	this.chess.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.chessMatrix2);
	this.scene.blackMaterial.apply();
	this.chess.display();
	this.scene.popMatrix();


	this.scene.pushMatrix();
	this.scene.multMatrix(this.wallMatrix);
	this.scene.defaultMaterial.apply();
	this.wall.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.wallMatrix2);
	this.scene.defaultMaterial.apply();
	this.wall.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.floorMatrix);
	this.scene.floorMaterial.apply();
	this.floor.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.carpetMatrix);
	this.scene.carpetMaterial.apply();
	this.carpet.display();
	this.scene.popMatrix();

}


Environment.prototype.initMatrixes = function () {

	this.tableMatrix = mat4.create();
	mat4.identity(this.tableMatrix);
	mat4.translate(this.tableMatrix, this.tableMatrix, [20, -2, 20]);
	mat4.rotate(this.tableMatrix, this.tableMatrix, Math.PI / 2, [0, 1, 0]);

	this.shuttleMatrix = mat4.create();
	mat4.identity(this.shuttleMatrix);
	mat4.translate(this.shuttleMatrix, this.shuttleMatrix, [ -5, -1, 20]);

	this.chessMatrix = mat4.create();
	mat4.identity(this.chessMatrix);
	mat4.translate(this.chessMatrix, this.chessMatrix, [ 25, -2, 45]);

	this.chessMatrix2 = mat4.create();
	mat4.identity(this.chessMatrix2);
	mat4.translate(this.chessMatrix2, this.chessMatrix2, [ 15, -2, 45]);

	this.wallMatrix = mat4.create();
	mat4.identity(this.wallMatrix);
	mat4.translate(this.wallMatrix, this.wallMatrix, [ -125, -50, -225]);

	this.wallMatrix2 = mat4.create();
	mat4.identity(this.wallMatrix2);
	mat4.translate(this.wallMatrix2, this.wallMatrix2, [ -225, -50, -125]);
	mat4.rotate(this.wallMatrix2, this.wallMatrix2, Math.PI / 2, [0, 1, 0]);

	this.floorMatrix = mat4.create();
	mat4.identity(this.floorMatrix);
	mat4.translate(this.floorMatrix, this.floorMatrix, [ -25, -150, -25]);
	mat4.rotate(this.floorMatrix, this.floorMatrix, Math.PI / 2, [1, 0, 0]);

	this.carpetMatrix = mat4.create();
	mat4.identity(this.carpetMatrix);
	mat4.translate(this.carpetMatrix, this.carpetMatrix, [ 60, -145, 25]);

}


Environment.prototype.initSceneAppearances = function () {

	this.scene.defaultMaterial = new CGFappearance(this.scene);
	this.scene.textMaterial = new CGFappearance(this.scene);
	this.scene.woodMaterial = new CGFappearance(this.scene);
	this.scene.carpetMaterial = new CGFappearance(this.scene);
	this.scene.floorMaterial = new CGFappearance(this.scene);

	this.scene.blackMaterial = new CGFappearance(this.scene);
	this.scene.blackMaterial.setAmbient(0.13,0.13,0.13,0.5);
	this.scene.blackMaterial.setDiffuse(0.13,0.13,0.13,0.5);
	this.scene.blackMaterial.setSpecular(0.13,0.13,0.13,0.5);
	this.scene.blackMaterial.setShininess(0);

	this.scene.whiteMaterial = new CGFappearance(this.scene);
	this.scene.whiteMaterial.setAmbient(0.9,0.9,0.9,0.5);
	this.scene.whiteMaterial.setDiffuse(0.9,0.9,0.9,0.5);
	this.scene.whiteMaterial.setSpecular(0.9,0.9,0.9,0.5);
	this.scene.whiteMaterial.setShininess(0);

	this.scene.redMaterial = new CGFappearance(this.scene);
	this.scene.redMaterial.setAmbient(1,0.2,0.2,0);
	this.scene.redMaterial.setDiffuse(1,0.2,0.2,0.5);
	this.scene.redMaterial.setSpecular(1,0.2,0.2,0);
	this.scene.redMaterial.setShininess(0);


	this.scene.orangeMaterial = new CGFappearance(this.scene);
	this.scene.orangeMaterial.setAmbient(1,0.6,0.2,0);
	this.scene.orangeMaterial.setDiffuse(1,0.6,0.2,0.5);
	this.scene.orangeMaterial.setSpecular(1,0.6,0.2,0);
	this.scene.orangeMaterial.setShininess(0);

	this.scene.yellowMaterial = new CGFappearance(this.scene);
	this.scene.yellowMaterial.setAmbient(1,1,0.2,0);
	this.scene.yellowMaterial.setDiffuse(1,1,0.2,0.5);
	this.scene.yellowMaterial.setSpecular(1,1,0.2,0);
	this.scene.yellowMaterial.setShininess(0);

	this.scene.greenMaterial = new CGFappearance(this.scene);
	this.scene.greenMaterial.setAmbient(0.2,1,0.2,0);
	this.scene.greenMaterial.setDiffuse(0.2,1,0.2,0.5);
	this.scene.greenMaterial.setSpecular(0.2,1,0.2,0);
	this.scene.greenMaterial.setShininess(0);

	this.scene.blueMaterial = new CGFappearance(this.scene);
	this.scene.blueMaterial.setAmbient(0,0.5,1,0);
	this.scene.blueMaterial.setDiffuse(0,0.5,1,0.5);
	this.scene.blueMaterial.setSpecular(0,0.5,1,0);
	this.scene.blueMaterial.setShininess(0);

	this.scene.purpleMaterial = new CGFappearance(this.scene);
	this.scene.purpleMaterial.setAmbient(0.4,0.1,1,0);
	this.scene.purpleMaterial.setDiffuse(0.4,0.1,1,0.5);
	this.scene.purpleMaterial.setSpecular(0.4,0.1,1,00);
	this.scene.purpleMaterial.setShininess(0);

	this.scene.lilacMaterial = new CGFappearance(this.scene);
	this.scene.lilacMaterial.setAmbient(0.78,0.27,1,0);
	this.scene.lilacMaterial.setDiffuse(0.78,0.27,1,0.5);
	this.scene.lilacMaterial.setSpecular(0.78,0.27,1,0);
	this.scene.lilacMaterial.setShininess(0);

	this.scene.textShader = new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");
	this.scene.textShader.setUniformsValues({'dims': [16, 16]});
	this.scene.fontTexture = new CGFtexture(this.scene, "res/oolite-font.png");

	this.scene.whitetower = new CGFtexture(this.scene, "res/whitetower.png");
	this.scene.blacktower = new CGFtexture(this.scene, "res/blacktower.png");
	this.scene.wood = new CGFtexture(this.scene, "res/wood.jpeg");
	this.scene.carpet = new CGFtexture(this.scene, "res/carpet.jpg");
	this.scene.floor = new CGFtexture(this.scene, "res/floor.jpg");

	this.scene.textMaterial.setTexture(this.scene.fontTexture);
	this.scene.woodMaterial.setTexture(this.scene.wood);
	this.scene.carpetMaterial.setTexture(this.scene.carpet);
	this.scene.floorMaterial.setTexture(this.scene.floor);
	this.scene.floorMaterial.setTextureWrap('REPEAT', 'REPEAT');

}
