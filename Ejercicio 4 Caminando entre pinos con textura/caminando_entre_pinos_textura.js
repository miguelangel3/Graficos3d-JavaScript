// Miguel Ángel Alba Blanco ISAM

var canvas;
var gl;
//var u_MvpMatrix;

var myScene = [];
var myBuffers = [];

//var modelMatrix = []; // Model matrix
var viewMatrix = new Matrix4();  // View matrix
var projMatrix = new Matrix4();  // Projection matrix
var mvpMatrix = new Matrix4();   // Model view projection matrix

 //Shader con textura

var VSHADER_SOURCE =
  'attribute vec3 a_VertexPosition;\n' +
  'attribute vec2 a_TextureCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying highp vec2 v_TextureCoord;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * vec4(a_VertexPosition, 1.0);\n' +
  '  v_TextureCoord = a_TextureCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying highp vec2 v_TextureCoord;\n' +
  'uniform sampler2D u_Sampler;\n' + // El sampler es la textura
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
  '}\n';





function pinoVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,
               VerticesIndicesBuffer) {

   this.id = "PB1"
   this.Texture = Texture;
   this.VerticesBuffer = VerticesBuffer;
   this.VerticesTextureCoordBuffer = VerticesTextureCoordBuffer;
   this.VerticesIndicesBuffer = VerticesIndicesBuffer;

}

function floorVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,
               VerticesIndicesBuffer){

   this.id = "FB1";
   this.Texture = Texture;
   this.VerticesBuffer = VerticesBuffer;
   this.VerticesTextureCoordBuffer = VerticesTextureCoordBuffer;
   this.VerticesIndicesBuffer = VerticesIndicesBuffer;
   this.getid = function(){

      return this.id;
   }

}

function camara (pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez){

   this.id = "C1"
   this.pasos = pasos;
   this.angle = angle;
   this.pasosx = pasosx;
   this.pasosy = pasosy;
   this.speed = speed;
   this.moveAngle = moveAngle;
   this.alturaOjos = alturaOjos;
   this.anglez = anglez;

 }


function Floor(mMatrix){

   this.id = "F1"
   this.mMatrix = mMatrix;
}

function Pino(x,y,z,mMatrix){

   this.id = "P";
   this.x = x;
   this.y = y;
   this.z = z;
   this.mMatrix = mMatrix;
}

function getShape(array,id) {
  for(x in array) {
      if(array[x].id === id)
      return array[x];
  }
}

function drawScene(){

   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   var y; //Esta variable la declaro para selccionar uno de los dos buffers para pintar correctamente.
         requestAnimationFrame(drawScene);


   for (x in myScene){
    
      viewMatrix.setLookAt(camara1.pasosx,camara1.pasosy,camara1.alturaOjos,camara1.pasosx+Math.cos(camara1.angle),
                  camara1.pasosy+Math.sin(camara1.angle),camara1.alturaOjos+ 0.01*Math.sin(camara1.anglez), 0,0,1);


      //lamada a los buffers para pintar con texturas 
      if (myScene[x].id === "F1"){
         y = 0;
      }else{
         y = 1;
      }

      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(myScene[x].mMatrix);

      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
      gl.enableVertexAttribArray(vertexPositionAttribute);
  
      var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
      gl.enableVertexAttribArray(textureCoordAttribute);

      gl.bindBuffer(gl.ARRAY_BUFFER,myBuffers[y].VerticesBuffer);
      gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER,myBuffers[y].VerticesTextureCoordBuffer);
      gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

      //console.log(objfloorvar1.floorTexture);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,myBuffers[y].Texture);

      gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

   
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,myBuffers[y].VerticesIndicesBuffer);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);


   }
}

function plantarPino(NumPinos,bosquex,bosquey){

  for (var i = 1; i < NumPinos; i++) {

      var positionx;
      var positiony;
      var alturaPino= 20;
      var Sz =  Math.floor(Math.random()*alturaPino)+(alturaPino-10);
      var Sx = Sz/5
      var Sy = Sx;
      var angRotation = Math.floor(Math.random()*360);
      
      positionx = Math.floor(Math.random()*bosquex)-bosquex/2;
      positiony = Math.floor(Math.random()*bosquey)-bosquey/2;


      var matrixc = new Matrix4();

      myScene.push(new Pino(positionx,positiony,0,matrixc));

      myScene[i].mMatrix = myScene[i].mMatrix.translate(myScene[i].x,myScene[i].y,0);
      myScene[i].mMatrix = myScene[i].mMatrix.scale(Sx,Sy,Sz);
      myScene[i].mMatrix = myScene[i].mMatrix.rotate(angRotation,0,0,1);

  }

}

function keydown(ev){
   switch(ev.keyCode){
      case 65:  //Right

         camara1.moveAngle = camara1.moveAngle + 2;
         camara1.angle = camara1.moveAngle*Math.PI/180;

         break;
      case 68:  //Left

         camara1.moveAngle = camara1.moveAngle - 2;
         camara1.angle = camara1.moveAngle*Math.PI/180;

         break;
      case 87: //Up

         camara1.anglez = camara1.anglez + 1;
         camara1.pasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle);
         camara1.pasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle);

         break;
      case 83: //Down
         camara1.anglez = camara1.anglez - 1;
         camara1.pasosx = camara1.pasosx - camara1.speed*Math.cos(camara1.angle);
         camara1.pasosy = camara1.pasosy - camara1.speed*Math.sin(camara1.angle);

         break;
      default: return;
  }

}

