var gl;
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


function objfloorvar(floorTexture,floorVerticesBuffer,floorVerticesTextureCoordBuffer,
               floorVerticesIndicesBuffer,n){

   this.floorTexture = floorTexture;
   this.floorVerticesBuffer = floorVerticesBuffer;
   this.floorVerticesTextureCoordBuffer = floorVerticesTextureCoordBuffer;
   this.floorVerticesIndicesBuffer = floorVerticesIndicesBuffer;
   this.n = n;

}

function initFloorBuffers(gl) {

   objfloorvar1.n = objfloorvar1.n+1;

   objfloorvar1.floorVerticesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, objfloorvar1.floorVerticesBuffer);

   var floorVertices = new Float32Array([
      -1.0, -1.0, 0.0,  1.0, -1.0, 0.0, -1.0, 1.0, 0.0, //t1 izquierdo
       1.0, -1.0, 0.0, -1.0,  1.0, 0.0,  1.0, 1.0, 0.0  //t2 derecho

   ]);

   gl.bufferData(gl.ARRAY_BUFFER, floorVertices, gl.STATIC_DRAW);


   
   objfloorvar1.floorVerticesTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, objfloorvar1.floorVerticesTextureCoordBuffer);


   var textureCoordinates = new Float32Array([
      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Front
      0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0  //Botom*/
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

   objfloorvar1.floorVerticesIndicesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objfloorvar1.floorVerticesIndicesBuffer);

   var floorVerticesIndices = new Uint16Array([
      0, 1, 2,  3,4,5 //floor
   ])
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndices, gl.STATIC_DRAW);

   }
function initTextures(gl) {
   objfloorvar1.floorTexture = gl.createTexture();
   console.log(objfloorvar1.floorTexture);

   gl.bindTexture(gl.TEXTURE_2D, objfloorvar1.floorTexture);//esto se puede borrar
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, //esto se puede borrar
              new Uint8Array([0, 0, 255, 255])); //esto se puede borrar

   var floorImage = new Image();
   floorImage.onload = function() { handleTextureLoaded(gl,floorImage); }
   floorImage.src = "resources/hierba2.png";
}

function handleTextureLoaded(gl,image) {
   console.log("handleTextureLoaded, image = " + image);

   gl.bindTexture(gl.TEXTURE_2D, objfloorvar1.floorTexture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, image);
   console.log(objfloorvar1.floorTexture);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
   gl.generateMipmap(gl.TEXTURE_2D);
   gl.bindTexture(gl.TEXTURE_2D, null);

}


  function main() {

   var canvas = document.getElementById('webgl');
   var floorTexture;
   var floorVerticesBuffer
   var floorVerticesTextureCoordBuffer;
   var floorVerticesIndicesBuffer;
   //var floorImage;
   var n = 6;

   objfloorvar1 = new objfloorvar(floorTexture,floorVerticesBuffer,floorVerticesTextureCoordBuffer,
               floorVerticesIndicesBuffer,n)

   console.log(objfloorvar1.floorTexture);


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

   initFloorBuffers(gl);
   initTextures(gl);
   requestAnimationFrame(drawScene);



   console.log(objfloorvar1.n);
}

function drawScene(){
      var canvas = document.getElementById('webgl');


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
   vMatrix.lookAt(2, 2, 3, 1, 1, 0, 0, 0, 1);
   mMatrix.translate(1.0, 1.0, 1.0);//*mMatrix.scale(100,100,0);


   mvpMatrix.set(pMatrix).multiply(vMatrix).multiply(mMatrix);
   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

   var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
   gl.enableVertexAttribArray(vertexPositionAttribute);
  
   var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
   gl.enableVertexAttribArray(textureCoordAttribute);

   gl.bindBuffer(gl.ARRAY_BUFFER,objfloorvar1.floorVerticesBuffer);
   gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

   gl.bindBuffer(gl.ARRAY_BUFFER,objfloorvar1.floorVerticesTextureCoordBuffer);
   gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

   console.log(objfloorvar1.floorTexture);
   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D,objfloorvar1.floorTexture);
   gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,objfloorvar1.floorVerticesIndicesBuffer);

   gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

   requestAnimationFrame(drawScene);
    
}

