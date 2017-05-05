// Miguel Ángel Alba Blanco ISAM

//Constantes de la cámara
const LABERINTOX = 50,LABERINTOY = 50;
const NUMCUBOS = 50;
const pasos = 0.0;
const angle = 0.0;
const speed = 0.08;
const moveAngle = 0;
const alturaOjos = 0.50;
const anglez = 0.0;
const numEnemys = 1;
const speedEnemy = 1;




const canvas = document.getElementById('webgl');
const canvas2d = document.getElementById('2d');
const ctx_2d = canvas2d.getContext("2d");
const gl = getWebGLContext(canvas);

 //Shader con textura

	 var VSHADER_SOURCE =
	'attribute highp vec3 a_VertexPosition;\n' +
	'attribute highp vec2 a_TextureCoord;\n' +
	'attribute highp vec3 a_VertexNormal;\n' +

	'uniform highp mat4 u_NormalMatrix;\n' +
	'uniform highp mat4 u_MvpMatrix;\n' +
	'uniform highp mat4 u_ModelMatrix;\n' +
	'uniform highp mat4 u_ViewMatrix;\n' +


	'varying highp vec4 v_VertexPosition;\n' +
	'varying highp vec2 v_TextureCoord;\n' +
	'varying highp vec4 v_TransformedNormal;\n' +
	'varying highp vec4 v_viewSpace;\n' +


	'void main() {\n' +
		 '  gl_Position = u_MvpMatrix * vec4(a_VertexPosition, 1.0);\n' +
		 '  v_TextureCoord = a_TextureCoord;\n' +
		 '  v_VertexPosition = u_ModelMatrix * vec4(a_VertexPosition, 1.0);\n' +
		 '  v_TransformedNormal = u_NormalMatrix * vec4(a_VertexNormal, 1.0);\n' +
		 '  v_viewSpace = u_ViewMatrix * u_ModelMatrix * vec4(a_VertexPosition, 1.0);\n' +

	'}\n';

// Fragment shader program
var FSHADER_SOURCE =
	'varying highp vec2 v_TextureCoord;\n' +
	'varying highp vec4 v_VertexPosition;\n' +
	'varying highp vec4 v_TransformedNormal;\n' +
	'varying highp vec4 v_viewSpace;\n' +


	'uniform highp vec4 u_LightPosition;\n' +
	'uniform highp vec3 u_directionalLightColor;\n' +
	'uniform highp vec3 u_fogColor;\n' +
	'uniform highp float u_lightDensity;\n' +

	'uniform highp float u_activatefog;\n' +
	'uniform highp float u_activatefogbg;\n' +



	//'const highp vec3 fogColor = vec3(0.0, 0.0, 0.0);\n' +

	//'const highp float lightDensity = 0.5;\n' + //gracias a esto puedo ilumniar solo lo cercano junto con la función exp de abajo
	'const highp float FogDensity = 0.6;\n' +
	'const highp float fogStart = -2.0;\n' +
	'const highp float fogEnd = 0.5;\n' + //altura de la niebla

	'uniform sampler2D u_image0;\n' +
  	'uniform sampler2D u_image1;\n' +  


	'void main() {\n' +
		'highp vec3 ambientLight = vec3(0.4, 0.4, 0.4);\n' +
		//'highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);\n' +

		'highp vec3 directionalLightColor = (u_directionalLightColor);\n' +
		'highp vec3 fogColor = (u_fogColor);\n' +
		'highp float lightDensity = (u_lightDensity);\n' +

		' highp float dist = length(v_viewSpace);\n' +

		' highp float activatefog = (u_activatefog);\n' +
		' highp float activatefogbg = (u_activatefogbg);\n' +



		'highp vec4 pointLightPosition = (u_LightPosition);\n' +
		'highp vec3 lightDirection = normalize((u_LightPosition - v_VertexPosition).xyz);\n' +

		'highp float directionalW = max(dot(v_TransformedNormal.xyz, lightDirection), 0.0);\n' +

		'highp vec3 v_Lighting = (ambientLight + (directionalLightColor * directionalW))/exp(dist * lightDensity);\n' +
	
		'highp vec4 color0 = texture2D(u_image0, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
		'highp vec4 color1 = texture2D(u_image1, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
		
		'highp vec4 texelColor = color0 * color1;\n' +

		//niebla

		'highp float fogFactor1 = 1.0 /exp(dist * FogDensity);\n' + //Exponential podemos ir viendolo comentando y descomentando

		//'fogFactor1 = clamp( fogFactor1, 0.0, 1.0 );\n' +

		//Niebla bg
		'highp float fogFactorbg2 = ((v_VertexPosition.z/v_VertexPosition.w)-fogStart) / (fogEnd - fogStart);\n' +
		
		//'fogFactorbg2 = clamp( fogFactorbg2, 0.0, 1.0 );\n' +
				'highp float fogFactor = (fogFactor1 * activatefog) + (fogFactorbg2 * activatefogbg);\n' + //Exponential podemos ir viendolo comentando y descomentando


		'fogFactor = clamp( fogFactor, 0.0, 1.0 );\n' +
		


		' gl_FragColor = vec4(fogColor*(1.0-fogFactor), 1.0) + fogFactor*vec4(texelColor.rgb * v_Lighting.rgb, texelColor.a);\n' +
	'}\n';



