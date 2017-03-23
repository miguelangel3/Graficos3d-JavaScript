// Miguel Ángel Alba Blanco ISAM

var canvas;
var gl;
var u_MvpMatrix;
var pasos=0.0, angle=0.0;
var pasosx=4.0, pasosy=0.0;
var speed=0.5;
var posVistax=0.0,posVistay=0.0;
var moveAngle=0;
var alturaOjos=1.70;
var anglez=0.0;

var bosquex=50,bosquey=50;
var NumPinos=100;

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

function Pino(id,x,y,z,matrix){
   this.id=id;
   this.x=x;
   this.y=y;
   this.z=z;
   this.matrix= matrix;
}

function drawScene(){
   gl.clear(gl.COLOR_BUFFER_BIT)
   requestAnimationFrame(drawScene);
   for (x in modelMatrix){
      var n = initVertexBuffers(gl);
      if (n < 0) {
         console.log('Failed to set the vertex information');
         return;
      }

      viewMatrix.setLookAt(pasosx,pasosy,alturaOjos,pasosx+Math.cos(angle),pasosy+Math.sin(angle),alturaOjos+ 0.01*Math.sin(anglez), 0,0,1);
      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix[x].matrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.drawArrays(gl.TRIANGLES, 0, n);

}
}

function plantarPino(n){

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
      modelMatrix[i].matrix=modelMatrix[i].matrix.translate(modelMatrix[i].x,modelMatrix[i].y,0);
      modelMatrix[i].matrix=modelMatrix[i].matrix.scale(Sx,Sy,Sz);
      modelMatrix[i].matrix=modelMatrix[i].matrix.rotate(angRotation,0,0,1);

      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix[i].matrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  }

}

function keydown(ev, modelMatrix,projMatrix,viewMatrix,mvpMatrix,n){
   switch(ev.keyCode){
      case 65:  //Right

         moveAngle=moveAngle +2;
         angle = moveAngle*Math.PI/180;

         break;
      case 68:  //Left

         moveAngle=moveAngle -2;
         angle = moveAngle*Math.PI/180;

         break;
      case 87: //Up

         anglez=anglez +1;
         pasosx =pasosx + speed*Math.cos(angle);
         pasosy =pasosy + speed*Math.sin(angle);

         break;
      case 83: //Down
         anglez=anglez -1;
         pasosx =pasosx -speed*Math.cos(angle);
         pasosy =pasosy -speed*Math.sin(angle);

         break;
      default: return;
  }

}

function initBuffers() {
  //Buffer Pinos

  

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

function initFloorBuffers(){

  var floorColors = new Float32Array([
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

}


function main() {
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
   plantarPino(n);
   drawScene();

   document.onkeydown = function(ev){
      keydown(ev,modelMatrix,projMatrix,viewMatrix,mvpMatrix,n );
   }
}
