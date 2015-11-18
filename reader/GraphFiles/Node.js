/**
 * constructor of Node object
 * @constructor Node
 * @param  {string} id     string of the id
 */

 function Node(id) {

 	this.id = id;

 	this.texture = null;
 	this.material = null;

 	this.transformMatrix = mat4.create();
 	mat4.identity(this.transformMatrix);
	
	this.originalTransformMatrix = mat4.create();

 	this.transforms = [];

 	this.animation = null;

 	this.descendants = [];

 	this.lastTime = 0;
	


 }

/**
 * method to set the initial transformations matrix
 * @method setMatrix
 */

Node.prototype.setMatrix = function () {

 	mat4.identity(this.transformMatrix);

 	for(var i = 0; i < this.transforms.length; i++) {

 		switch (this.transforms[i].constructor) {
 			case Translation :
 				var x = this.transforms[i].x;
 				var y = this.transforms[i].y;
 				var z = this.transforms[i].z;

 				mat4.translate(this.transformMatrix, this.transformMatrix, [x, y, z]);
 				break;
 			case Scale :
 				var sx = this.transforms[i].sx;
 				var sy = this.transforms[i].sy;
 				var sz = this.transforms[i].sz;
 				
 				mat4.scale(this.transformMatrix, this.transformMatrix, [sx, sy, sz]);
 				break;
 			case Rotation :
 				switch(this.transforms[i].axis) {

				case 'y':
					mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [0,1,0]);
					break;
				case 'x':
					mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [1,0,0]);
					break;
				case 'z':
					mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [0,0,1]);
					break;
				default:
					throw new Error('There is no axis ' + childrenArray[i].attributes.getNamedItem("axis").value + ' .lsx not well formed');
					break;
				}
 				break;

 		}
 	}

	mat4.copy(this.originalTransformMatrix, this.transformMatrix);
};

/**
 * method to animate a node
 * @method animate
 * @param currTime	the time in ms
 * @param expectedUpdatePeriod  expected delta time between updates
 */