function maze(){

	var d = new Date()

	this.myMaze;
	this.myScene = [];
	this.level = 0;
	this.size = 12;
	this.combinedTexture = false;
	this.directionalColor = new Array();
	this.directionalColor.r = 0.5;
	this.directionalColor.g = 0.5;
	this.directionalColor.b = 0.5;
	this.fogColor = new Array(); //Con esto anulo el color de la niebla para que no se vea.
	this.fogColor.r = 0.0;
	this.fogColor.g = 0.0;
	this.fogColor.b = 0.0;
	this.lightDensity = 0.1;//esta luz es para los niveles y la que se le pasará al shader cuanto mas alto menos luz
	this.lightDensity1 = 0.1; //esta luz es para la cámara de primera persona
	this.lightDensity2 = 0.1; //esta luz es para las cámaras aérea y de tercera persona

	this.lightDensityview2 = 0.1;
	this.activatefogbg = 1.0;
	this.activatefog = 0.0;
	this.lives = 3;
	this.puntos = 0; 
	this.time = 60;
	this.clock = d.getTime();

	

	this.createMaze = function(){
		var pos = new Array();
		pos.x = 0.0;
		pos.y = 0.0;

		this.myMaze = new Maze(this.size);
		this.myMaze.randPrim(new Pos(0, 0));
		
	}
	this.drawPuntos = function(){
		ctx_2d.fillStyle = 'green';
		ctx_2d.font = '20pt VTFMisterPixelRegular';
		ctx_2d.clearRect(0, 0, canvas.width, canvas.height);
		ctx_2d.fillText("Puntos: " + this.puntos, 700, 40);

	}
	this.drawTxt = function(){
		ctx_2d.fillStyle = 'green';
		ctx_2d.font = '20pt VTFMisterPixelRegular';
		ctx_2d.clearRect(0, 0, canvas.width, canvas.height);
		//ctx_2d.clearRect(0, 0, 100, 800);

		ctx_2d.fillText("Vidas: " + this.lives, 200, 40);
		ctx_2d.fillStyle = 'green';
		ctx_2d.font = '20pt VTFMisterPixelRegular';
		ctx_2d.fillText("Puntos: " + this.puntos, 400, 40);

		ctx_2d.fillText("Tiempo: " + this.time, 600, 40);
		ctx_2d.fillStyle = 'green';
   }
}

function cuboVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,
							 VerticesIndicesBuffer,VerticesNormalBuffer) {

	 this.id = "PB1"
	 this.Texture = Texture;
	 this.VerticesBuffer = VerticesBuffer;
	 this.VerticesTextureCoordBuffer = VerticesTextureCoordBuffer;
	 this.VerticesIndicesBuffer = VerticesIndicesBuffer;
	 this.VerticesNormalBuffer =  VerticesNormalBuffer
	 this.numIndices = 36;

}

function floorVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,
							 VerticesIndicesBuffer,VerticesNormalBuffer){

	 this.id = "FB1";
	 this.Texture = Texture;
	 this.VerticesBuffer = VerticesBuffer;
	 this.VerticesTextureCoordBuffer = VerticesTextureCoordBuffer;
	 this.VerticesIndicesBuffer = VerticesIndicesBuffer;
	 this.VerticesNormalBuffer =  VerticesNormalBuffer
	 this.numIndices = 6;
	 this.getid = function(){

			return this.id;
	 }

}

function texturacombinada(Texture){
	this.Texture = Texture;
}

function TexturaEnemy(Texture){
	this.Texture = Texture;
}

function camara (pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez){

	this.id = "C1"
	this.pasos = pasos;
	this.angle = angle;
	this.angley = 0;
	this.moveAngle = moveAngle;
	this.moveAngley = 0;
	this.alturaOjos = alturaOjos;
	this.anglez = anglez;
	this.pasosx = pasosx;
	this.pasosy = pasosy;
	this.caminar = 1;

	that = this;
	this.viewx = that.pasosx + Math.cos(that.angle)
	this.viewy = that.pasosy + Math.sin(that.angle)
	this.viewz = that.alturaOjos + Math.sin(that.angley) + 0.02*Math.sin(that.anglez) * that.caminar;
	this.speed = speed;
	
 }


function Floor(mMatrix){

	 this.id = "F1"
	 this.mMatrix = mMatrix;
}

