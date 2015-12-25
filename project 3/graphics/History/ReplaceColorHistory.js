/**
 * Constructor of a replace color object to save info about pieces which color was replaced. This object improves project organization.
 *	
 * @constructor ReplaceColorHistory
 * @param 	 {string}	color 	Piece previous color
 * @param 	 {int}	x 		Piece x coord
 * @param	 {int}	y 		Piece y coord

 *
 */

function ReplaceColorHistory (color, x, y) {
	
	this.color = color;
	this.x = x;
	this.y = y;

}