// Miguel Ángel Alba Blanco ISAM

var canvas;
var gl;
var u_MvpMatrix;

var modelMatrix = []; // Model matrix
var viewMatrix = new Matrix4();  // View matrix
var projMatrix = new Matrix4();  // Projection matrix
var mvpMatrix = new Matrix4();   // Model view projection matrix

//shader sin textura 
/*
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix*a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';*/

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



function camara (pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez){

   this.pasos = pasos;
   this.angle = angle;
   this.pasosx = pasosx;
   this.pasosy = pasosy;
   this.speed = speed;
   this.moveAngle = moveAngle;
   this.alturaOjos = alturaOjos;
   this.anglez = anglez;

 }

function pinoVarBuffer(pinoTexture,pinoVerticesBuffer,pinoVerticesTextureCoordBuffer,
               pinoVerticesIndicesBuffer) {

   this.pinoTexture = pinoTexture;
   this.pinoVerticesBuffer = pinoVerticesBuffer;
   this.pinoVerticesTextureCoordBuffer = pinoVerticesTextureCoordBuffer;
   this.pinoVerticesIndicesBuffer = pinoVerticesIndicesBuffer;


}

function Pino(id,x,y,z,matrix){

   this.id = id;
   this.x = x;
   this.y = y;
   this.z = z;
   this.matrix = matrix;
}

function drawScene(){
   //gl.clear(gl.COLOR_BUFFER_BIT)
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   requestAnimationFrame(drawScene);//,projMatrix,viewMatrix,mvpMatrix);

   for (x in modelMatrix){
     /* var n = 6; // initVertexBuffers(gl); --> la verdad es que no se para que tenía esta llamada en teoría n es el número de vertices
      if (n < 0) {
         console.log('Failed to set the vertex information');
         return;
      }*/

      viewMatrix.setLookAt(camara1.pasosx,camara1.pasosy,camara1.alturaOjos,camara1.pasosx+Math.cos(camara1.angle),
                  camara1.pasosy+Math.sin(camara1.angle),camara1.alturaOjos+ 0.01*Math.sin(camara1.anglez), 0,0,1);

      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix[x].matrix);

      //lamada a los buffers para pintar con texturas 

      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
      gl.enableVertexAttribArray(vertexPositionAttribute);
  
      var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
      gl.enableVertexAttribArray(textureCoordAttribute);

      gl.bindBuffer(gl.ARRAY_BUFFER,pinoVarBuffer1.pinoVerticesBuffer);
      gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER,pinoVarBuffer1.pinoVerticesTextureCoordBuffer);
      gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

      //console.log(objfloorvar1.floorTexture);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,pinoVarBuffer1.pinoTexture);

      gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

   
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,pinoVarBuffer1.pinoVerticesIndicesBuffer);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      var n = 0;

      n = n + 1;

      console.log("pinta: " + n);
      //llamada a los buffers para pintar sin texturas 

      //gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      //gl.drawArrays(gl.TRIANGLES, 0, n);

   }
}

function plantarPino(/*n,*/NumPinos,bosquex,bosquey){

  for (var i = 0; i < NumPinos; i++) {

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

      modelMatrix.push(new Pino("P1",positionx,positiony,0,matrixc));

      modelMatrix[i].matrix = modelMatrix[i].matrix.translate(modelMatrix[i].x,modelMatrix[i].y,0);
      modelMatrix[i].matrix = modelMatrix[i].matrix.scale(Sx,Sy,Sz);
      modelMatrix[i].matrix = modelMatrix[i].matrix.rotate(angRotation,0,0,1);

      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix[i].matrix);

      //Esto de auí abajo sería para pintar la primera vez sin el bucle.

      //gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      //gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
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

function initPinoBuffers(){

   pinoVarBuffer1.pinoVerticesBuffer = gl.createBuffer();
   
   gl.bindBuffer(gl.ARRAY_BUFFER, pinoVarBuffer1.pinoVerticesBuffer);

   var pinoVertices = new Float32Array([

      //-1.0, -1.0, 0.0,  -1.0,  1.0, 0.0,  1.0,  1.0, 0.0,
      //  1.0, -1.0, 0.0,    // Plano suelo

      0.0, 0.0, 0.5,   0.25, 0.25, 0.0,  -0.25,-0.25, 0.0, //Triangulo 1
      0.0, 0.0, 0.5,  -0.25, 0.25, 0.0,   0.25,-0.25,-0.0  //Triangulo 2


   ]);

   gl.bufferData(gl.ARRAY_BUFFER, pinoVertices, gl.STATIC_DRAW);


   
   pinoVarBuffer1.pinoVerticesTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, pinoVarBuffer1.pinoVerticesTextureCoordBuffer);


   var textureCoordinates = new Float32Array([
      //0.0,  0.0, 50.0, 0.0, 50.0,  50.0, 0.0,  50.0,  // Plano suelo

      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // t1 
      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0  //t2
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

   pinoVarBuffer1.pinoVerticesIndicesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pinoVarBuffer1.pinoVerticesIndicesBuffer);

   var pinoVerticesIndices = new Uint16Array([
       //0,  1,  2,      0,  2,  3,
      0,1,2,  3,4,5 //pino
   ])
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pinoVerticesIndices, gl.STATIC_DRAW);

   }