function Cubo(x,y,z,mMatrix){

	 this.id = "C";
	 this.x = x;
	 this.y = y;
	 this.z = z;
	 this.mMatrix = mMatrix;
}

function Enemy(x,y,z,mMatrix){
	var d = new Date();

	this.id = "E";
	this.x = x;
	this.y = y;
	this.z = z;
	this.mMatrix = mMatrix;
	this.time = d.getTime();
	this.sentido = true;
}

function Raton(topOjos){

	this.mouse = new Array();
	this.mouseantesx = 0;
	this.mouseantesy = 0;
	this.mouse.x = 0;
	this.mouse.y = 0;
	that = this;
	this.mueveRaton = function(captura){

		//console.log("posxraton:" + this.mouse.x, this.mouse.y);

		//En esta parte los ejes los considero en 2d con los del canvas
		that.mouse.x = captura.pageX;
		that.mouse.y = captura.pageY;
		if ((that.mouse.x) > (that.mouseantesx)) {
			camara1.moveAngle = camara1.moveAngle - 5;
			camara1.angle = camara1.moveAngle *  Math.PI/180;

		}else if ((that.mouse.x) < (that.mouseantesx)) {

			camara1.moveAngle = camara1.moveAngle + 5;
			camara1.angle = camara1.moveAngle * Math.PI/180;
			}
		if (topOjos === camara1.alturaOjos){
			if ((that.mouse.y) > (that.mouseantesy)) {

				camara1.moveAngley = checkAngle(camara1.moveAngley - 5,"y");
				camara1.angley = camara1.moveAngley * Math.PI/180;

			}else if ((that.mouse.y) < (that.mouseantesy)){

				camara1.moveAngley = checkAngle(camara1.moveAngley + 5,"y");
				camara1.angley = camara1.moveAngley * Math.PI/180;

			}
		}
				cameraView();
				that.mouseantesx = captura.pageX
				that.mouseantesy = captura.pageY
			
	}

}

function checkAngle(angle,eje){
	 var max;
	 var min;

	 switch(eje){

			case "x":
				 max = 180;
				 min = -180;
			break;
			case "y":
				 max = 90;
				 min = -90;
			break;
	 }

	 if (angle > max){
			angle = max;
			return angle;
	 }else if (angle < min){
			angle = min;
			return angle;
	 }else{
			return angle;
	 }

}

function getShape(array,id) {
	 for(x in array) {
			if(array[x].id === id)
			return array[x];
	}
}

function cameraView(){

	camara1.viewx = camara1.pasosx + Math.cos(camara1.angle);
	camara1.viewy = camara1.pasosy + Math.sin(camara1.angle);
	camara1.viewz = camara1.alturaOjos + Math.sin(camara1.angley) + 0.02*Math.sin(camara1.anglez) * camara1.caminar;


}

