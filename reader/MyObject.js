/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyObject(scene, rootNode) {
	CGFobject.call(this,scene);

	this.rootNode = rootNode;

};

MyObject.prototype = Object.create(CGFobject.prototype);
MyObject.prototype.constructor= MyObject;

MyObject.prototype.display = function () {
	this.displayRoot(this.rootNode, [], [], []);
};


MyObject.prototype.displayRoot = function (rootNode, rotations, translations, scales){
	
	if(rootNode != null){

		if(rootNode.id == "square" || 
			rootNode.id == "sphere" || 
			rootNode.id == "cylinder")
				return rootNode.id;

		if(rootNode.rotation != null){
			rotations.push(rootNode.rotation);
		}

		if(rootNode.translation != null){
			translations.push(rootNode.translation);
		}

		if(rootNode.scale != null){
			scales.push(rootNode.scale);
		}

		for(var i = 0; i < rootNode.descendants.length; i++){
			var returnValue = this.displayRoot(rootNode.descendants[i], rotations, translations, scales);
			switch(returnValue){
				case "square":
					var square = new Square(this.scene, 0, 1, 1,0);
					square.display();
					break;
				case "sphere":
					break;
				case "cylinder":
					break;
			}
		}
	}

	return 0;
}
