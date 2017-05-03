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
const numEnemys = 10;
const speedEnemy = 1;


const canvas = document.getElementById('webgl');
const canvas2d = document.getElementById('2d');
//const canvaswrite = document.getElementById('write');


//const ctx = canvaswrite.getContext("2d");
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
	//'varying highp vec4 v_vertexPosition;\n' +

	'uniform highp vec4 u_LightPosition;\n' +

	/*'const highp vec3 fogColor = vec3(0.0, 0.9, 0.0);\n' +
	'const highp float FogDensity = 0.1;\n' +
	'const highp float fogStart = -2.0;\n' +
	'const highp float fogEnd = 20.0;\n' + //altura de la niebla*/

	'const highp vec3 fogColor = vec3(0.0, 0.5, 0.0);\n' +
	'const highp float FogDensity = 0.1;\n' +
	'const highp float fogStart = -2.0;\n' +
	'const highp float fogEnd = 0.5;\n' +


	'uniform sampler2D u_image0;\n' +
  	'uniform sampler2D u_image1;\n' + 


	'void main() {\n' +
		'highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);\n' +
		'highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);\n' +
		
		'highp vec4 pointLightPosition = (u_LightPosition);\n' +
		//Niebla
		' highp float dist = length(v_viewSpace);\n' +
		//'highp float fogFactor1 = 1.0 /exp(dist * FogDensity);\n' + //Exponential podemos ir viendolo comentando y descomentando
		'highp float fogFactor2 = ((v_VertexPosition.z/v_VertexPosition.w)-fogStart) / (fogEnd - fogStart);\n' +
		
		'highp float fogFactor1 = 0.0;\n' +

		'highp float fogFactor = fogFactor1 + fogFactor2;\n' + //Exponential podemos ir viendolo comentando y descomentando

		'fogFactor = clamp( fogFactor, 0.0, 1.0 );\n' +



		'highp vec3 lightDirection = normalize((u_LightPosition - v_VertexPosition).xyz);\n' +
		'highp float directionalW = max(dot(v_TransformedNormal.xyz, lightDirection), 0.0);\n' +
		'highp vec3 v_Lighting = (ambientLight + (directionalLightColor * directionalW))/exp(dist*FogDensity);\n' +
		
		'highp vec4 color0 = texture2D(u_image0, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
		'highp vec4 color1 = texture2D(u_image1, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
		
		'highp vec4 texelColor = color0 * color1;\n' +

  '  gl_FragColor = vec4(fogColor*(1.0-fogFactor), 1.0) + fogFactor*vec4(texelColor.rgb * v_Lighting.rgb, texelColor.a);\n' + // la parte de fog		//'gl_FragColor = vec4(texelColor.rgb * v_Lighting, texelColor.a);\n' +

	'}\n';