function argumentsToDraw(viewMatrix,projMatrix,mvpMatrix,myBuffers,mazes,gl,alturaLuz){
	 requestAnimationFrame(drawScene);

	function drawScene(){

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		requestAnimationFrame(drawScene);

		mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0)

	 	var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');


	 	if (!u_MvpMatrix) {
			console.log('Failed to get the storage location of u_MvpMatrix');
			return;
	 	}
	 	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	 	if (!u_ModelMatrix) {
			console.log('Failed to get the storage location of u_ModelMatrix');
			return;
		}
		var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  		if (!u_ViewMatrix) {
    		console.log('Failed to get the storage location of u_ViewMatrix');
    		return;
   	}

   	var lightDensity =  gl.getUniformLocation (gl.program, "u_lightDensity");
		gl.uniform1fv(lightDensity,[mazes[0].lightDensity]);
		var activatefog =  gl.getUniformLocation (gl.program, "u_activatefog");
		gl.uniform1fv(activatefog,[mazes[0].activatefog]);
		var activatefogbg =  gl.getUniformLocation (gl.program, "u_activatefogbg");
		gl.uniform1fv(activatefogbg,[mazes[0].activatefogbg]);


	 	var y  = 1; //Esta variable la declaro para selccionar uno de los dos buffers para pintar correctamente.
				// requestAnimationFrame(drawScene);


	 	for (x in mazes[0].myScene){

	 		viewMatrix.setLookAt(camara1.pasosx,camara1.pasosy,camara1.alturaOjos,camara1.viewx,camara1.viewy,camara1.viewz, 0,0,1);

			//	viewMatrix.setLookAt(camara1.pasosx,camara1.pasosy,camara1.alturaOjos,camara1.pasosx+Math.cos(camara1.angle),
			//							camara1.pasosy+Math.sin(camara1.angle),camara1.alturaOjos+Math.sin(camara1.angley) + 0.02*Math.sin(camara1.anglez), 0,0,1);

			//lamada a los buffers para pintar con texturas
			if (mazes[0].myScene[x].id === "F1"){
				 y = 0;
			}else{
				 y = 1;
			}

			mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(mazes[0].myScene[x].mMatrix);

			gl.uniformMatrix4fv(u_ModelMatrix, false, mazes[0].myScene[x].mMatrix.elements);
			gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

			var lightposx = camara1.pasosx;
			var lightposy = camara1.pasosy;
			var lightposz = alturaLuz;

			var pointLightPosition = gl.getUniformLocation (gl.program, "u_LightPosition");
			gl.uniform4fv(pointLightPosition,[lightposx,lightposy,lightposz,1.0]);

			var directionalLightColor = gl.getUniformLocation (gl.program, "u_directionalLightColor");
			gl.uniform3fv(directionalLightColor,[mazes[0].directionalColor.r,mazes[0].directionalColor.g,mazes[0].directionalColor.b]);

			var fogColor =  gl.getUniformLocation (gl.program, "u_fogColor");
			gl.uniform3fv(fogColor,[mazes[0].fogColor.r,mazes[0].fogColor.g,mazes[0].fogColor.b]);


			var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
			gl.enableVertexAttribArray(vertexPositionAttribute);

			var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
			gl.enableVertexAttribArray(textureCoordAttribute);
			//Luz
			var vertexNormalAttribute = gl.getAttribLocation(gl.program, "a_VertexNormal");
			gl.enableVertexAttribArray(vertexNormalAttribute);

			gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[y].VerticesNormalBuffer);
			gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER,myBuffers[y].VerticesBuffer);
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER,myBuffers[y].VerticesTextureCoordBuffer);
			gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

			//aquí añado las texturas combinadas
			var u_image0Location = gl.getUniformLocation(gl.program, "u_image0");
  			var u_image1Location = gl.getUniformLocation(gl.program, "u_image1");

 			//gl.activeTexture(gl.TEXTURE0);
  			//gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);
  			if (mazes[0].myScene[x].id === "M"){

  				gl.activeTexture(gl.TEXTURE0);
  				gl.bindTexture(gl.TEXTURE_2D, myBuffers[3].Texture);
  				//moveMe(mazes,x);
  				//enemyMove(mazes,x);
				 
			}else if (mazes[0].myScene[x].id === "E") {
				gl.activeTexture(gl.TEXTURE0);
  				gl.bindTexture(gl.TEXTURE_2D, myBuffers[3].Texture);
  				enemyMove(mazes,x);

  				}
  			else{

				gl.activeTexture(gl.TEXTURE0);
  				gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);
  			}



  			gl.activeTexture(gl.TEXTURE1);

  			if (mazes[0].combinedTexture === true){
  				var n = 2; //el 2 es la posición en la que está guardada la textura;
  			}else{ n = y; }
  			
  			gl.bindTexture(gl.TEXTURE_2D, myBuffers[n].Texture);
  			gl.uniform1i(u_image0Location, 0);
  			gl.uniform1i(u_image1Location, 1);


			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,myBuffers[y].VerticesIndicesBuffer);


			var normalMatrix = new Matrix4();
			normalMatrix.set(mazes[0].myScene[x].mMatrix);//El error estaba aquí!!!!
			normalMatrix.invert();
			normalMatrix.transpose();
			var nUniform = gl.getUniformLocation(gl.program, "u_NormalMatrix");
			gl.uniformMatrix4fv(nUniform, false, normalMatrix.elements);

			gl.drawElements(gl.TRIANGLES, myBuffers[y].numIndices, gl.UNSIGNED_SHORT, 0);

			}
	 }
}


function rndPosition(mazes){

	 var position = new Array();
	 var i;
	 var j;

	 i = Math.round (Math.random() * (mazes[0].myMaze.rooms.length -1));
	 j = Math.round (Math.random() * (mazes[0].myMaze.rooms.length -1));

	 console.log("i" + i);
	 console.log("j" + j);
	 while (mazes[0].myMaze.rooms[i][j] === false){
			i = Math.round (Math.random() * (mazes[0].myMaze.rooms.length -1));
			j = Math.round (Math.random() * (mazes[0].myMaze.rooms.length -1));
			console.log("i" + i);
			console.log("j" + j);
	 }

	 position.x = i;
	 position.y = j;
	 return position;

}

function ponerCuboLaberinto(mazes){
	 var n = 1; //Empiezo en uno para que al empezar nose cargue el suelo
	 for (var i = 0; i < mazes[0].myMaze.rooms.length; i++){
			for (var j = 0; j < mazes[0].myMaze.rooms.length; j++){
				 if(mazes[0].myMaze.rooms[i][j] === false){

						var Sz = 1/2;
						var Sx = 1/2;
						var Sy = 1/2;

						positionx = i;
						positiony = j;

						var matrixc = new Matrix4();

						mazes[0].myScene.push(new Cubo(positionx,positiony,1,matrixc));

						mazes[0].myScene[n].mMatrix = mazes[0].myScene[n].mMatrix.translate(mazes[0].myScene[n].x + Sx,mazes[0].myScene[n].y + Sy,Sz);
						mazes[0].myScene[n].mMatrix = mazes[0].myScene[n].mMatrix.scale(Sx,Sy,Sz);
						n = n + 1;
				 }
			}
	 }
}

