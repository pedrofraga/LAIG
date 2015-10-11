/**
 * MyCylinder
 * @constructor
 */
 function Cylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;



 	this.initBuffers();
 };

 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Prism;
 
 Cylinder.prototype.initBuffers = function() {
 

    this.vertices = [
 	];

 	this.indices = [
 	];

 	this.normals = [
 	];

	this.texCoords = [
	];

 	var angulo = (2*Math.PI) / this.slices;
	for (var q = 0; q <= this.stacks; q++) {
		for (var i = 0; i < this.slices; i++) {
		this.vertices.push(0.5 * Math.cos(i*angulo));
		this.vertices.push(0.5 * Math.sin(i*angulo));
		this.vertices.push(q);

		this.normals.push(0.5 * Math.cos(i*angulo));
		this.normals.push(0.5 * Math.sin(i*angulo));
		this.normals.push(0);
		}
	}
	
	
	for (var q = 0; q < this.stacks; q++) {
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
	var tinc = 1/this.stacks;
	var sinc = 1/this.slices;

	for(var i = 0; i <= this.stacks ; i++){
		for(var j = 0; j < this.slices; j++){
			this.texCoords.push(s, t);
			s += sinc;
		}
		s = 0;
		t += tinc;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