function initTextures() {
   pinoVarBuffer1.pinoTexture = gl.createTexture();
   console.log(pinoVarBuffer1.pinoTexture);

   gl.bindTexture(gl.TEXTURE_2D, pinoVarBuffer1.pinoTexture);//esto se puede borrar
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, //esto se puede borrar
              new Uint8Array([0, 0, 255, 255])); //esto se puede borrar

   var pinoImage = new Image();
   pinoImage.onload = function() { handleTextureLoaded(pinoImage); }
   pinoImage.src = "resources/pino.jpg";
}

function handleTextureLoaded(image) {
   console.log("handleTextureLoaded, image = " + image);

   gl.bindTexture(gl.TEXTURE_2D, pinoVarBuffer1.pinoTexture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, image);
   //console.log(objfloorvar1.floorTexture);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
   gl.generateMipmap(gl.TEXTURE_2D);
   gl.bindTexture(gl.TEXTURE_2D, null);

}


/*function initVertexBuffers(gl) {

var verticesColors = new Float32Array([
   //t1 Dibujo el primer
   0.0, 0.0, 0.5,  0.0,  1.0,  0.0,
   0.25, 0.25, 0.0,  0.0,  1.0,  0.0,
   -0.25, -0.25, 0.0,  0.0,  1.0,  0.0,

      //t2 Dibujo el segundo

   0.0, 0.0, 0.5,  0.0,  0.5,  0.0,
   -0.25, 0.25, 0.0,  0.0,  0.5,  0.0,
   0.25, -0.25, -0.0,  0.0,  0.5,  0.0,

   ]);

   var n =6;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }


   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

   var FSIZE = verticesColors.BYTES_PER_ELEMENT;

   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
   if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
  }
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
   gl.enableVertexAttribArray(a_Position);

   var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
   if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
  }
   gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
   gl.enableVertexAttribArray(a_Color);

   return n;
}*/


function main() {
   var canvas = document.getElementById('webgl');

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

   //variables buffer texturas pino
   var pinoTexture;
   var pinoVerticesBuffer
   var pinoVerticesTextureCoordBuffer;
   var pinoVerticesIndicesBuffer; 


   camara1 = new camara(pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez);

   pinoVarBuffer1 = new pinoVarBuffer(pinoTexture,pinoVerticesBuffer,pinoVerticesTextureCoordBuffer,
               pinoVerticesIndicesBuffer); 

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

   // Set the vertex coordinates and color
   //var n = initVertexBuffers(gl);
   //if (n < 0) {
     // console.log('Failed to set the vertex information');
      //return;
  // }

  // Specify the color for clearing <canvas>

  //Inicio para las texturas

   gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
   gl.clearDepth(1.0);                 // Clear everything
   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

   //incio de canvas pero sin texturas

   //gl.clearColor(0, 0, 0, 1);
   //gl.enable(gl.DEPTH_TEST);


   // Get the storage location of u_MvpMatrix
   u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

   if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
   }
   projMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);
   plantarPino(/*n,*/NUMPINOS,BOSQUEX,BOSQUEY);

   initPinoBuffers();
   initTextures();
   drawScene();

   document.onkeydown = function(ev){
      keydown(ev);
   }
}