function checkCubo(posx,posy,mazes){
	if (posx === 0 & posy === 0){

		console.log("HAS llegado al final del laberinto");
		changeLevel(mazes);

	}else{

		if(mazes[0].myMaze.rooms[posx][posy] === false){
			return true;
		}else{
			return false;
		}
	}
}
function cameraMove (signo){
	camara1.anglez = camara1.anglez + signo;
	camara1.pasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle)*signo;
	camara1.pasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle)*signo;

}

function checkEnemyDistance(mazes,x){
	
	var numAx = mazes[0].myScene[x].x;
	var numAy = mazes[0].myScene[x].y;
	var numBx = camara1.pasosx ;
	var numBy = camara1.pasosy ;
	var numx = Math.pow(numAx - numBx,2);
	var numy = Math.pow(numAy - numBy,2);
	var distancia = Math.sqrt(numx + numy);

	if (distancia < 0.25){
		return "mueres";
	}else if ( distancia < 1){
		return true;
	}else{
	return false;
	
	}

}
function delEnemy(mazes,x){
	mazes[0].myScene.splice(x,1);
}

function checkEnemy(mazes){
	for(x in mazes[0].myScene) {
		if(mazes[0].myScene[x].id === "E"){
			console.log("EStoy viendo si mueres" + mazes[0].lives);

			if (checkEnemyDistance(mazes,x) === "mueres"){
				mazes[0].lives = mazes[0].lives - 1;
				console.log("Tienes una vida menos" + mazes[0].lives);
				delEnemy(mazes,x);
				mazes[0].drawTxt();
			}
		}
	}
}

function shot(mazes){

	for(x in mazes[0].myScene) {
		if(mazes[0].myScene[x].id === "E"){
			
			if (checkEnemyDistance(mazes,x) === true){
				delEnemy(mazes,x);
				mazes[0].puntos = mazes[0].puntos + 10;
				mazes[0].drawTxt();

			}else if (checkEnemyDistance(mazes,x) === "mueres"){
				mazes[0].lives = mazes[0].lives - 1;
			}else{
			}
		}
	}

}

function argumentsToMove(mazes,alturaOjos){
	 document.onkeydown = function(ev){
			keydown(ev);
	 }
	 function keydown(ev){
			var futuropasosx;
			var futuropasosy;
			switch(ev.keyCode){
				case 65:  //Right

					//camara1.moveAngle = camara1.moveAngle + 2;
					//camara1.angle = camara1.moveAngle*Math.PI/180;

						break;
				case 68:  //Left
					
					//camara1.moveAngle = camara1.moveAngle - 2;
					//camara1.angle = camara1.moveAngle*Math.PI/180;

						break;
				case 87: //Up
				
					mazes[0].myMaze.rooms;
					futuropasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle);
					futuropasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle);

					if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy -1/2),mazes) === false)){

					   if((checkCubo(Math.round(futuropasosx - 1/2),Math.round(camara1.pasosy -1/2),mazes) === false) &&
									(checkCubo(Math.round(camara1.pasosx - 1/2),Math.round(futuropasosy -1/2),mazes) === false)){

							cameraMove(1);
							cameraView();
							mazes[0].myMaze.pos.x = Math.round(camara1.pasosx - 1/2);
							mazes[0].myMaze.pos.y = Math.round(camara1.pasosy - 1/2);
							mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);
							//mazes[0].drawLives();

						}
					}

					break;
				case 83: //Down

					futuropasosx = camara1.pasosx - camara1.speed*Math.cos(camara1.angle);
					futuropasosy = camara1.pasosy - camara1.speed*Math.sin(camara1.angle);

					if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy - 1/2),mazes) === false)){

						if((checkCubo(Math.round(futuropasosx - 1/2),Math.round(camara1.pasosy -1/2),mazes) === false) &&
									(checkCubo(Math.round(camara1.pasosx - 1/2),Math.round(futuropasosy -1/2),mazes) === false)){
						 	cameraMove(-1); 
							cameraView(); 
							mazes[0].myMaze.pos.x = Math.round(camara1.pasosx - 1/2);
							mazes[0].myMaze.pos.y = Math.round(camara1.pasosy - 1/2);
							mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);
							//mazes[0].drawLives();

						}
					}

					break;
				case 49: 
					camara1.alturaOjos = alturaOjos;
					camara1.angley = Math.PI/180;
					camara1.caminar = 1;
					cameraView();

					mazes[0].lightDensity = mazes[0].lightDensity1;



					break;
				case 50:
					camara1.alturaOjos = 6;
					console.log("anngulo antes" + camara1.angley);

					cameraViewz = camara1.viewx + camara1.viewy;
					camara1.angley = -90*Math.PI/180;
					camara1.caminar = 0;
					cameraView();
					mazes[0].lightDensity = mazes[0].lightDensity2 = 0.1;

						//console.log("anngulo antes"+camara1.angley);

					break;
				case 51:
					camara1.alturaOjos = 1;
					console.log("anngulo antes" + camara1.angley);

					cameraViewz = camara1.viewx + camara1.viewy;
					camara1.angley = -90*Math.PI/180;
					camara1.caminar = 0;
					cameraView();
					mazes[0].lightDensity = mazes[0].lightDensity2 = 0.1;


					break;
				case 32: //space
					shot(mazes);
				
				 default: return;

		 }
	 }
}