function maze(){

	this.myMaze;
	this.myScene = [];
	this.level = 1;
	this.time = 60;
	this.lives = 3;


	this.createMaze = function(numMaze){
		var pos = new Array();
		pos.x = 0.0;
		pos.y = 0.0;

		this.myMaze = new Maze(numMaze);
		this.myMaze.randPrim(new Pos(0, 0));
	}
	var that = this;
	this.drawTime = function (){
		
		ctx_2d.fillStyle = 'green';
		ctx_2d.font = '30pt VTFMisterPixelRegular';
		ctx_2d.clearRect(0, 0, canvas.width, canvas.height);
		ctx_2d.fillText(this.time, 740, 40);
   	this.time = this.time -1;
   	//setTimeout ("drawTime()",1000);
		
	
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

function TexturaMe(Texture){
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
	this.speed = speed;;
	
 }


function Floor(mMatrix){

	 this.id = "F1"
	 this.mMatrix = mMatrix;
}

function Cubo(x,y,z,mMatrix){

	 this.id = "P";
	 this.x = x;
	 this.y = y;
	 this.z = z;
	 this.mMatrix = mMatrix;
}

function Me (x,y,z,mMatrix){
	this.id = "M";
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

			//console.log(objfloorvar1.floorTexture);
			/*gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D,myBuffers[y].Texture);

			gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,myBuffers[y].VerticesIndicesBuffer);
			*/

			var u_image0Location = gl.getUniformLocation(gl.program, "u_image0");
  			var u_image1Location = gl.getUniformLocation(gl.program, "u_image1");
  			
  			if (mazes[0].myScene[x].id === "M"){

  				gl.activeTexture(gl.TEXTURE0);
  				gl.bindTexture(gl.TEXTURE_2D, myBuffers[3].Texture);
  				moveMe(mazes,x);
  				//enemyMove(mazes,x);
				 
			}else if (mazes[0].myScene[x].id === "E") {
				gl.activeTexture(gl.TEXTURE0);
  				gl.bindTexture(gl.TEXTURE_2D, myBuffers[4].Texture);
  				enemyMove(mazes,x);

  				}
  			else{

				gl.activeTexture(gl.TEXTURE0);
  				gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);
  			}
  			
  			gl.activeTexture(gl.TEXTURE1);
  			gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);
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

function ponerCuboLaberinto(mazes/*,myScene*/){
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

function checkCubo(posx,posy,mazes/*,ctx_2d/*,myScene*/){
	if (posx === 0 & posy === 0){

		console.log("HAS llegado al final del laberinto");
		changeLevel(mazes,ctx_2d/*,myScene*/);

	}else{

		if(mazes[0].myMaze.rooms[posx][posy] === false){
			return true;
		}else{
			return false;
		}
	}
}

function checkMaze(myScene,n){



}
function enemyMove(mazes,n){

	var Sz = 1/4;
	var Sx = 1/4;
	var Sy = 1/4;


	var pos = new Array(); 
	var d = new Date();
	var tmNow = d.getTime();

   var dt = tmNow - mazes[0].myScene[n].time;
   mazes[0].myScene[n].time = d.getTime();
	
	var futuropasox = mazes[0].myScene[n].x + 1 * speed*(dt/1000);
	var futuropasoy = mazes[0].myScene[n].y + 1 * speed*(dt/1000);


	if (((Math.round(futuropasox)) > 1 && (Math.round(futuropasox)) < mazes[0].myMaze.rooms.length - 1) &&
		 ((Math.round(futuropasoy)) > 1 && (Math.round(futuropasoy)) < mazes[0].myMaze.rooms.length - 1)){
		 	//console.log("estoy moviendome bien");
		if ((mazes[0].myScene[n].sentido) === true) {
		 		mazes[0].myScene[n].x = mazes[0].myScene[n].x + 1*speedEnemy*(dt/1000);
		 	}
		if ((mazes[0].myScene[n].sentido) === false) {
		 		mazes[0].myScene[n].x = mazes[0].myScene[n].x - 1*speedEnemy*(dt/1000);
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
		 	
			

 //console.log("futuropasosx:" + futuropasosax );
	//futuropasosx = camara1.pasosx - camara1.speed*Math.cos(camara1.angle) - 1/7;
	//if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy -1/2),mazes/*,ctx_2d/*,myScene*/) === false)){


	//if ((checkCubo(Math.round(futuropasosax - 1/2),Math.round(mazes[0].myScene[n].y - 1/2),mazes) === false)){
	//	console.log("primera condicion");
	//	mazes[0].myScene[n].x = mazes[0].myScene[n].x + 1*speed*dt;
	
	/*}else if((checkCubo(Math.round(mazes[0].myScene[n].x - 1/2),Math.round(futuropasosay - 1/2),mazes) === false)){
				console.log("segunda condicion")

		mazes[0].myScene[n].y = mazes[0].myScene[n].y + 1 * speed * dt;

	}else if((checkCubo(Math.round(futuropasosdx - 1/2),Math.round(mazes[0].myScene[n].y - 1/2),mazes) === false)){
		console.log("tercera condicion")

			mazes[0].myScene[n].x = mazes[0].myScene[n].x - 1 * speed * dt;

	}else {
		console.log("cuarta condicion")

		mazes[0].myScene[n].y = Math.round(mazes[0].myScene[n].y - 1 * speed * dt);
	}*/

	//mazes[0].myScene[n].x = mazes[0].myScene[n].x + 1*speed*dt;

	pos.x = mazes[0].myScene[n].x ;
	pos.y = mazes[0].myScene[n].y;

	var mMatrix = new Matrix4();

	mMatrix = mMatrix.translate(pos.x,pos.y,alturaOjos);
	mMatrix = mMatrix.scale(Sx,Sy,Sz);

 	mazes[0].myScene[n].mMatrix = mMatrix;

}
function moveMe(mazes,n){
	var pos = new Array();
	pos.x = camara1.pasosx ;
	pos.y = camara1.pasosy ;

	var Sz = 1/20;
	var Sx = 1/20;
	var Sy = 1/20;

	var mMatrix = new Matrix4();

	mMatrix = mMatrix.translate(pos.x,pos.y,alturaOjos);
	mMatrix = mMatrix.scale(Sx,Sy,Sz);

	mazes[0].myScene[n].x = pos.x;
	mazes[0].myScene[n].y = pos.y;
	mazes[0].myScene[n].mMatrix = mMatrix;

}

function cameraMove (signo,mazes){
	camara1.anglez = camara1.anglez + signo;
	camara1.pasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle)*signo;
	camara1.pasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle)*signo;
}
//funciones para eliminar enemigos
function checkEnemyDistance(mazes,x){
	//var distacia =
	var numAx = mazes[0].myScene[x].x;
	var numAy = mazes[0].myScene[x].y;

	//var NumBx = camara1.viewx ;
	//var NumBy = camara1.viewy ;

	var numBx = camara1.pasosx ;
	var numBy = camara1.pasosy ;
 
	var numx = Math.pow(numAx - numBx,2);
	var numy = Math.pow(numAy - numBy,2);
	
	var distancia = Math.sqrt(numx + numy);
	console.log("detectando");

	if (distancia < 0.25){
		console.log("muere!!!");
		return "mueres";
	}else if ( distancia < 1){
		console.log("detector de disparo");

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
			}
		}
	}
}

