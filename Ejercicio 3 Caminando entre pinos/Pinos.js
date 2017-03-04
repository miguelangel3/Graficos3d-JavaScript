// PerspectiveView_mvpMatrix.js (c) 2012 matsuda
// Vertex shader program
var canvas;
var gl;
var u_MvpMatrix;
var pasos=0.0, angulo=0.0;
var pasosx=0.8, pasosz=8.0 ;
var alturaOjos=1.70;


var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
   'uniform mat4 u_xformMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix*u_xformMatrix* a_Position;\n' +
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


function alturaPino(modelMatrix,projMatrix,viewMatrix,mvpMatrix){
   

   var Sy =  Math.floor(Math.random()*5)
   var Sx = Sy/2
   var Sz = Sx;
   var xformMatrix = new Float32Array([
      Sx,   0.0,  0.0,  0.0,
      0.0,  Sy,   0.0,  0.0,
      0.0,  0.0,  Sz,   0.0,
      0.0,  0.0,  0.0,  1.0
   ]);
   // Pass the rotation matrix to the vertex shader
   var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
   if (!u_xformMatrix) {
      console.log('Failed to get the storage location of u_xformMatrix');
      return;
   }
     //modelMatrix.setScale(Sx,Sy,Sz);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

   gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

}


function plantarPino(modelMatrix,projMatrix,viewMatrix,mvpMatrix,n){

  for (var i = 0; i < 50; i++) {
    var positionx;
    var positiony;
    positionx = Math.floor(Math.random()*10)-5;
    positionz = Math.floor(Math.random()*10)-5;

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    
    modelMatrix.setTranslate(positionx,0, positionz);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    
    alturaPino(modelMatrix,projMatrix,viewMatrix,mvpMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  }

}
function draw(delMatrix,projMatrix,viewMatrix,mvpMatrix,n){

   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
   console.log("paso2");
   viewMatrix.setLookAt(pasosx,alturaOjos,pasosz, 0.0, 0.0, 0.0, 0, 1.0,0.0);
      console.log("paso3");

   mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);// Falla en este paso
   //gl.drawArrays(gl.TRIANGLES, 0, n);
      console.log("paso4");

}

function keydown(ev, modelMatrix,projMatrix,viewMatrix,mvpMatrix,n){
   switch(ev.keyCode){
      case 65: angulo = 1; //Right
         break;  
      case 68: angulo  = 1; //Left
         break;  
      case 87: pasos = 1;  //Up
            pasosx = pasosx +pasos;
            pasosz = pasosz *pasos;
            console.log("Paso1");
    draw(pasosx,pasosz,modelMatrix,projMatrix,viewMatrix,mvpMatrix,n);

            /*pasosx += pasos*Math.sin(angulo);
            pasosz -= pasos*Math.cos(angulo);*/

         break;  
      case 83: pasos = -1;  //Down
            pasosx += pasos*Math.sin(angulo);
            pasosz -= pasos*Math.cos(angulo);

         break;  
      default: return; 
  }

}



function initVertexBuffers(gl) {
var verticesColors = new Float32Array([
      // Three triangles on the right side
      //t1 Dibujo el primer
      0.0, 0.5, 0.0,  0.0,  1.0,  0.0, // The back green one
      0.25, 0.0, 0.25,  0.0,  1.0,  0.0,
      -0.25, 0.0, -0.25,  0.0,  1.0,  0.0,

      //t2 Dibujo el segundo

      0.0, 0.5, 0.0,  0.0,  0.5,  0.0, // The back green one
      -0.25, 0.0, 0.25,  0.0,  0.5,  0.0,
      0.25, 0.0, -0.25,  0.0,  0.5,  0.0,

      ]);

      var n =6;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();  
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex information and enable it
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
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
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

  // Set the vertex coordinates and color (the blue triangle is in the front)
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

  var modelMatrix = new Matrix4(); // Model matrix
  var viewMatrix = new Matrix4();  // View matrix
  var projMatrix = new Matrix4();  // Projection matrix
  var mvpMatrix = new Matrix4();   // Model view projection matrix

   // Calculate the model, view and projection matrices
   modelMatrix.setTranslate(0, 0, 0);
   //COn esta matriz contrla la camara
   viewMatrix.setLookAt(pasosx,alturaOjos,pasosz, 0.0, 0.0, 0.0, 0, 1.0,0.0);

   projMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100);

   // Calculate the model view projection matrix
   mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

   // Pass the model view projection matrix to u_MvpMatrix
   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

   gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

   gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  
   plantarPino(modelMatrix,projMatrix,viewMatrix,mvpMatrix,n);

  /*document.onkeydown = function(ev){ 
   keydown(ev,modelMatrix,projMatrix,viewMatrix,mvpMatrix,n );

   }*/



　/*// Prepare the model matrix for another pair of triangles
 // modelMatrix.setTranslate(-0.75, 0, 0); //-->con esto pinto ostros dos triángulos.
  // Calculate the model view projection matrix
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  // Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles*/
}
