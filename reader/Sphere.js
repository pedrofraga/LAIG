/**
 * Sphere
 * @constructor
 */
 
 function Sphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {
	
 	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var stack = 1/this.stacks;
	//---------------stacks------------------
	for (var q = 0; q <= 1;) {
		//---------------slices------------------
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(Math.sqrt(1-(q*q))*Math.cos(i*(2*Math.PI)/this.slices));
			this.vertices.push(Math.sqrt(1-(q*q))*Math.sin(i*(2*Math.PI)/this.slices));
			this.vertices.push(q);

			this.normals.push(Math.sqrt(1-(q*q))*Math.cos(i*(2*Math.PI)/this.slices));
			this.normals.push(Math.sqrt(1-(q*q))*Math.sin(i*(2*Math.PI)/this.slices));
			this.normals.push(q);
		}

		q = q + stack;
	}

	for (var q = 0; q < this.stacks; q++) {
		//---------------slices------------------
		for (var i = 0; i < this.slices; i++) {

			this.indices.push(this.slices*q+i);
			this.indices.push(this.slices*q+i+1);
			this.indices.push(this.slices*(q+1)+i);
			if (i != (this.slices - 1)) {
				this.indices.push(this.slices*(q+1)+i+1);
				this.indices.push(this.slices*(q+1)+i);
				this.indices.push(this.slices*q+i+1);
				}
			else {
				this.indices.push(this.slices*q);
				this.indices.push(this.slices*q+i+1)
				this.indices.push(this.slices*q+i);
				}
		}
	}

	var s = 0;
	var t = 0;
	var sinc = 1/this.slices;
	var tinc = 1/this.stacks;
	for (var a = 0; a <= this.stacks; a++) {
		for (var b = 0; b < this.slices; b++) {
			this.texCoords.push(s, t);
			s += sinc;
		}
		s = 0;
		t += tinc;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };