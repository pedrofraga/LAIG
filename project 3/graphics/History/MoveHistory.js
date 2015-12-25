/**
 * Constructor of a move object to save info about made moves. This object improves project organization.
 *	
 * @constructor MoveHistory
 * @param 	{int}	x0 		Initial piece x coord
 * @param	{int}	y0 		Initial piece y coord
 * @param 	{int}	xf 		Final piece x coord
 * @param	{int}	yf 		Final piece y coord
 *
 */


function MoveHistory (x0, y0, xf, yf) {
	
	this.x0 = x0;
	this.y0 = y0;
	this.xf = xf;
	this.yf = yf;

}