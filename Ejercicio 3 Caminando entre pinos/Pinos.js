var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
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


  function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // Three triangles on the right side
      //t1 Dibujo el primer
      0.0, 0.5, 0.0,  0.4,  1.0,  0.4, // The back green one
      0.25, 0.0, 0.25,  0.4,  1.0,  0.4,
      -0.25, 0.0, -0.25,  1.0,  0.4,  0.4,

      //t2 Dibujo el segundo

      0.0, 0.5, 0.0,  1.0,  0.4,  0.4, // The back green one
      -0.25, 0.0, 0.25,  1.0,  0.4,  0.4,
      0.25, 0.0, -0.25,  0.4,  1.0,  0.4,

      ]);

      var n =6;
      // Create a buffer object
      var vertexColorbuffer = gl.createBuffer();
      if (!vertexColorbuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }

      // Write the vertex coordinates and color to the buffer object
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
      gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

      var FSIZE = verticesColors.BYTES_PER_ELEMENT;
      // Assign the buffer object to a_Position and enable the assignment
      var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

      if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
      }
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
      gl.enableVertexAttribArray(a_Position);

      // Assign the buffer object to a_Color and enable the assignment
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
        var gl = getWebGLContext(canvas);
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

        // get the storage locations of u_ViewMatrix and u_ProjMatrix
        var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
        if (!u_ViewMatrix || !u_ProjMatrix) {
          console.log('Failed to get the storage location of u_ViewMatrix and/or u_ProjMatrix');
          return;
        }
        var modelMatrix = new Matrix4(); // The model matrix
        var viewMatrix = new Matrix4();　// The view matrix
        var projMatrix = new Matrix4();  // The projection matrix
        // calculate the view matrix and projection matrix
        modelMatrix.setTranslate(0.75, 0, 0);  // Translate 0.75 units along the positive x-axis
        viewMatrix.setLookAt(0, 0, 5, 0, 0, -1, 0.0, 1, 0);

        projMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);
        // Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the triangles
        gl.drawArrays(gl.TRIANGLES, 0, n);

        modelMatrix.setTranslate(-0.75, 0, 0); // Translate 0.75 units along the negative x-axis
        modelMatrix.rotate(40, 0, 0, 1);
        // Modify only the model matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      }
