 var shapes = [];
 var canvas;
 var ctx;

function Triangle(id,x,y,color,ang) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.color = color;
   this.speed = 0;
   this.angle = 0;
   this.moveAngle = 0;
   this.ang = ang;
   this.radious=21;
   //that=this;
	this.draw =function(){
       // Triángulo rellenado
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
      //ctx.scale(15.0, 15.0);

      //console.log(this.angle);
      //con esto pinto el área
      ctx.beginPath();
      ctx.arc(0,4, this.radious, 0, 2 * Math.PI, false);
		//ctx.fillStyle = "green";
    	ctx.lineWidth = 2;
		ctx.strokeStyle = "red";
		ctx.stroke();
    	ctx.fill();
    	//pinto el triángulo
    	ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0,-15);
      ctx.lineTo(15,15);
      ctx.lineTo(-15,15);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
   }
   this.move = function(){
      this.angle += this.moveAngle*Math.PI/180;//Lo paso a radianes
      this.x += this.speed*Math.sin(this.angle);
      this.y -= this.speed*Math.cos(this.angle);
      if(this.x > (canvas.width + 20)){
         this.x=-5;
      }else if(this.x < (-26)){
         this.x=canvas.width+5;
      }else if(this.y < (-26)){
         this.y=(canvas.height);
      }else if(this.y > canvas.height+20)
         this.y=(-5);
      }
   }

 function shots(id,x,y,angle,speed) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.speed = speed;
   this.angle = angle;
   that=this;

   this.draw = function(){
   	console.log("Estoy pintando disparos");
   	console.log("Este es el ángulo:");
   	console.log(this.angle);
   	ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.arc(0,-10, 6, 0, 2 * Math.PI, false);
		ctx.fillStyle = "blue";
    	ctx.fill();
    	ctx.restore();
   this.move = function(){
   	var speedTorpedo= this.speed;
   	//console.log("Esta es la velocidad:");
   	//console.log(this.angle);
   	if (this.speed==0){
   		console.log("Estoy en el if");
   		speedTorpedo=5;
   		this.x += speedTorpedo*Math.sin(this.angle);
      	this.y -= speedTorpedo*Math.cos(this.angle);
   	}else{
   		speedTorpedo= speedTorpedo+5;
   		this.x += speedTorpedo*Math.sin(this.angle);
      	this.y -= speedTorpedo*Math.cos(this.angle);
 		}

   }
   }
}

function Meteoro (id,x,y,radious,color){
	this.id = id;
  	this.x = x;
  	this.y = y;
  	this.radious = radious;
  	this.color = color;
  	that=this;

  	this.draw = function(){
  			//ctx.clearRect(0, 0, canvas.width, canvas.height);

  		ctx.save();
  		ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI, false);
    	//console.log("Estoy en pintar y esta es la coordenada:");
    	//console.log(this.y);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.restore();

  	}
  	this.move = function(){
  		
  		ctx.clearRect(0, 0, canvas.width, canvas.height);
  		this.x = this.x -2;
  		

  		//drawShapes();
  	}
}

function checkCollision (x,obj){
	//console.log("Estoy dentro de detectar colision")
	//t1 = getShape("t1");
	
	for (i in shapes){
		if (shapes[i].id ==="m1"){
			var Numx=Math.pow(obj.x-shapes[i].x,2);
			var Numy=Math.pow(obj.y-shapes[i].y,2);
			var Distancia=Math.sqrt(Numx +Numy);
			var DRadios= obj.radious+shapes[i].radious;
			if (Distancia < DRadios){
				positionx = Math.floor(Math.random()*100);
		      shapes[i].x = canvas.width+30+positionx;
		   	shapes[i].y = Math.floor(Math.random()*canvas.height);
				if(obj.id === "s1"){
					shapes.splice(x,1)
				}
				break;
			}else{
				//return false;
			}
		}
	}

}


function drawShapes(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(x in shapes) {
		ctx.save();
      shapes[x].draw();
      //Con esto solo me quito a los torpedos que todos tienen
      //el id como s1
      //Esta parte funciona ya que se almacenana a partir de 1 los meteoritos
      //console.log("m"+x);
      if (shapes[x].id ==="t1"){
      	//aquí tengo que hacer un cambio de variable,
      	//ya que al llamar a la función se me modificba x
      	var i=x;
      	checkCollision(i,shapes[i]);
      }
      if (shapes[x].id==="s1"){
      	var i=x;
      	console.log("Le paso el s1")
      	checkCollision(i,shapes[i]);
      	
      }
	    	/*if(checkCollision(shapes[i])){
	     		positionx = Math.floor(Math.random()*100);
		      shapes[i].x = canvas.width+30+positionx;
		   	shapes[i].y = Math.floor(Math.random()*canvas.height);

      	}*/
      
      if (shapes[x].id==="s1"){
      checkPosition(x,shapes[x]);
      }
      //console.log	("Este es el identificador:");
		//console.log(obj.id);
      ctx.restore();
   }

}

function checkPosition(x,obj){

	 if(obj.x > (canvas.width + 20)||obj.x < (-26)
	 	|| obj.y < (-26) ||obj.y > canvas.height+20 ){
	 	shapes.splice(x,1);
	 }
	
}
function getShape(id) {
  for(x in shapes) {
   	if(shapes[x].id === id)
      return shapes[x];
  }
}

function render() {
	var id ;
	for (x in shapes){
		obj=shapes[x];
		if(obj !== undefined){
		   obj.move();
		   if(obj.x < -30){
		   	positionx = Math.floor(Math.random()*100);
		      obj.x = canvas.width+30+positionx;
		   	obj.y = Math.floor(Math.random()*canvas.height);
		   }
		  }
		drawShapes();
	}

}

function keyHandler(event){
  //console.log("EStyo dentro de KeyHAndlerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  t1=getShape("t1");
  	
	switch(event.keyCode) {
		case 37:
			console.log("izquierda");
			//para hacer que se mueva con mas suavidad:
			t1.moveAngle=t1.moveAngle -1;
         t1.move();
         drawShapes();
         
		break;
		case 39:
         console.log("derecha");
         //para hacer que se mueva con mas suavidad:
			;
         t1.moveAngle=t1.moveAngle+1;
         t1.move();
         drawShapes();

         
      break;
      case 38:
      	 //para hacer que se mueva con mas suavidad:
         t1.speed=t1.speed +1;
         t1.move();
         drawShapes();

      break;
      case 40:
      	//para hacer que se mueva con mas suavidad:
         t1.speed=t1.speed -1;
         t1.move();
         drawShapes();

      break;
      case 32:
      console.log("Estoy dando al espacio");

      shapes.push(new shots("s1",t1.x,t1.y,t1.angle,t1.speed));
	     
	   drawShapes();
      break;
	default:
	console.log("Key not handled");
	}
}

function MeteorosRnd(){
	var position ;
	var positionx;

	//var radious;

	for (var i = 0; i < 6; i++) {

		position = Math.floor(Math.random()*canvas.height);
		//positionx = Math.floor(Math.random()*50);


		//shapes.push(new Meteoro("m" + i ,canvas.width +30,position,20,"red"));
		shapes.push(new Meteoro("m1",canvas.width +30,position,20,"red"));

		console.log(shapes[i].id);
	}
}

 function main(){
	canvas = document.getElementById('canvas');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return false;
  }
  	ctx = canvas.getContext('2d');
  	var position;
  	shapes.push(new Triangle("t1", 100, 100,"#FFF000",0));
  	MeteorosRnd();
	document.addEventListener('keydown', keyHandler, false);

  	setInterval(render,40);
  
}