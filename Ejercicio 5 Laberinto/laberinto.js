// Miguel Ángel Alba Blanco ISAM

 //Shader con textura

 //Shader con textura

   var VSHADER_SOURCE =
  'attribute highp vec3 a_VertexPosition;\n' +
  'attribute highp vec2 a_TextureCoord;\n' +
  'attribute highp vec3 a_VertexNormal;\n' +

  'uniform highp vec3 u_LightPosition;\n' +
  'uniform highp mat4 u_NormalMatrix;\n' +
  'uniform highp mat4 u_MvpMatrix;\n' +
  'uniform highp mat4 u_ModelMatrix;\n' +
  'varying highp vec2 v_TextureCoord;\n' +
  'varying highp vec3 v_Lighting;\n' +
  
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * vec4(a_VertexPosition, 1.0);\n' +
  '  v_TextureCoord = a_TextureCoord;\n' +

  '  highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);\n' +
  '  highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);\n' +
  '  highp vec3 pointLightPosition = (u_LightPosition);\n' +
  //'  highp vec3 inverse = vec3(-1.0,-1.0,-1.0);\n' +
  //'  highp vec3 pointLightPosition = vec3(1.0, -10.0, 0.0);\n' +

  '  vec4 vertexPosition = u_ModelMatrix * vec4(a_VertexPosition, 1.0);\n' +
   '  highp vec3 lightDirection =  normalize(vec3(vertexPosition) - pointLightPosition);\n' +
  '  highp vec4 transformedNormal = u_NormalMatrix * vec4(a_VertexNormal, 1.0);\n' +
  '  highp float directionalW = max(dot(transformedNormal.xyz, lightDirection), 0.0);\n' +

  '  v_Lighting = ambientLight + (directionalLightColor * directionalW);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'varying highp vec3 v_Lighting;\n' +
  'varying highp vec2 v_TextureCoord;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'void main() {\n' +
  '  highp vec4 texelColor = texture2D(u_Sampler, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
  '  gl_FragColor = vec4(texelColor.rgb * v_Lighting, texelColor.a);\n' +
'}\n';





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

function camara (pasos,angle,pasosx,pasosy,speed,moveAngle,alturaOjos,anglez){

   this.id = "C1"
   this.pasos = pasos;
   this.angle = angle;
   this.angley = 0;
   this.pasosx = pasosx;
   this.pasosy = pasosy;
   this.speed = speed;
   this.moveAngle = moveAngle;
   this.moveAngley = 0;
   this.alturaOjos = alturaOjos;
   this.anglez = anglez;

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

function Raton(){

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

      if ((that.mouse.y) > (that.mouseantesy)) {

         camara1.moveAngley = checkAngle(camara1.moveAngley - 5,"y");
         camara1.angley = camara1.moveAngley * Math.PI/180;

      }else if ((that.mouse.y) < (that.mouseantesy)){

         camara1.moveAngley = checkAngle(camara1.moveAngley + 5,"y");
         camara1.angley = camara1.moveAngley * Math.PI/180;

      }

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

function argumentsToDraw(viewMatrix,projMatrix,mvpMatrix,myBuffers,myScene,gl){
   requestAnimationFrame(drawScene);

   function drawScene(){

     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

   var y  = 1; //Esta variable la declaro para selccionar uno de los dos buffers para pintar correctamente.
         requestAnimationFrame(drawScene);


   for (x in myScene){

      viewMatrix.setLookAt(camara1.pasosx,camara1.pasosy,camara1.alturaOjos,camara1.pasosx+Math.cos(camara1.angle),
                  camara1.pasosy+Math.sin(camara1.angle),camara1.alturaOjos+Math.sin(camara1.angley) + 0.02*Math.sin(camara1.anglez), 0,0,1);


      //lamada a los buffers para pintar con texturas
      if (myScene[x].id === "F1"){
         y = 0;
      }else{
         y = 1;
      }

      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(myScene[x].mMatrix);

      gl.uniformMatrix4fv(u_ModelMatrix, false, myScene[x].mMatrix.elements);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      var lightposx = camara1.pasosx;// + Math.cos(camara1.angle);
      var lightposy = camara1.pasosy;// + Math.sin(camara1.angle) + camara1.alturaOjos + Math.sin(camara1.angley);
      var lightposz = camara1.alturaOjos;// + Math.sin(camara1.angley) + 0.02*Math.sin(camara1.anglez);

     //lightposx= -1*lightposx;
     //lightposy = -1*lightposy;
      //lightposz = -1*lightposz; // Al invertirlo puedo ver la luz reflejada en los cubos chapuza


      var pointLightPosition = gl.getUniformLocation (gl.program, "u_LightPosition");
      gl.uniform3fv(pointLightPosition,[lightposx,lightposy,lightposz]);

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
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,myBuffers[y].Texture);

      gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,myBuffers[y].VerticesIndicesBuffer);


      var normalMatrix = new Matrix4();
      normalMatrix.set(mMatrix);
      normalMatrix.invert();
      normalMatrix.transpose();
      var nUniform = gl.getUniformLocation(gl.program, "u_NormalMatrix");
      gl.uniformMatrix4fv(nUniform, false, normalMatrix.elements);

      


      gl.drawElements(gl.TRIANGLES, myBuffers[y].numIndices, gl.UNSIGNED_SHORT, 0);

      }
   }
}


function rndPosition(myMaze){

   var position = new Array();
   var i;
   var j;

   i = Math.round (Math.random() * (myMaze.rooms.length -1));
   j = Math.round (Math.random() * (myMaze.rooms.length -1));

   console.log("i" + i);
   console.log("j" + j);
   while (myMaze.rooms[i][j] === false){
      i = Math.round (Math.random() * (myMaze.rooms.length -1));
      j = Math.round (Math.random() * (myMaze.rooms.length -1));
      console.log("i" + i);
      console.log("j" + j);
   }

   position.x = i;
   position.y = j;
   return position;

}

function ponerCuboLaberinto(myMaze,myScene){
   var n = 1; //Empiezo en uno para que al empezar nose cargue el suelo
   for (var i = 0; i < myMaze.rooms.length; i++){
      for (var j = 0; j < myMaze.rooms.length; j++){
         if(myMaze.rooms[i][j] === false){

            var Sz = 1/2;
            var Sx = 1/2;
            var Sy = 1/2;

            positionx = i;
            positiony = j;

            var matrixc = new Matrix4();

            myScene.push(new Cubo(positionx,positiony,1,matrixc));

            myScene[n].mMatrix = myScene[n].mMatrix.translate(myScene[n].x + Sx,myScene[n].y + Sy,Sz);
            myScene[n].mMatrix = myScene[n].mMatrix.scale(Sx,Sy,Sz);
            n = n + 1;
         }
      }
   }
}

function checkCubo(posx,posy,myMaze){
   if(myMaze.rooms[posx][posy] === false){
      return true;
   }else{
      return false;
   }
}

function mueveRaton(captura){

   var mouse = new Array();
   mouse.x = captura.pageX;
   mouse.y = captura.pageY;

      console.log("posxraton:" + mouse.x, mouse.y);

   if ((mouse.x) > 0) {
      camara1.moveAngle = camara1.moveAngle + 2;
      camara1.angle = camara1.moveAngle*Math.PI/180;

   }
}
function argumentsToMove(myMaze,ctx_2d){
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
            myMaze.rooms;
            futuropasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle);
            futuropasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle);

            if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy -1/2),myMaze) === false)){

               if((checkCubo(Math.round(futuropasosx - 1/2),Math.round(camara1.pasosy -1/2),myMaze) === false) &&
                  (checkCubo(Math.round(camara1.pasosx - 1/2),Math.round(futuropasosy -1/2),myMaze) === false)){

                  camara1.anglez = camara1.anglez + 1;
                  camara1.pasosx = camara1.pasosx + camara1.speed*Math.cos(camara1.angle);
                  camara1.pasosy = camara1.pasosy + camara1.speed*Math.sin(camara1.angle);
                  myMaze.pos.x = Math.round(camara1.pasosx - 1/2);
                  myMaze.pos.y = Math.round(camara1.pasosy - 1/2);
                  myMaze.draw(ctx_2d, 0, 0, 5, 0);
               }
            }

            break;
         case 83: //Down

            futuropasosx = camara1.pasosx - camara1.speed*Math.cos(camara1.angle);
            futuropasosy = camara1.pasosy - camara1.speed*Math.sin(camara1.angle);

            if ((checkCubo(Math.round(futuropasosx - 1/2),Math.round(futuropasosy - 1/2),myMaze) === false)){

               if((checkCubo(Math.round(futuropasosx - 1/2),Math.round(camara1.pasosy -1/2),myMaze) === false) &&
                  (checkCubo(Math.round(camara1.pasosx - 1/2),Math.round(futuropasosy -1/2),myMaze) === false)){

                  camara1.anglez = camara1.anglez - 1;
                  camara1.pasosx = camara1.pasosx - camara1.speed*Math.cos(camara1.angle);
                  camara1.pasosy = camara1.pasosy - camara1.speed*Math.sin(camara1.angle);
                  myMaze.pos.x = Math.round(camara1.pasosx - 1/2);
                  myMaze.pos.y = Math.round(camara1.pasosy - 1/2);
                  myMaze.draw(ctx_2d, 0, 0, 5, 0);
               }
            }

            break;
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
      /*
      -1.0, -1.0, 0.0,  1.0, -1.0, 0.0, -1.0, 1.0, 0.0, //t1 izquierdo
       1.0, -1.0, 0.0, -1.0,  1.0, 0.0,  1.0, 1.0, 0.0,  //t2 derecho
      */
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, floorVertices, gl.STATIC_DRAW);

   myBuffers[0].VerticesNormalBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesNormalBuffer);

   var vertexNormals = new Float32Array([
      -1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0,  1.0,  1.0,
       -1.0,  1.0,  1.0
     /* 
      -1.0, -1.0, 0.0,  1.0, -1.0, 0.0, -1.0, 1.0, 0.0, //t1 izquierdo
       1.0, -1.0, 0.0, -1.0,  1.0, 0.0,  1.0, 1.0, 0.0  //t2 derecho
*/
   ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);


   myBuffers[0].VerticesTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[0].VerticesTextureCoordBuffer);


   var textureCoordinates = new Float32Array([

      0.0,  0.0,     50,  50,    0.0,  50,   50,  0.0
/*
      0.0,  0.0,     50.0,  0.0,     50.0,  50.0,     0.0,  50.0,  // Front
      0.0,  0.0,     50.0,  0.0,     50.0,  50.0,     0.0,  50.0  //Botom*/
  
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

   myBuffers[0].VerticesIndicesBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myBuffers[0].VerticesIndicesBuffer);

   var floorVerticesIndices = new Uint16Array([
     0,  1,  2,      0,  2,  3
     // 0,1,2,  3,4,5 //floor
   ])
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndices, gl.STATIC_DRAW);

   }



