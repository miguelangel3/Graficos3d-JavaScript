/*
Miguel Ángel Alba Blanco ISAM

	Se controla con las teclas awsd

	Cada 10 segundos se suman 60 puntos y 10 cada vez que se destruye un asteroide.

*/
var shapes = [];
var canvas;
var ctx;
var intervall = null;
var score=0;

function Triangle(id,x,y,color,ang) {
	var d = new Date();
	this.id = id;
	this.x = x;
	this.y = y;
	this.color = color;
   this.speed = 0; //(s/t)
   this.angle = 0; // (rad/t)
   this.moveAngle = 0;
   this.ang = ang;
   this.radious=21;
   this.time=d.getTime();
   this.lives =5;
   
   this.draw =function(){

      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
      //ctx.scale(15.0, 15.0);

      //Pinto circunferencia
      //Lo hago en este orden para que el triángulo 
      //se pinte encima del círculo
      ctx.beginPath();
      ctx.arc(0,4, this.radious, 0, 2 * Math.PI, false);
    	ctx.lineWidth = 2;
		ctx.strokeStyle = "red";
		ctx.stroke();
    	ctx.fill();
    	
    	//Pinto el triángulo

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

   	var tmNow = d.getTime();
      var dt = tmNow - this.time;
      this.time = d.getTime();
      this.speed=this.speed+1*(dt/1000);

      this.moveAngle = this.moveAngle +1*(dt/1000);

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
   this.radious=6;
   that=this;

   this.draw = function(){
   	ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.arc(0,-10,this.radious, 0, 2 * Math.PI, false);
		ctx.fillStyle = "blue";
    	ctx.fill();
    	ctx.restore();
   this.move = function(){

   	var speedTorpedo= this.speed;
   	
   	if (this.speed==0){
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

function Meteoro (id,x,y,radious,speed,color){
	var d =new Date();

	this.id = id;
  	this.x = x;
  	this.y = y;
  	this.radious = radious;
  	this.color = color;
  	this.time = d.getTime();
  	this.speed = (speed*(-1)); 
  	that=this;

  	this.draw = function(){

  		ctx.save();
  		ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI, false);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.restore();

  	}
  	this.move = function(){
		var d = new Date();
		var tmNow = d.getTime();
		var dt = tmNow - this.time;

		if (((dt)/1000.0)>10.0){
			score = score +10;
			document.getElementById("score").innerHTML = "Puntuación: "+score+" pts";

			console.log(score);
			this.speed=this.speed -2;
			this.time=d.getTime();
		}

  		this.x = this.x +this.speed;
  	}
}

function checkCollision (x,obj){

	for (i in shapes){
		if (shapes[i].id ==="m1"){
			//console.log("Este es el objeto: " +obj.id);
			var Numx=Math.pow(obj.x-shapes[i].x,2);
			var Numy=Math.pow(obj.y-shapes[i].y,2);
			var Distancia=Math.sqrt(Numx +Numy);
			var DRadios= obj.radious+shapes[i].radious;
			
			if (Distancia < DRadios){
				positionx = Math.floor(Math.random()*100);
		      shapes[i].x = canvas.width+30+positionx;
		   	shapes[i].y = Math.floor(Math.random()*canvas.height);
				if(obj.id === "s1"){
					score = score +10;
					document.getElementById("score").innerHTML = "Puntuación: "+score+" pts";

					shapes.splice(x,1)
				}
				if(obj.id=== "t1"){
					obj.lives= obj.lives-1;
				document.getElementById("lives").innerHTML = "Tienes: "+obj.lives+" vidas" ;

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
  
      if (shapes[x].id ==="t1"){
      	//aquí tengo que hacer un cambio de variable,
      	//ya que al llamar a la función se me modificba x
      	var i=x;
      	checkCollision(i,shapes[i]);
      }
      if (shapes[x].id ==="s1"){
      	var i=x;
      	console.log("Le paso el s1")
      	console.log(shapes[x].id)
      	checkCollision(i,shapes[i]);
      	
      }
	        
      if (shapes[x].id==="s1"){
      checkPosition(x,shapes[x]);
      }
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

function restart(){

	location.reload(true);
}

function render() {
	var id ;
	var reboot;
	obj=getShape("t1");
	if (obj.lives<=0){
		alert("GAME OVER");
		reboot = alert("GAME OVER TU PUNTUACION ES:"+score);
		if (reboot== true){
			restart();
		}else{
			restart();
		}
		//clearIntervall(intervall);//esto para el intervall
	}
	for (x in shapes){
		obj=shapes[x];
		if(obj !== undefined){
		   obj.move();
		   if (obj.id ==="m1"){
			   if(obj.x < -30){
			   	positionx = Math.floor(Math.random()*100);
			      obj.x = canvas.width+30+positionx;
			   	obj.y = Math.floor(Math.random()*canvas.height);
		   }
		   }
		  }
		drawShapes();
	}

}

function keyHandler(event){
  ctx.clearRect(0,0,canvas.width,canvas.height);

   t1=getShape("t1");
  	
	switch(event.keyCode) {
		case 65:
			//console.log("izquierda");
			t1.moveAngle=t1.moveAngle -2;
         t1.move();
         drawShapes();
         
		break;
		case 68:
         //console.log("derecha");
        
         t1.moveAngle=t1.moveAngle+2;
         t1.move();
         drawShapes();
         
      break;
      case 87:
      //arriba
      	t1.speed=t1.speed +1;
         console.log(t1.speed);
         t1.move();
         drawShapes();

      break;
      case 83:
      //abajo
         t1.speed=t1.speed -1;
         t1.move();
         drawShapes();

      break;
      case 32:
      //console.log("Estoy dando al espacio");

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
	var speed;
	//var radious;

	for (var i = 0; i < 6; i++) {

		position = Math.floor(Math.random()*canvas.height);
		speed = Math.floor(Math.random()*7);

		//shapes.push(new Meteoro("m" + i ,canvas.width +30,position,20,"red"));
		shapes.push(new Meteoro("m1",canvas.width +30,position,20,speed,"red"));

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

  	intervall = setInterval(render,80);
}