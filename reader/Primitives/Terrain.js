function Terrain(scene, terrain) {

	this.scene = scene;

	this.fragPath = terrain.fragPath;

	this.vertPath = terrain.vertPath;

	CGFshader.call(this, this.scene.gl, this.vertPath, this.fragPath);
}