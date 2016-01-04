 /**
 * Cube
 * @constructor
 */

function Cube(scene, width, height, depth) {
  
  CGFobject.call(this,scene);
  this.scene = scene;

  width = typeof width !== 'undefined' ? width : 1;
  height = typeof height !== 'undefined' ? height : 1;
  depth = typeof depth !== 'undefined' ? depth : 1;

  this.width = width;
  this.height = height;
  this.depth = depth;

  this.square = new Square(this.scene, -0.5, 0.5, 0.5, -0.5);

  this.createInitialMatrixes();

};

Cube.prototype = Object.create(CGFobject.prototype);
Cube.prototype.constructor = Cube;

Cube.prototype.display = function () {
  
  for (var i = 0; i < this.initialMatrixes.length; i++) {

    this.scene.pushMatrix();
    this.scene.multMatrix(this.initialMatrixes[i]);
    this.square.display();
    this.scene.popMatrix();

  }

};


Cube.prototype.createInitialMatrixes = function () {

  this.initialMatrixes = [];

  var frontMatrix = mat4.create();
  mat4.identity(frontMatrix);
  mat4.translate(frontMatrix, frontMatrix, [0, 0, this.depth / 2]);
  mat4.scale(frontMatrix, frontMatrix, [this.width, this.height , 1]);
  this.initialMatrixes.push(frontMatrix);

  var backMatrix = mat4.create();
  mat4.identity(backMatrix);
  mat4.translate(backMatrix, backMatrix, [0, 0, -this.depth / 2]);
  mat4.scale(backMatrix, backMatrix, [this.width, this.height, 1]);
  mat4.rotate(backMatrix, backMatrix, Math.PI, [0, 1, 0]);
  this.initialMatrixes.push(backMatrix);

  var leftMatrix = mat4.create();
  mat4.identity(leftMatrix);
  mat4.translate(leftMatrix, leftMatrix, [- this.width / 2, 0, 0]);
  mat4.scale(leftMatrix, leftMatrix, [1, this.height, this.depth]);
  mat4.rotate(leftMatrix, leftMatrix, - Math.PI / 2, [0, 1, 0]);
  this.initialMatrixes.push(leftMatrix);

  var rightMatrix = mat4.create();
  mat4.identity(rightMatrix);
  mat4.translate(rightMatrix, rightMatrix, [ this.width / 2, 0, 0]);
  mat4.scale(rightMatrix, rightMatrix, [1, this.height, this.depth]);
  mat4.rotate(rightMatrix, rightMatrix, Math.PI / 2, [0, 1, 0]);
  this.initialMatrixes.push(rightMatrix);


  var topMatrix = mat4.create();
  mat4.identity(topMatrix);
  mat4.translate(topMatrix, topMatrix, [0, this.height / 2 , 0]);
  mat4.scale(topMatrix, topMatrix, [this.width, 1, this.depth]);
  mat4.rotate(topMatrix, topMatrix, - Math.PI / 2, [1, 0, 0]);
  this.initialMatrixes.push(topMatrix);

  var bottomMatrix = mat4.create();
  mat4.identity(bottomMatrix);
  mat4.translate(bottomMatrix, bottomMatrix, [0, - this.height / 2 , 0]);
  mat4.scale(bottomMatrix, bottomMatrix, [this.width, 1, this.depth]);
  mat4.rotate(bottomMatrix, bottomMatrix, Math.PI / 2, [1, 0, 0]);
  this.initialMatrixes.push(bottomMatrix);

}