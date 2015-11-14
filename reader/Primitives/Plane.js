
function Plane(scene, nurb) {

	this.knotsU = getKnots(nurb.partsU);

	this.knotsV = getKnots(nurb.partsV);

	this.vertexes = getNurbVertexes(nurb.partsU, nurb.partsV, nurb.controlPoints);
		
	this.nurbsSurface = new CGFnurbsSurface(nurb.partsU, nurb.partsV, this.knotsU, this.knotsV, this.vertexes);

	CGFnurbsObject.call(this, scene, this.getSurfacePoint, 20, 20);
}


Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor=Plane;


Plane.prototype.getSurfacePoint = function () {
	return this.nurbsSurface.getPoint(u, v);
};





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



getNurbVertexes = function(partsU, partsV, controlPoints) {
	var vertexes = [];

	var pos = 0;

	for(var i = 0; i < partsU + 1; i++) {
		var group = [];
		for(var j = 0; j < partsV + 1; j++) {
			group.push(controlPoints[pos]);
			pos++;
		}
		vertexes.push(group);
	}
	return vertexes;
	
}