Node.prototype.animate = function (currTime, expectedUpdatePeriod) {

	if(this.lastTime > 0) {
		
		
		var deltaTime = currTime - this.lastTime;


		if(!updatePeriodDiffers(deltaTime, expectedUpdatePeriod))
			if(this.animation.constructor == CircularAnimation) {
			  if( this.animation.initialRotAngle < this.animation.rotationAngle) {

			  	/*
			  	*	Rotação circular
			  	*	
			  	*	No inicio de cada atualização volta-se a copiar a matriz resultante do método "setMatrix"
			  	*	Faz-se a translação para o respetivo centro
			  	*	e calcula-se o ângulo a ser rodado pela fórmula seguinte: 										(deltaTime) 		(this.animation.rotationAngle)		
			  	*																								intervalo de tempo 			ângulo de rotação
			  	*	ângulo de rotação ------------------- tempo total										desde a ultima atualização 	* 
			  	*																	angulo de Rotação    = 	----------------------------------------------------------
			  	*	ângulo a rodar ---------------------- intervalo de tempo		(angleToBeRotated)								tempo total
			  	*	nesta atualização					   desde a última 														(this.animation.span)
			  	*											atualização
			  	*
				*
				*		
				*
				*	Depois disso adiciona-se o ângulo a ser rodado nesta atualização ao (this.animation.initialAngle) e ao (this.animation.initialRotAngle)
				*	desta forma o objeto vai rodar e manter um ângulo coerente
				*	
				*	Calcula-se o x e o z final com a fórmula:
				*				
				*	 Posição = raio * (cos ou sin) do ângulo guardado na animação
				*
				* 
				*
				*	No fim atualiza-se a matriz de transformações
			  	*/
				  
				mat4.copy(this.transformMatrix, this.originalTransformMatrix);
				mat4.translate(this.transformMatrix, this.transformMatrix, [this.animation.center[0], this.animation.center[1], this.animation.center[2]]);
			 	
				var angleToBeRotated = deltaTime * this.animation.rotationAngle / this.animation.span;
				
				this.animation.initialAngle += angleToBeRotated;

			  	this.animation.initialRotAngle += angleToBeRotated;
				

			  	var x = this.animation.radius * Math.sin(this.animation.initialRotAngle);
			  	var z = this.animation.radius * Math.cos(this.animation.initialRotAngle);
				
				mat4.translate(this.transformMatrix, this.transformMatrix, [x, 0, z]);
				mat4.rotate(this.transformMatrix, this.transformMatrix, this.animation.initialAngle, [0, 1, 0]);
				
			  }
				
			} else if (this.animation.constructor == LinearAnimation) {

				/*
				*	Animação Linear
				*	
				*	Percorre-se todos os controlPointsDistance (pontos de controlo que contêm a distância que o objeto já percorreu)
				*	Se a distância percorrida num determinado ponto de controlo (this.animation.initialControlPoint[i]) ainda não é a total 
				*	então o objeto vai fazer uma translação com as informações desse ponto de controlo (this.animation.controlPoints[i])
				*
				*
				*	Quando se verifica que o objeto ainda não percorreu toda a distância num determinado ponto de controlo
				*
				*	o primeiro passo é atribuir a matriz inicial do objeto calculada no método "setMatrix"
				*	o segundo passo é calcular a orientação que o objeto tem que tomar:
				*
				*
				*	-cria-se uma matriz identidade para aplicar a rotação inicial
				*	-calcula-se o ângulo a ser rodado 
				*
				*			_____________x
				*			|\
				*			| \
				*			|  \
				*			|   \
				*		  z	|ang \
				*			
				*					  --------------
				*		hipotenusa = v  x^2  +  z^2
				*
				*		ang = sen-1(x / hipotenusa) [sen(ang) = c. oposto / hipotenusa]
				*
				*		O x e o z são a distância a percorrer em cada ponto de controlo
				*
				*	-aplica-se a rotação na matriz identidade
				*
				*
				*
				*
				*	o terceiro passo é calcular a distância a percorrer nesta atualização com base no intervalo de tempo
				*					
				*						 distância 		
				*		velocidade = -------------------     <=>   distância = velocidade * intervalo de tempo
				*					  intervalo tempo
				*	
				*
				*	o quarto passo é atualizar a distância percorrida neste ponto de controlo nas variáveis da classe da animação linear (LinearAnimation)
				*	Há uma verificação de erro para ter a certeza que o objeto não vai percorrer mais do que aquilo que é suposto ou seja,
				*	se a distância acumulada/percorrida no ponto de controlo é maior que a que é suposto percorrer então é subtraída à distância 
				*	calculada anteriormente, aquela que garante que o objeto percorre apenas a distância correta. 
				*
				*	
				*	O quinto passo é calcular a distância a percorrer em cada eixo:
				*
				*	da fórmula:
				*					 -----------------------------------------
				*		distância = v  (val * x)^2 + (val * y)^2 + (val * z)^2
				*	
				*		As variáveis x, y e z são obtidas a partir da distância a percorrer em cada eixo, guardadas no ponto de controlo atual (this.animation.controlPoints[i])
				*
				*	resulta:         -------------------------------------------
				*					/
				*				   /				 distância^2
				*		val = 	  /	   ----------------------------------------
				*				 /      
				*               /         x^2    +     y^2       +    z^2
				*			   v	 		
				*
				*		
				*		Esse valor (val) vai ser usado para calcular a distância percorrida em cada eixo.
				*
				*
				*
				*	Cria-se assim uma matriz de translação
				*		
				* 	Aplica-se a matriz de rotação e de translação à matriz de transformações
				*/				
				

				for (var i = 0; i < this.animation.controlPoints.length; i++) {

					if ( this.animation.initialControlPoint[i] < this.animation.controlPointDistance[i]) {
						
						
						mat4.copy(this.transformMatrix, this.originalTransformMatrix);
						
						
						if(this.animation.initialControlPoint[i] == 0) {

							if(this.animation.controlPoints[i][2] != 0 && this.animation.controlPoints[i][0] != 0) {
								
								mat4.identity(this.animation.rotationMatrix);

								var hip = Math.sqrt(Math.pow(this.animation.controlPoints[i][0], 2) + Math.pow(this.animation.controlPoints[i][2], 2));

								this.initialRotation = Math.asin(this.animation.controlPoints[i][0] / hip);


								if(this.animation.controlPoints[i][0] < 0 && this.animation.controlPoints[i][2] < 0) {
									this.initialRotation -= Math.PI / 2;
								} 


								if(this.animation.controlPoints[i][0] > 0 && this.animation.controlPoints[i][2] < 0) {
									this.initialRotation += Math.PI / 2;
								} 

								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);

							} else if(this.animation.controlPoints[i][2] == 0 && this.animation.controlPoints[i][0] != 0) {

								mat4.identity(this.animation.rotationMatrix);

								var sign = this.animation.controlPoints[i][0] && this.animation.controlPoints[i][0] / Math.abs(this.animation.controlPoints[i][0]);

								this.initialRotation = sign * toRadian(90);

								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);
								
							} else if (this.animation.controlPoints[i][2] != 0 && this.animation.controlPoints[i][0] == 0){

								mat4.identity(this.animation.rotationMatrix);

								if (this.animation.controlPoints[i][2] > 0)
									this.initialRotation = 0;
								else
									this.initialRotation = toRadian(180);

								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);

							} else {
								mat4.identity(this.animation.rotationMatrix);
								
								this.initialRotation = 0;
								
								mat4.rotate(this.animation.rotationMatrix, this.animation.rotationMatrix, this.initialRotation, [0,1,0]);
							}
						}
						
								
						var distance = this.animation.velocity * deltaTime;

						this.animation.initialControlPoint[i] += distance;
						
						var distance2 = 0;

						if(this.animation.initialControlPoint[i] > this.animation.controlPointDistance[i]) {
							distance2 = (this.animation.initialControlPoint[i] - this.animation.controlPointDistance[i]);
						}

						distance -= distance2;
						this.animation.initialControlPoint[i] -= distance2;



						var distanceVar = Math.sqrt(Math.pow(distance, 2) / (Math.pow(this.animation.controlPoints[i][0], 2) +  
							Math.pow(this.animation.controlPoints[i][1], 2) +
							Math.pow(this.animation.controlPoints[i][2], 2)));


						var x = this.animation.controlPoints[i][0] * distanceVar;
						var y = this.animation.controlPoints[i][1] * distanceVar;
						var z = this.animation.controlPoints[i][2] * distanceVar;
						
					
							
						mat4.translate(this.animation.translationMatrix, this.animation.translationMatrix, [x, y, z]);
						
						
						mat4.multiply(this.transformMatrix, this.transformMatrix, this.animation.translationMatrix);
						
						mat4.multiply(this.transformMatrix, this.transformMatrix, this.animation.rotationMatrix);
						
						i = this.animation.controlPoints.length;
					} 
				}
			}
		}

		this.lastTime = currTime;
}

/**
 * method to check if the delta Time differs 
 * @method updatePeriodDiffers
 * @param currTime	deltaTime
 * @param expectedUpdatePeriod  expected delta time between updates
 */

function updatePeriodDiffers(currTime, expectedUpdatePeriod) {
    return currTime > (expectedUpdatePeriod + 50);
}