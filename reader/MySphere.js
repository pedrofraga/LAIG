/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, args)
 {
        CGFobject.call(this,scene);
       
        this.radious=parseFloat(args[0]);
        this.slices=parseFloat(args[1]);
        this.stacks=parseFloat(args[2]);
        this.initBuffers();
 };
 
 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;
 
 MySphere.prototype.initBuffers = function()
 {
 
        var horizontalStep = 2*Math.PI / this.slices;
        var verticalStep = 0.5*Math.PI / this.stacks;
 
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
 
        var verticalAtual = 0;
        var verticalDepois = verticalStep;
        var parte = 0;
        var stage = 4 * this.slices;
        var numVertexes = 0;
       
        for (j = 0; j < this.stacks; j++)
        {
               
                var horizontalAtual = 0;
                var seccao = 0;
 
                for (i = 0; i < this.slices; i++)
                {
                       
                        var coordX0 = Math.sin(verticalAtual) * Math.cos(horizontalAtual)*this.radious;
                        var coordY0 = Math.cos(verticalAtual)*this.radious;
                        var coordZ0 = Math.sin(verticalAtual) * Math.sin(horizontalAtual)*this.radious;
 
                        this.vertices.push(coordX0);
                        this.normals.push(coordX0);
                        this.vertices.push(coordY0);
                        this.normals.push(coordY0);
                        this.vertices.push(coordZ0);
                        this.normals.push(coordZ0);
                        numVertexes++;
 
                        var coordX2 = Math.sin(verticalDepois) * Math.cos(horizontalAtual)*this.radious;
                        var coordY2 = Math.cos(verticalDepois)*this.radious;
                        var coordZ2 = Math.sin(verticalDepois) * Math.sin(horizontalAtual)*this.radious;
 
                        horizontalAtual += horizontalStep;
 
                        var coordX1 = Math.sin(verticalAtual) * Math.cos(horizontalAtual)*this.radious;
                        var coordY1 = Math.cos(verticalAtual)*this.radious;
                        var coordZ1 = Math.sin(verticalAtual) * Math.sin(horizontalAtual)*this.radious;
 
                        this.vertices.push(coordX1);
                        this.normals.push(coordX1);
                        this.vertices.push(coordY1);
                        this.normals.push(coordY1);
                        this.vertices.push(coordZ1);
                        this.normals.push(coordZ1);
                        numVertexes++;
 
                        var coordX3 = Math.sin(verticalDepois) * Math.cos(horizontalAtual)*this.radious;
                        var coordY3 = Math.cos(verticalDepois)*this.radious;
                        var coordZ3 = Math.sin(verticalDepois) * Math.sin(horizontalAtual)*this.radious;
 
                       
                        this.vertices.push(coordX2);
                        this.normals.push(coordX2);
                        this.vertices.push(coordY2);
                        this.normals.push(coordY2);
                        this.vertices.push(coordZ2);
                        this.normals.push(coordZ2);
                        numVertexes++;
 
                        this.vertices.push(coordX3);
                        this.normals.push(coordX3);
                        this.vertices.push(coordY3);
                        this.normals.push(coordY3);
                        this.vertices.push(coordZ3);
                        this.normals.push(coordZ3);
                        numVertexes++;
 
                        var k = seccao + parte;
 
                        this.indices.push(k, k + 1, k + 2);                    
                        this.indices.push(k + 3, k + 2, k + 1);
 
                        seccao += 4;
                        this.texCoords.push(1 - i / this.slices, j / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
                        this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
 
                       
                }                      
               
                parte += stage;
                verticalAtual += verticalStep;
                verticalDepois += verticalStep;
 
        }
 
 
        verticalAtual = 0;
        verticalDepois = verticalStep;
        parte = 0;
        stage = 4 * this.slices;
 
        for (j = 0; j < this.stacks; j++)
        {
               
                var horizontalAtual = 0;
                var seccao = 0;
 
                for (i = 0; i < this.slices; i++)
                {
                       
                        var coordX0 = Math.sin(verticalAtual) * Math.cos(horizontalAtual)*this.radious;
                        var coordY0 = -Math.cos(verticalAtual)*this.radious;
                        var coordZ0 = Math.sin(verticalAtual) * Math.sin(horizontalAtual)*this.radious;
 
                        this.vertices.push(coordX0);
                        this.normals.push(coordX0);
                        this.vertices.push(coordY0);
                        this.normals.push(coordY0);
                        this.vertices.push(coordZ0);
                        this.normals.push(coordZ0);
 
                        var coordX2 = Math.sin(verticalDepois) * Math.cos(horizontalAtual)*this.radious;
                        var coordY2 = -Math.cos(verticalDepois)*this.radious;
                        var coordZ2 = Math.sin(verticalDepois) * Math.sin(horizontalAtual)*this.radious;
 
                        horizontalAtual += horizontalStep;
 
                        var coordX1 = Math.sin(verticalAtual) * Math.cos(horizontalAtual)*this.radious;
                        var coordY1 = -Math.cos(verticalAtual)*this.radious;
                        var coordZ1 = Math.sin(verticalAtual) * Math.sin(horizontalAtual)*this.radious;
 
                        this.vertices.push(coordX1);
                        this.normals.push(coordX1);
                        this.vertices.push(coordY1);
                        this.normals.push(coordY1);
                        this.vertices.push(coordZ1);
                        this.normals.push(coordZ1);
 
                        var coordX3 = Math.sin(verticalDepois) * Math.cos(horizontalAtual)*this.radious;
                        var coordY3 = -Math.cos(verticalDepois)*this.radious;
                        var coordZ3 = Math.sin(verticalDepois) * Math.sin(horizontalAtual)*this.radious;
 
                       
                        this.vertices.push(coordX2);
                        this.normals.push(coordX2);
                        this.vertices.push(coordY2);
                        this.normals.push(coordY2);
                        this.vertices.push(coordZ2);
                        this.normals.push(coordZ2);
 
                        this.vertices.push(coordX3);
                        this.normals.push(coordX3);
                        this.vertices.push(coordY3);
                        this.normals.push(coordY3);
                        this.vertices.push(coordZ3);
                        this.normals.push(coordZ3);
 
                        var k = seccao + parte;
 
                        this.indices.push(numVertexes + k + 1, numVertexes + k, numVertexes + k + 2);                  
                        this.indices.push(numVertexes + k + 2,numVertexes + k + 3, numVertexes + k + 1);
 
                        seccao += 4;
                        this.texCoords.push(1 - i / this.slices, j / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
                        this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
 
                }                      
               
                parte += stage;
                verticalAtual += verticalStep;
                verticalDepois += verticalStep;
 
        }
 
 
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
 
};