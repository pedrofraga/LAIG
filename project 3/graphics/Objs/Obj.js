/* Created by Pedro Fraga MIEIC up201303095, It displays .obj files*/
/* Obj reader for files exported from 3d Builder, windows 10 app */

function Obj(scene, path) {

	this.scene = scene;

	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);

    var self = this;
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                self.initBuffers(allText);
            }
        }
    }
    rawFile.send(null);

    this.objects = [];

}

Obj.prototype = Object.create(CGFobject.prototype);
Obj.prototype.constructor = Obj;

Obj.prototype.initBuffers = function (info) {
	
	var lines = info.split('\n');

	var info = [];
	var objects = 0;

	for (line in lines) {
		var elements = lines[line].split(' ');
		if (elements[0] == 'o') {
			
			if (objects > 0) {
				this.objects.push(new ObjObject(this.scene, info));
				info
			}

			objects++;
		} else if (elements[0] == 'f' || elements[0] == 'v') {
			info.push(lines[line]);
		}

	}


}