function initFloorBuffers(myBuffers,gl) {

	//objfloorvar1.n = objfloorvar1.n+1;

	myBuffers[0].VerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesBuffer);
	//suelo
	var floorVertices = new Float32Array([
		-1.0,  -1.0, 0,
		-1.0,   1.0, 0,
		 1.0,   1.0, 0,
		 1.0,  -1.0, 0
				
	]);

	gl.bufferData(gl.ARRAY_BUFFER, floorVertices, gl.STATIC_DRAW);

	myBuffers[0].VerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesNormalBuffer);

	var vertexNormals = new Float32Array([
		-1.0, -1.0,  1.0, 
	    1.0, -1.0, 1.0,  
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0
	]);

	gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);


	myBuffers[0].VerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesTextureCoordBuffer);


	var textureCoordinates = new Float32Array([

			0.0,  0.0,     50.0,  50.0,    0.0,   50.0,     50.0,  0.0
		
	]);

	gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

	myBuffers[0].VerticesIndicesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myBuffers[0].VerticesIndicesBuffer);

	var floorVerticesIndices = new Uint16Array([
		 0,1,2, 0,2,3 //floor
	])
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndices, gl.STATIC_DRAW);

}

function initCuboBuffers(myBuffers,gl){

	myBuffers[1].VerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesBuffer);

	var vertices = new Float32Array([

	  	-1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,   // Front face
    	-1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,   // Back face
    	-1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,   // Top face
    	-1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,   // Bottom face
     	 1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,   // Right face
    	-1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0    // Left face
    
	]);

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	myBuffers[1].VerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesNormalBuffer);

	var vertexNormals = new Float32Array([
	    0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,   // Front face
     	 0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,   // Back face
     	 0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,   // Top face
     	 0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,   // Bottom face
     	 1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,   // Right face
    	-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0   // Left face

	]);

	gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);

	myBuffers[1].VerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesTextureCoordBuffer);

	var textureCoordinates = new Float32Array([

	  	0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Front
    	0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Back
   	0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Top
    	0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Bottom
    	0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Right
    	0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0   // Left
    
	]);

	gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

	myBuffers[1].VerticesIndicesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myBuffers[1].VerticesIndicesBuffer);

	var cubeVertexIndices = new Uint16Array([

		0,  1,  2,      0,  2,  3,    // front
    	4,  5,  6,      4,  6,  7,    // back
    	8,  9,  10,     8,  10, 11,   // top
    	12, 13, 14,     12, 14, 15,   // bottom
    	16, 17, 18,     16, 18, 19,   // right
    	20, 21, 22,     20, 22, 23    // left


	]);

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);

}

function initTextures(y,imagen,myBuffers,gl) {

	myBuffers[y].Texture = gl.createTexture();
	console.log(myBuffers[y].Texture);

	gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);//esto se puede borrar
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, //esto se puede borrar
							new Uint8Array([0, 0, 255, 255])); //esto se puede borrar

	var image = new Image();
	image.onload = function() { handleTextureLoaded(y,image,myBuffers,gl); }
	image.src = "resources/" + imagen;
}

