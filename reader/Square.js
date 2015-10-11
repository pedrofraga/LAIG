/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Square(scene, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);
	
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;

	this.initBuffers();
};

Square.prototype = Object.create(CGFobject.prototype);
Square.prototype.constructor=Square;

Square.prototype.initBuffers = function () {

	this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0
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
