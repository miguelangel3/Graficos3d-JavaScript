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
   //that=this;
	this.draw =function(){
       // Triángulo rellenado
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
      //ctx.scale(15.0, 15.0);

      console.log(this.angle);
      //con esto pinto el área
      ctx.beginPath();
      ctx.arc(0,4, 21, 0, 2 * Math.PI, false);
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
      /*
      ctx.fillStyle = this.color;
      ctx.moveTo(-20,0);
      ctx.lineTo(0,20);
      ctx.lineTo(18,0);*/

      ctx.closePath();
      ctx.fill();
      ctx.restore();
   }
   this.move = function(){
      this.angle += this.moveAngle*Math.PI/180;
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
   	console.log("estoy pintando disparos");
   	ctx.save();
      ctx.translate(this.x,this.y);
   	ctx.beginPath();
      ctx.arc(0,-10, 6, 0, 2 * Math.PI, false);
		ctx.fillStyle = "blue";
    	ctx.fill();
    	ctx.restore();
   this.move = function(){
   	that.x += that.speed*Math.sin(that.angle) + 2;
      that.y -= that.speed*Math.cos(that.angle) + 2;

   }
   }
}

/*
 function Cuadrado (id,color, x, y) {
 	this.id = id;
   this.speed = 0;
   this.angle = 0;
   this.moveAngle = 0;
   this.x = x;
   this.y = y;
   this.width=30;
   this.height=30;
   this.color=color;
   that=this;

   this.draw = function(){
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
    	ctx.arc(0, 0, 42/2, 0, 2 * Math.PI, false);
    	//ctx.fillStyle = "green";
    	ctx.lineWidth = 2;
		ctx.strokeStyle = "red";
		ctx.stroke();
    	ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(30/ -2, 30 / -2, 30, 30);
	   ctx.restore();
   }
   this.move = function(){
      this.angle += this.moveAngle*Math.PI/180;
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
*/
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

function drawShapes(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(x in shapes) {
		ctx.save();
      shapes[x].draw();
      //console.log	("Este es el identificador:");
		//console.log(obj.id);
      ctx.restore();
    }

}


function getShape(id) {
  for(x in shapes) {
   	if(shapes[x].id === id)
      return shapes[x];
  }
}

/*function checkCollision (){
	
	c1 = getShape("c1");
	for(x in shapes){
		if (shapes[x]!=="c1"){

			
		}
	}
}*/

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
  console.log("EStyo dentro de KeyHAndlerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
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

      shapes.push(new shots("s1",t1.x,t1.y,t1.moveAngle,t1.speed));
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


		shapes.push(new Meteoro("m" + i ,canvas.width +30,position,20,"red"));
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
  	//position1 = Math.floor(Math.random()*100);
  	//position2 = Math.floor(Math.random()*500);

  	//shapes.push(new Cuadrado("c1","blue", 100, 100));
  	
	//shapes[0].draw();
	shapes.push(new Triangle("t1", 100, 100,"#FFF000",0));

  	//shapes.push(new Meteoro("m0",canvas.width,100,20,"red"));
   //t1.draw();
	//console.log(shapes[1].y);
  	//shapes.push(new Meteoro("m1",canvas.width,300,20,"green"));
	//console.log(shapes[1].y);
  	//shapes[1].draw();
  	//shapes[2].draw();
  	//console.log(shapes[1].y);
  	//console.log(shapes[2].y);
  	//shapes[2].draw();
  	MeteorosRnd();
	document.addEventListener('keydown', keyHandler, false);

  	setInterval(render,16);
  
}