function handleTextureLoaded(y,image,myBuffers,gl) {
	console.log("handleTextureLoaded, image = " + image);

	gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

function enemyMove(mazes,n){

	var Sz = 1/4;
	var Sx = 1/4;
	var Sy = 1/4;

	var pos = new Array(); 
	var d = new Date();
	var tmNow = d.getTime();
	var dtClock = tmNow - mazes[0].clock;

   var dt = tmNow - mazes[0].myScene[n].time;
   mazes[0].myScene[n].time = d.getTime();
	
	var futuropasox = mazes[0].myScene[n].x + 1 * speed*(dt/1000);
	var futuropasoy = mazes[0].myScene[n].y + 1 * speed*(dt/1000);

	if ((dtClock/1000 >= 1) && (mazes[0].time != 0)){
		console.log("entro en el reloj")
		mazes[0].clock = tmNow;
		mazes[0].time = mazes[0].time - 1; 
		mazes[0].drawTxt();
		mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0)

	}


	if (((Math.round(futuropasox)) > 1 && (Math.round(futuropasox)) < mazes[0].myMaze.rooms.length - 1) &&
		 ((Math.round(futuropasoy)) > 1 && (Math.round(futuropasoy)) < mazes[0].myMaze.rooms.length - 1)){
		 	console.log("estoy moviendome bien");
		if ((mazes[0].myScene[n].sentido) === true) {
		 	mazes[0].myScene[n].x = mazes[0].myScene[n].x + 1*speedEnemy*(dt/1000);
		 	}
		if ((mazes[0].myScene[n].sentido) === false) {
		 	mazes[0].myScene[n].x = mazes[0].myScene[n].x - 1*speedEnemy*(dt/1000);
		}
		if (checkEnemyDistance(mazes,x) === "mueres"){
			mazes[0].lives = mazes[0].lives - 1;
			delEnemy(mazes,x);
			mazes[0].drawTxt();
			checkLives(mazes);
		}

	}else{

		if ((mazes[0].myScene[n].sentido === false)){
			mazes[0].myScene[n].x = mazes[0].myScene[n].x + 1*speedEnemy*(dt/1000)
			mazes[0].myScene[n].sentido = true;

		}else{
			mazes[0].myScene[n].x = mazes[0].myScene[n].x - 1*speedEnemy*(dt/1000);
			mazes[0].myScene[n].sentido = false;

		}
	}
	pos.x = mazes[0].myScene[n].x ;
	pos.y = mazes[0].myScene[n].y;

	var mMatrix = new Matrix4();

	mMatrix = mMatrix.translate(pos.x,pos.y,alturaOjos);
	mMatrix = mMatrix.scale(Sx,Sy,Sz);

 	mazes[0].myScene[n].mMatrix = mMatrix;
}

function createEnemys(mazes,numEnemys){
	var pos = new Array();
	pos.x = 0.0;
	pos.y = 0.0;
	
	for (var i = 0; i < numEnemys; i++){ 
		pos = rndPosition(mazes);

	   pos.x = pos.x + 1/2;
		pos.y = pos.y + 1/2;

		var Sz = 1/4;
		var Sx = 1/4;
		var Sy = 1/4;

		var mMatrix = new Matrix4();

		mMatrix = mMatrix.translate(pos.x,pos.y,alturaOjos);
		mMatrix = mMatrix.scale(Sx,Sy,Sz);
		
		mazes[0].myScene.push(new Enemy(pos.x,pos.y,alturaOjos,mMatrix));
	}

}

function resetEnemys(mazes){
	for(x in mazes[0].myScene) {
		if(mazes[0].myScene[x].id === "E"){
			console.log("Elimino enemigos"); 
			delEnemy(mazes,x);
		}
	}
}
function resetCubos(mazes){
		for(x in mazes[0].myScene) {
		if(mazes[0].myScene[x].id === "C"){
			console.log("Elimino cubos"); 
			delEnemy(mazes,x);
		}
	}
}

function resetCamera(posx,posy){

	camara1.pasos = pasos;
	camara1.angle = angle;
	camara1.angley = 0;
	camara1.moveAngle = moveAngle;
	camara1.moveAngley = 0;
	camara1.alturaOjos = alturaOjos;
	camara1.anglez = anglez;
	camara1.pasosx = posx;
	camara1.pasosy = posy;
	camara1.caminar = 1;
	camara1.speed = speed;
}

function checkLevel(mazes){
	switch(mazes[0].level){
		case 0:  //Right
		
			break;
		case 1:
			mazes[0].size = 15;
			mazes[0].lightDensity = 0.6;
			mazes[0].lightDensity1 = 0.6;
			mazes[0].puntos = mazes[0].puntos + 20;
			createEnemys(mazes,6);

			break;
		case 2:
			mazes[0].puntos = mazes[0].puntos + 20;
			mazes[0].size = 20;
			mazes[0].combinedTexture = true;
			mazes[0].directionalColor.r = 0.9;
			mazes[0].directionalColor.g = 0.9;
			mazes[0].directionalColor.b = 0.9;
			createEnemys(mazes,7);

			break;
		case 3:
		//aquí hago que la niebla se vea
			mazes[0].puntos = mazes[0].puntos + 20;
			mazes[0].fogColor.r = 0.0;
			mazes[0].fogColor.g = 0.9;
			mazes[0].fogColor.b = 0.0;
			createEnemys(mazes,7);


			break;
		case 4:
			mazes[0].puntos = mazes[0].puntos + 20;
			mazes[0].activatefog = 1.0;
			mazes[0].activatefogbg = 0.0;
			mazes[0].fogColor.r = 0.0;
			mazes[0].fogColor.g = 0.5;
			mazes[0].fogColor.b = 0.0;
			createEnemys(mazes,15);


			break;
		case 5:
			mazes[0].puntos = mazes[0].puntos + 20;
			mazes[0].activatefogbg = 0.7;
			mazes[0].activatefog = 0.3;
			mazes[0].fogColor.g = 0.2;
			createEnemys(mazes,20);


			break;
		case 6:
			alert("FELICIDADES TU PUNTUACION ES:" + mazes[0].puntos);
			restart();
			break;
		default: return;
	}
}