function shot(mazes){

	for(x in mazes[0].myScene) {
		if(mazes[0].myScene[x].id === "E"){
			
			if (checkEnemyDistance(mazes,x) === true){
				console.log("Enemigo eliminado");
				delEnemy(mazes,x);
			}else if (checkEnemyDistance(mazes,x) === "mueres"){
				mazes[0].lives = mazes[0].lives - 1;
				console.log("Tienes una vida menos" + mazes[0].lives);
			}else{
			console.log("apunta un poco mejor");
			}
		}
	}

}
function argumentsToMove(mazes/*ctx_2d*/,alturaOjos/*,myScene*/){
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
					futuropasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle) + 1/7 ;
					futuropasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle) + 1/7;

					if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy -1/2),mazes/*,ctx_2d/*,myScene*/) === false)){

					   if((checkCubo(Math.round(futuropasosx - 1/2),Math.round(camara1.pasosy -1/2 - 1/7),mazes/*,ctx_2d,/*myScene*/) === false) &&
									(checkCubo(Math.round(camara1.pasosx - 1/2 - 1/7),Math.round(futuropasosy -1/2),mazes/*,ctx_2d,/*myScene*/) === false)){

							cameraMove(1,mazes);
							cameraView();
							mazes[0].myMaze.pos.x = Math.round(camara1.pasosx - 1/2);
							mazes[0].myMaze.pos.y = Math.round(camara1.pasosy - 1/2);
							mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);
						}
					}
					checkEnemy(mazes);
					break;
				case 83: //Down

					futuropasosx = camara1.pasosx - camara1.speed*Math.cos(camara1.angle) - 1/7;
					futuropasosy = camara1.pasosy - camara1.speed*Math.sin(camara1.angle) - 1/7;

					if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy - 1/2),mazes/*,ctx_2d,/*myScene*/) === false)){

						if((checkCubo(Math.round(futuropasosx - 1/2),Math.round(camara1.pasosy -1/2 +1/7),mazes/*,ctx_2d,/*myScene*/) === false) &&
									(checkCubo(Math.round(camara1.pasosx - 1/2 +1/7),Math.round(futuropasosy -1/2),mazes/*,ctx_2d,/*myScene*/) === false)){
						 	cameraMove(-1,mazes); 
							cameraView(); 
							mazes[0].myMaze.pos.x = Math.round(camara1.pasosx - 1/2);
							mazes[0].myMaze.pos.y = Math.round(camara1.pasosy - 1/2);
							mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);
						}
					}
					checkEnemy(mazes);

					break;
				case 50:
					camara1.alturaOjos = 6;
					console.log("anngulo antes"+camara1.angley);

					cameraViewz = camara1.viewx + camara1.viewy;
					camara1.angley = -90*Math.PI/180;
					camara1.caminar = 0;
					cameraView();
						//console.log("anngulo antes"+camara1.angley);

					break;
				case 51:
					camara1.alturaOjos = 1;
					console.log("anngulo antes"+camara1.angley);

					cameraViewz = camara1.viewx + camara1.viewy;
					camara1.angley = -90*Math.PI/180;
					camara1.caminar = 0;
					cameraView();

					break;
				case 49: 
					camara1.alturaOjos = alturaOjos;
					camara1.angley = Math.PI/180;
					camara1.caminar = 1;
					cameraView();

					break;
				case 32:
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

