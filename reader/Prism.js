/**
 * MyPrism
 * @constructor
 */
 function Prism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 Prism.prototype = Object.create(CGFobject.prototype);
 Prism.prototype.constructor = Prism;

 Prism.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

    this.vertices = [
 	];

 	this.indices = [
 	];

 	this.normals = [
 	];


 	
    //V1 
    var angulo = Math.PI * 2 / this.slices;
    var vertice2 = angulo;
    var vertice = 0;
    var altura = this.stacks;
    var indice = 0;
    for( var s = 0; s < this.stacks; s++){
      
    for(var i = 0; i <= this.slices; i++){
        //1 vertice
        var y = Math.sin(vertice2) * 0.5;
        var x = y / Math.tan(vertice2);
        var z = s;
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);
        //1 Normal
        this.normals.push(Math.cos(angulo * (i + 0.5)));
        this.normals.push(Math.sin(angulo * (i + 0.5)));
        this.normals.push(0);
        //2 vertice
        var y = Math.sin(vertice) * 0.5;
        var x = y / Math.tan(vertice);
        var z = s;
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);
        //2 Normal
        this.normals.push(Math.cos(angulo * (i + 0.5)));
        this.normals.push(Math.sin(angulo * (i + 0.5)));
        this.normals.push(0);
        //3 vertice
        var y = Math.sin(vertice2) * 0.5;
        var x = y / Math.tan(vertice2);
        var z = s + 1;
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);
        //3 Normal
        this.normals.push(Math.cos(angulo * (i + 0.5)));
        this.normals.push(Math.sin(angulo * (i + 0.5)));
        this.normals.push(0);
        //4 vertice
        var y = Math.sin(vertice) * 0.5;
        var x = y / Math.tan(vertice);
        var z = s + 1;
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);
        //4 Normal
        this.normals.push(Math.cos(angulo * (i + 0.5)));
        this.normals.push(Math.sin(angulo * (i + 0.5)));
        this.normals.push(0);

        vertice = vertice + angulo;
        vertice2 = vertice2 + angulo;



        this.indices.push(indice + 2);
        this.indices.push(indice + 1);
        this.indices.push(indice);

        this.indices.push(indice + 1);
        this.indices.push(indice + 2);
        this.indices.push(indice + 3);
        indice = indice + 4;
    }
    vertice2 = angulo;
    vertice = 0;
    }
    

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
