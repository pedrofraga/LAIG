
 function MyCircle(scene, radius, slices) {
 	CGFobject.call(this,scene);
  this.radius = radius;
  this.slices = slices;
 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {


  this.vertices = [
  ];

  this.indices = [
  ];

  this.normals = [
  ];

  this.texCoords = [ ];

  var indice = 0;
  var angle = Math.PI * 2 / this.slices;

  this.vertices.push(0);
  this.vertices.push(0);
  this.vertices.push(0);
  this.normals.push(0);
  this.normals.push(0);
  this.normals.push(1);
  this.texCoords.push(0.5,0.5);

  for(var i = 0; i < this.slices; i++){
    this.texCoords.push(0.5*Math.cos(indice) + 0.5, 0.5 - (0.5*Math.sin(indice)));
    this.vertices.push(this.radius*Math.cos(indice));
    this.vertices.push(this.radius*Math.sin(indice));
    this.vertices.push(0);
    this.normals.push(0);
    this.normals.push(0);
    this.normals.push(1);
    indice = angle * (i + 1);
  }


  indice = 1;
  
  for(var i = 0; i < this.slices; i++){
    this.indices.push(0);
    if(i == this.slices - 1){
      this.indices.push(indice);
      this.indices.push(1);
    }else{
      this.indices.push(indice);
      this.indices.push(indice + 1);
      indice = indice + 1;
    }
  }


  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};