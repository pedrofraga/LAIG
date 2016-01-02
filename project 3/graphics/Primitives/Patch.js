 /**
 * Patch
 * @constructor
 */

function Patch(scene, nurbs) {

	this.scene = scene;

	this.knotsV = this.knotsU = getKnots(nurbs.order);

	this.vertexes = getNurbVertexes(nurbs.order, nurbs.controlPoints);
		
	this.nurbsSurface = new CGFnurbsSurface(nurbs.order, nurbs.order, this.knotsU, this.knotsV, this.vertexes);

	CGFnurbsObject.call(this, this.scene, this.getSurfacePoint, nurbs.partsU, nurbs.partsV);
}


Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor=Patch;


Patch.prototype.getSurfacePoint = function (u, v) {
	return this.nurbsSurface.getPoint(u, v);
};

Patch.prototype.display = function() {
	this.scene.pushMatrix();
		CGFnurbsObject.prototype.display.call(this);
	this.scene.popMatrix();
}



getKnots = function(parts) {
	var knots = [];
	var size = (parts + 1) * 2;

	for(var i = 0; i < size; i++) {
		if(i < (size / 2))
			knots.push(0);
		else
			knots.push(1);
	}
	return knots;
}



getNurbVertexes = function(order, controlPoints) {
	var vertexes = [];

	var pos = 0;

	for(var i = 0; i < order + 1; i++) {
		var group = [];
		for(var j = 0; j < order + 1; j++) {
			group.push(controlPoints[pos]);
			pos++;
		}
		vertexes.push(group);
	}
	return vertexes;
	
}