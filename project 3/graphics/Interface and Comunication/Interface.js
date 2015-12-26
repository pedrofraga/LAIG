/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);

	this.quit = { function(){ console.log("clicked") }};

};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.initGUIVars();
	
	this.gui = new dat.GUI();

	var self = this;

	this.gui.add(this,'startGame').name('Start Game');
	this.gui.add(this,'undo').name('Undo');

	this.gui.add(this, 'perspective', this.perspectiveNames).name('Perspective')
	.onChange(function() { self.scene.updateCamera(self.perspective);});

	this.gui.add(this.scene.board, 'black', this.possiblePlayers).name('Black');
	this.gui.add(this.scene.board, 'white', this.possiblePlayers).name('White');

	this.gui.add(this,'quitGame').name('Quit');

	return true;
	
};


MyInterface.prototype.startGame = function(application) {
	this.scene.board.requestToPl('startgame');
}

MyInterface.prototype.undo = function(application) {
	this.scene.board.undo();
}

MyInterface.prototype.quitGame = function(application) {
	this.scene.board.requestToPl('quit');
}

MyInterface.prototype.initGUIVars = function() {
	this.perspectiveNames = this.scene.getPerspesctiveNames();
	this.perspective = this.perspectiveNames[0];
	this.possiblePlayers = ['Human', 'Bot'];
}

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
};
