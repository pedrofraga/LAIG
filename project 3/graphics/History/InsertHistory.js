/**
 * Constructor of an insert history object to save info about tower inserts. This object improves project organization.
 *	
 * @constructor InsertHistory
 * @param 	{string}	color 		Color of inserted tower
 * @param 	{int}		x 		X of inserted piece
 * @param 	{int}		y 		Y of inserted piece
 *
 */


function InsertHistory (color, x, y) {
	this.color = color
	this.x = typeof x === 'undefined' ? 6 : x;
	this.y = typeof y === 'undefined' ? 6 : y;
}