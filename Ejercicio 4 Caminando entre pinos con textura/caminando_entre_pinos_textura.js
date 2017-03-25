// Miguel Ángel Alba Blanco ISAM

var canvas;
var gl;
var u_MvpMatrix;

var modelMatrix = []; // Model matrix
var viewMatrix = new Matrix4();  // View matrix
var projMatrix = new Matrix4();  // Projection matrix
var mvpMatrix = new Matrix4();   // Model view projection matrix


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

function Pino(id,x,y,z,matrix){
   this.id = id;
   this.x = x;
   this.y = y;
   this.z = z;
   this.matrix = matrix;
}

function drawScene(){
   gl.clear(gl.COLOR_BUFFER_BIT)
   requestAnimationFrame(drawScene,projMatrix,viewMatrix,mvpMatrix);
   for (x in modelMatrix){
      var n = initVertexBuffers(gl);
      if (n < 0) {
         console.log('Failed to set the vertex information');
         return;
      }

      viewMatrix.setLookAt(camara1.pasosx,camara1.pasosy,camara1.alturaOjos,camara1.pasosx+Math.cos(camara1.angle),
                  camara1.pasosy+Math.sin(camara1.angle),camara1.alturaOjos+ 0.01*Math.sin(camara1.anglez), 0,0,1);

      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix[x].matrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.drawArrays(gl.TRIANGLES, 0, n);

}
}

function plantarPino(n,NumPinos,bosquex,bosquey){

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
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  }

}

function keydown(ev){
   switch(ev.keyCode){
      case 65:  //Right

         camara1.moveAngle = camara1.moveAngle +2;
         camara1.angle = camara1.moveAngle*Math.PI/180;

         break;
      case 68:  //Left

         camara1.moveAngle = camara1.moveAngle -2;
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
function initVertexBuffers(gl) {
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
}


function main() {
   var canvas = document.getElementById('webgl');

   var BOSQUEX = 50,BOSQUEY = 50;
   var NUMPINOS = 100;
   
   var pasos = 0.0;
   var angle = 0.0;
   var pasosx = 4.0;
   var pasosy = 0.0;
   var speed = 0.5;
   var moveAngle = 0;
   var alturaOjos = 1.70;
   var anglez = 0.0;

   camara1= new camara(pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez);

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
   var n = initVertexBuffers(gl);
   if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
   }

  // Specify the color for clearing <canvas>
   gl.clearColor(0, 0, 0, 1);
   gl.enable(gl.DEPTH_TEST);

   // Get the storage location of u_MvpMatrix
   u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

   if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
   }
   projMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);
   plantarPino(n,NUMPINOS,BOSQUEX,BOSQUEY);
   drawScene();

   document.onkeydown = function(ev){
      keydown(ev);
   }
}