function createMe(mazes){

	var pos = new Array();
	pos.x = camara1.pasosx ;
	pos.y = camara1.pasosy ;

	var Sz = 1/20;
	var Sx = 1/20;
	var Sy = 1/20;

	var mMatrix = new Matrix4();

	mMatrix = mMatrix.translate(pos.x,pos.y,alturaOjos);
	mMatrix = mMatrix.scale(Sx,Sy,Sz);
	
	mazes[0].myScene.push(new Me(pos.x,pos.y,alturaOjos,mMatrix));
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

//resetMyscene

function changeLevel(mazes/*,ctx_2d/*,myScene*/){

	console.log("estoy cambiando de nivel");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	var pos = new Array();
	pos.x = 0.0;
	pos.y = 0.0;

	mazes[0].createMaze(30);

	mazes[0].myMaze.randPrim(new Pos(0, 0));

	mazes[0].myMaze.pos.x = Math.round(pos.x - 1/2);
	mazes[0].myMaze.pos.y = Math.round(pos.y - 1/2);
	
	pos = rndPosition(mazes);
   pos.x = pos.x + 1/2;
	pos.y = pos.y + 1/2;

	resetCamera(pos.x,pos.y);

	ctx_2d.clearRect(0,0,100,700);

	mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);


	mazes[0].myScene = [];

	mMatrix = new Matrix4();
	mMatrix.scale(LABERINTOX,LABERINTOY,1);
	mazes[0].myScene.push(new Floor(mMatrix));
	ponerCuboLaberinto(mazes/*,myScene*/);



}
//function createMaze()

function argumentsTodrawTime(mazes){
	  	 	console.log("Estoy pintando1");
	//setTimeout ("drawTime()",1000);
		//setTimeout (drawTime(),1000);
	//var time = mazes[0].time
	drawTime();
	function drawTime(){
		//setinterval(drawTime,1000);
	
		
  	 	ctx_2d.fillStyle = 'green';
		ctx_2d.font = '30pt VTFMisterPixelRegular';
		ctx_2d.clearRect(0, 0, canvas.width, canvas.height);

   	ctx_2d.fillText(mazes[0].time, 750, 50);
   	mazes[0].time = mazes[0].time -1;

   	//setTimeout("argumentsTodrawTime(mazes)",1000);
	}
}
 var time = 60;

//drawTime();
function drawTime(){
		//console.log("Estoy pintando2");
		
  	 	//console.log("Estoy pintando");
  	 	ctx_2d.fillStyle = 'green';
		ctx_2d.font = '30pt VTFMisterPixelRegular';
		ctx_2d.clearRect(0, 0, canvas.width, canvas.height);
		ctx_2d.fillText(time, 750, 50);
   	time = time -1;
   	setTimeout ("drawTime()",1000)
}