function initCuboBuffers(myBuffers,gl){

   myBuffers[1].VerticesBuffer = gl.createBuffer();

   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesBuffer);

   var vertices = new Float32Array([

   /*  -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,   // Front face
    -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,   // Back face
    -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,   // Top face
    -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,   // Bottom face
     1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,   // Right face
    -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0   */ // Left face

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

   /*  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,   // Front face
     0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,   // Back face
     0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,   // Top face
     0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,   // Bottom face
     1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,   // Right face
    -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0 */
   
     -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,   // Front face
      -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,   // Back face
      -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,   // Top face
      -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,   // Bottom face
       1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,   // Right face
      -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
   ]);

   gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);





   myBuffers[1].VerticesTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, myBuffers[1].VerticesTextureCoordBuffer);

   var textureCoordinates = new Float32Array([

   /* 0.0,  0.0,     1,  1,    0.0,  1,   1,  0.0,  // Front
    0.0,  0.0,     1,  1,    0.0,  1,   1,  0.0,  // Back
    0.0,  0.0,     1,  1,    0.0,  1,   1,  0.0,  // Top
    0.0,  0.0,     1,  1,    0.0,  1,   1,  0.0,  // Bottom
    0.0,  0.0,     1,  1,    0.0,  1,   1,  0.0, // Right
    0.0,  0.0,     1,  1,    0.0,  1,   1,  0.0 // Left
    */
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

   //   0,  1,  2,      0,  2,  3,  /*Front*/ 4,  5,  6,    4,  6,  7,  //Back
   // 8,  9,  10,     8,  10, 11, /*Top*/   12, 13, 14,   12, 14, 15, //Bottom
   // 16, 17, 18,     16, 18, 19, /*Right*/ 20, 21, 22,   20, 22, 23  //Left


      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left*/
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

function main() {


   //CONSTANTES

   var LABERINTOX = 50,LABERINTOY = 50;
   var NUMCUBOS = 50;

   //Variables de cámara

   var pasos = 0.0;
   var angle = 0.0;
   var pos = new Array();
   pos.x = 0.0;
   pos.y = 0.0
   var speed = 0.08;
   var moveAngle = 0;
   var alturaOjos = 0.50;
   var anglez = 0.0;

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
   var myScene = [];

   //Variable laberinto
   var myMaze = new Maze(MAZESZ);

   //Variables canvas
   var canvas = document.getElementById('webgl');
   var canvas2d = document.getElementById('2d');
   var ctx_2d = canvas2d.getContext("2d");
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

  // Specify the color for clearing <canvas>

  //Inicio para las texturas

   gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
   gl.clearDepth(1.0);                 // Clear everything
   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

   // Get the storage location of u_MvpMatrix
   //var myMaze = new Maze(MAZESZ);

   myMaze.randPrim(new Pos(0, 0));

   pos = rndPosition(myMaze);

   pos.x = pos.x + 1/2;
   pos.y = pos.y + 1/2;

   myMaze.pos.x = Math.round(pos.x - 1/2);
   myMaze.pos.y = Math.round(pos.y - 1/2);

   myMaze.draw(ctx_2d, 0, 0, 5, 0);

   camara1 = new camara(pasos,angle,pos.x,pos.y,speed,moveAngle,alturaOjos,anglez);
   //Meto el buffer de suelo
   myBuffers.push(new floorVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer,VerticesNormalBuffer));
   //Meto el buffer de cubo
   myBuffers.push(new cuboVarBuffer(Texture,VerticesBuffer,VerticesTextureCoordBuffer,VerticesIndicesBuffer,VerticesNormalBuffer));


   projMatrix.setPerspective(100, canvas.width/canvas.height, 0.00001, 10);

   mMatrix = new Matrix4();
   mMatrix.scale(LABERINTOX,LABERINTOY,1);

   myScene.push(new Floor(mMatrix));

   ponerCuboLaberinto(myMaze,myScene);
   //ponerCubo(NUMCUBOS,LABERINTOX,LABERINTOY);

   initCuboBuffers(myBuffers,gl);
   initFloorBuffers(myBuffers,gl);

   initTextures(0,"cobblestone.png",myBuffers,gl);//Inicializo las texturas de suelo
   initTextures(1,"brick.png",myBuffers,gl);// Inicializo las texturas de cubo

   Raton1 = new Raton();

   argumentsToDraw(viewMatrix,projMatrix,mvpMatrix,myBuffers,myScene,gl);
   argumentsToMove(myMaze,ctx_2d);
   //drawScene();
   document.addEventListener('mousemove', Raton1.mueveRaton);

}