function changeLevel(mazes){

console.log("estoy cambiando de nivel");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things


	var pos = new Array();
	pos.x = 0.0;
	pos.y = 0.0;
	mazes[0].level = mazes[0].level + 1;

	resetEnemys(mazes);
	resetCubos(mazes);
	
	
	mazes[0].createMaze();
	
	mazes[0].myMaze.randPrim(new Pos(0, 0));
	
	mazes[0].myMaze.pos.x = Math.round(pos.x - 1/2);
	mazes[0].myMaze.pos.y = Math.round(pos.y - 1/2);
	
	pos = rndPosition(mazes);
   pos.x = pos.x + 1/2;
	pos.y = pos.y + 1/2;

	resetCamera(pos.x,pos.y);
	//con estás dos funciones no desperdicio tanta memoria
	

	ctx_2d.clearRect(0,0,200,1000);

	mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);


	mazes[0].myScene = [];

	mMatrix = new Matrix4();
	mMatrix.scale(LABERINTOX,LABERINTOY,1);
	mazes[0].myScene.push(new Floor(mMatrix));
	ponerCuboLaberinto(mazes);

	checkLevel(mazes);

}

function checkLives(mazes){
	if (mazes[0].lives <= 0){
		alert("GAME OVER");
		restart();

	}

}
function restart(){

	location.reload(true);
}
//function createMaze()

function main() {


	//Variables de cámara
	var pos = new Array();
	pos.x = 0.0;
	pos.y = 0.0;
	//variables luz
	const alturaLuz = alturaOjos;
	//Variables buffer texturas

	var Texture;
	var VerticesBuffer
	var VerticesTextureCoordBuffer;
	var VerticesIndicesBuffer;
	var VerticesNormalBuffer;

	//Variables de Matrices
	var viewMatrix = new Matrix4();  // View matrix
	var projMatrix = new Matrix4();  // Projection matrix
	var mvpMatrix = new Matrix4();   // Model view projection matrix

	//Arrays
	var myBuffers = [];
	
	//Variable laberinto
	var mazes = [];

	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	// Specify the color for clearing <canvas>

	//Inicio para las texturas

	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Get the storage location of u_MvpMatrix

	//createMaze(myMaze,pos)

	mazes.push( new maze);

	mazes[0].createMaze();
	mazes[0].myMaze.randPrim(new Pos(0, 0));

	pos = rndPosition(mazes);

   pos.x = pos.x + 1/2;
	pos.y = pos.y + 1/2;

	mazes[0].myMaze.pos.x = Math.round(pos.x - 1/2);
	mazes[0].myMaze.pos.y = Math.round(pos.y - 1/2);

	mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);

	camara1 = new camara(pasos,angle,pos.x,pos.y,speed,moveAngle,alturaOjos,anglez);
	//Meto el buffer de suelo
	myBuffers.push(new floorVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer,VerticesNormalBuffer));
	//Meto el buffer de cubo
	myBuffers.push(new cuboVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer,VerticesNormalBuffer));
	myBuffers.push(new texturacombinada(Texture));
	myBuffers.push(new TexturaEnemy(Texture));



	projMatrix.setPerspective(100, canvas.width/canvas.height, 0.00001, 100);
	mMatrix = new Matrix4();
	mMatrix.scale(LABERINTOX,LABERINTOY,1);

	mazes[0].myScene.push(new Floor(mMatrix));

	ponerCuboLaberinto(mazes);
	createEnemys(mazes,numEnemys);


	initCuboBuffers(myBuffers,gl);
	initFloorBuffers(myBuffers,gl);

	initTextures(0,"cobblestone.png",myBuffers,gl);//Inicializo las texturas de suelo
	initTextures(1,"brick.png",myBuffers,gl);// Inicializo las texturas de cubo
	initTextures(2,"verde256.jpg",myBuffers,gl);//Inicio la textura que quiero combinar
	initTextures(3,"fantasma256.jpg",myBuffers,gl);

	Raton1 = new Raton(alturaOjos);

	argumentsToDraw(viewMatrix,projMatrix,mvpMatrix,myBuffers,mazes,gl,alturaLuz);
	argumentsToMove(mazes,alturaOjos);
	document.addEventListener('mousemove', Raton1.mueveRaton);
	mazes[0].drawTxt();
}