function initFloorBuffers() {

   //objfloorvar1.n = objfloorvar1.n+1;

   myBuffers[0].VerticesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesBuffer);
   //pino
   var floorVertices = new Float32Array([

      -1.0, -1.0, 0.0,  1.0, -1.0, 0.0, -1.0, 1.0, 0.0, //t1 izquierdo
       1.0, -1.0, 0.0, -1.0,  1.0, 0.0,  1.0, 1.0, 0.0,  //t2 derecho

   ]);

   gl.bufferData(gl.ARRAY_BUFFER, floorVertices, gl.STATIC_DRAW);


   
   myBuffers[0].VerticesTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesTextureCoordBuffer);


   var textureCoordinates = new Float32Array([

      0.0,  0.0,     50.0,  0.0,     50.0,  50.0,     0.0,  50.0,  // Front
      0.0,  0.0,     50.0,  0.0,     50.0,  50.0,     0.0,  50.0  //Botom*/
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

   myBuffers[0].VerticesIndicesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myBuffers[0].VerticesIndicesBuffer);

   var floorVerticesIndices = new Uint16Array([
      0,1,2,  3,4,5 //floor
   ])
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndices, gl.STATIC_DRAW);

   }



function initPinoBuffers(){

   myBuffers[1].VerticesBuffer = gl.createBuffer();
   
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesBuffer);

   //Suelo
   var pinoVertices = new Float32Array([

      0.0, 0.0, 0.5,   0.25, 0.25, 0.0,  -0.25,-0.25, 0.0, //Triangulo 1
      0.0, 0.0, 0.5,  -0.25, 0.25, 0.0,   0.25,-0.25,-0.0  //Triangulo 2


   ]);

   gl.bufferData(gl.ARRAY_BUFFER, pinoVertices, gl.STATIC_DRAW);
   myBuffers[1].VerticesTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesTextureCoordBuffer);

   
   var textureCoordinates = new Float32Array([

      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // t1 
      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0  //t2
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
   myBuffers[1].VerticesIndicesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myBuffers[1].VerticesIndicesBuffer);

   var pinoVerticesIndices = new Uint16Array([
         0,1,2,  3,4,5 //pino
   ])
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pinoVerticesIndices, gl.STATIC_DRAW);

   }

function initTextures(y,imagen) {

   myBuffers[y].Texture = gl.createTexture();
   console.log(myBuffers[y].Texture);

   gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);//esto se puede borrar
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, //esto se puede borrar
              new Uint8Array([0, 0, 255, 255])); //esto se puede borrar

   var image = new Image();
   image.onload = function() { handleTextureLoaded(y,image); }
   image.src = "resources/" + imagen;
}

function handleTextureLoaded(y,image) {
   console.log("handleTextureLoaded, image = " + image);

   gl.bindTexture(gl.TEXTURE_2D, myBuffers[y].Texture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
   gl.generateMipmap(gl.TEXTURE_2D);
   gl.bindTexture(gl.TEXTURE_2D, null);

}

function main() {
   

   //CONSTANTES
   
   var BOSQUEX = 50,BOSQUEY = 50;
   var NUMPINOS = 100;
   
   //Variables de cámara

   var pasos = 0.0;
   var angle = 0.0;
   var pasosx = 4.0;
   var pasosy = 0.0;
   var speed = 0.5;
   var moveAngle = 0;
   var alturaOjos = 1.70;
   var anglez = 0.0;

   //Variables buffer texturas pino

   var Texture;
   var VerticesBuffer
   var VerticesTextureCoordBuffer;
   var VerticesIndicesBuffer; 

   //Arrays
   //var myBuffers = [];

   //var myScene = [];


   //Variables canvas
   var canvas = document.getElementById('webgl');

   gl = getWebGLContext(canvas);

   if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
   }

   // Initialize shaders
   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
   }

   u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

   if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
   }

  // Specify the color for clearing <canvas>

  //Inicio para las texturas

   gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
   gl.clearDepth(1.0);                 // Clear everything
   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

   // Get the storage location of u_MvpMatrix
  

   camara1 = new camara(pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez);
   //Meto el buffer de suelo
   myBuffers.push(new floorVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer));
   //Meto el buffer de pino
   myBuffers.push(new pinoVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer));


   projMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);

   mMatrix = new Matrix4();
   mMatrix.scale(BOSQUEX,BOSQUEY,1);

   myScene.push(new Floor(mMatrix));
   
   plantarPino(NUMPINOS,BOSQUEX,BOSQUEY);
 
   initPinoBuffers();
   initFloorBuffers();
   
   initTextures(0,"hierba2.jpg");//Inicializo las texturas de suelo
   initTextures(1,"pino.jpg");// Inicializo las texturas de pino

   drawScene();

   document.onkeydown = function(ev){
      keydown(ev);
   }
}