function main() {


	//CONSTANTES



	

	//Variables de cámara

	//var pasos = 0.0;
	//var angle = 0.0;

	var pos = new Array();
	pos.x = 0.0;
	pos.y = 0.0;

	//var speed = 0.08;
	//var moveAngle = 0;
	//const alturaOjos = 0.50;
	//var anglez = 0.0;

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
	//var myScene = [];

	//Variable laberinto
	var mazes = [];
	//var myMaze = new Maze(MAZESZ);

	//Variables canvas
	/*var canvas = document.getElementById('webgl');
	var canvas2d = document.getElementById('2d');
	var ctx_2d = canvas2d.getContext("2d");
	var gl = getWebGLContext(canvas);*/


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

	/*myMaze.randPrim(new Pos(0, 0));
	
	pos = rndPosition(myMaze);
   pos.x = pos.x + 1/2;
	pos.y = pos.y + 1/2;

	myMaze.pos.x = Math.round(pos.x - 1/2);
	myMaze.pos.y = Math.round(pos.y - 1/2);

	myMaze.draw(ctx_2d, 0, 0, 5, 0);*/

	mazes.push( new maze);

	mazes[0].createMaze(20);
	mazes[0].myMaze.randPrim(new Pos(0, 0));

	pos = rndPosition(mazes);

   pos.x = pos.x + 1/2;
	pos.y = pos.y + 1/2;

	mazes[0].myMaze.pos.x = Math.round(pos.x - 1/2);
	mazes[0].myMaze.pos.y = Math.round(pos.y - 1/2);

	mazes[0].myMaze.draw(ctx_2d, 0, 0, 5, 0);

	camara1 = new camara(pasos,angle,pos.x,pos.y,speed,moveAngle,alturaOjos,anglez);
	//createEnemys(mazes);
	//Meto el buffer de suelo
	myBuffers.push(new floorVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer,VerticesNormalBuffer));
	//Meto el buffer de cubo
	myBuffers.push(new cuboVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer,VerticesNormalBuffer));
	myBuffers.push(new texturacombinada(Texture));
	myBuffers.push(new TexturaMe(Texture));
	myBuffers.push(new TexturaEnemy(Texture));

	projMatrix.setPerspective(100, canvas.width/canvas.height, 0.20, 100);
	mMatrix = new Matrix4();
	mMatrix.scale(LABERINTOX,LABERINTOY,1);

	mazes[0].myScene.push(new Floor(mMatrix));

	ponerCuboLaberinto(mazes/*.myMaze,myScene*/);
	createMe(mazes);
	createEnemys(mazes,numEnemys);

	 //ponerCubo(NUMCUBOS,LABERINTOX,LABERINTOY);

	initCuboBuffers(myBuffers,gl);
	initFloorBuffers(myBuffers,gl);

	initTextures(0,"cobblestone.png",myBuffers,gl);//Inicializo las texturas de suelo
	initTextures(1,"brick.png",myBuffers,gl);// Inicializo las texturas de cubo
	initTextures(2,"verde256.jpg",myBuffers,gl);//Inicio la textura que quiero combinar
	initTextures(3,"me",myBuffers,gl);
	initTextures(4,"fantasma256.jpg",myBuffers,gl);
	

	Raton1 = new Raton(alturaOjos);

	argumentsToDraw(viewMatrix,projMatrix,mvpMatrix,myBuffers,mazes,gl,alturaLuz);
	argumentsToMove(mazes/*myMaze*//*,ctx_2d*/,alturaOjos/*,myScene*/);
	//drawScene();
	 document.addEventListener('mousemove', Raton1.mueveRaton);
	//setTimeout ("mazes[0].drawTime()",1000);
	//drawTime();
	//mazes[0].drawTime();
	//argumentsTodrawTime(mazes);
	//var time = setTimeout ("argumentsTodrawTime()",1000,[mazes]);
}


