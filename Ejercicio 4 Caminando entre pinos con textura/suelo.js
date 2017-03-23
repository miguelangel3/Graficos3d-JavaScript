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
  'uniform sampler2D u_Sampler;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
  '}\n';

function objfloorvar(floorTexture,floorVerticesBuffer,vertexPositionAttribute,floorVerticesTextureCoordBuffer,
               floorVerticesIndicesBuffer,n){

   this.floorTexture = floorTexture;
   this.floorVerticesBuffer = floorVerticesBuffer;
   this.vertexPositionAttribute = vertexPositionAttribute;
   this.floorVerticesTextureCoordBuffer = floorVerticesTextureCoordBuffer;
   this.floorVerticesIndicesBuffer = floorVerticesIndicesBuffer;
   this.n = n;

}

function initFloorBuffers(gl,floorVerticesBuffer,floorVerticesTextureCoordBuffer,floorVerticesIndicesBuffer) {

   objfloorvar.n = objfloorvar.n+1;
   floorVerticesBuffer = gl.createBuffer();
   var floorVertices = new Float32Array([
      -1.0, 0.0, -1.0,  1.0, 0.0,-1.0, -1.0, 0.0, 1.0, //t1 izquierdo
       1.0, 0.0, -1.0, -1.0, 0.0, 1.0,  1.0, 0.0, 1.0  //t2 derecho

      ]);

   gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, floorVertices, gl.STATIC_DRAW);

   
   floorVerticesTextureCoordBuffer = gl.createBuffer();
   var textureCoordinates = new Float32Array([
      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0  // Front

      ]);
   gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesTextureCoordBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

   floorVerticesIndicesBuffer = gl.createBuffer();
   var floorVerticesIndices = new Uint16Array([
      0, 1, 2,    1, 2, 3 //floor

      ])
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndicesBuffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndices, gl.STATIC_DRAW);

   }
function initTextures(gl,cubeImage) {
   cubeTexture = gl.createTexture();

   gl.bindTexture(gl.TEXTURE_2D, cubeTexture);//esto se puede borrar
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, //esto se puede borrar
              new Uint8Array([0, 0, 255, 255])); //esto se puede borrar

   cubeImage = new Image();
   cubeImage.onload = function() { handleTextureLoaded(gl,cubeImage, cubeTexture); }
   cubeImage.src = "resources/cubetexture.png";
}

function handleTextureLoaded(gl,image, texture) {
//console.log("handleTextureLoaded, image = " + image);
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, image);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
   gl.generateMipmap(gl.TEXTURE_2D);
   gl.bindTexture(gl.TEXTURE_2D, null);

}
function getPowerOfTwo(value, pow) {
   var pow = pow || 1;
   while(pow<value) {
      pow *= 2;
   }
   return pow;
}


  function main() {

   var canvas = document.getElementById('webgl');
   var floorTexture;
   var floorVerticesBuffer
   var vertexPositionAttribute;
   var floorVerticesTextureCoordBuffer;
   var floorVerticesIndicesBuffer;
   var cubeImage;
   var n = 6;

   objfloorvar1 = new objfloorvar(floorTexture,floorVerticesBuffer,vertexPositionAttribute,floorVerticesTextureCoordBuffer,
               floorVerticesIndicesBuffer,n)

   console.log(objfloorvar1.n);


   gl = getWebGLContext(canvas);
   if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
   }

   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
   }

  
   gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
   gl.clearDepth(1.0);                 // Clear everything
   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

   initFloorBuffers(gl,floorVerticesBuffer,floorVerticesTextureCoordBuffer,floorVerticesIndicesBuffer);
   initTextures(gl,cubeImage);
   console.log(objfloorvar1.n);

   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
   if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
   }

   var mMatrix   = new Matrix4();
   var vMatrix   = new Matrix4();
   var pMatrix   = new Matrix4();
   var mvpMatrix = new Matrix4();

   pMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);
   vMatrix.lookAt(0, 0, 2, 0, 0, 0, 0, 1, 0);
   mMatrix.translate(0.0, 0.0, 0.0);


   mvpMatrix.set(pMatrix).multiply(vMatrix).multiply(mMatrix);
   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

   var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
   gl.enableVertexAttribArray(vertexPositionAttribute);
  
   var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
   gl.enableVertexAttribArray(textureCoordAttribute);

   gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesBuffer);
   gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

   gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesTextureCoordBuffer);
   gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, floorTexture);
   gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndicesBuffer);

   gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    //initBuffers();
    //initTextures();

    //requestAnimationFrame(drawScene);
}

