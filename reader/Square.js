/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Square(scene, minX, minY, maxX, maxY) {
	CGFobject.call(this,scene);
	
	this.minS = 0;
	this.maxS = 1;
	this.minT = 1;
	this.maxT = 0;

	this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;

	this.initBuffers();
};

Square.prototype = Object.create(CGFobject.prototype);
Square.prototype.constructor=Square;

Square.prototype.initBuffers = function () {

	this.vertices = [
            this.minX, this.maxY, 0,
            this.maxX, this.maxY, 0,
            this.minX, this.minY, 0,
            this.maxX, this.minY, 0
			];

	this.indices = [
            0, 1, 2, 
			3, 2, 1
        ];
	
	this.primitiveType=this.scene.gl.TRIANGLES;
	
	this.normals = [
             0,0,1,
             0,0,1,
             0,0,1,
             0,0,1		
        ];

	this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT,
		];

	
	this.initGLBuffers();

};
