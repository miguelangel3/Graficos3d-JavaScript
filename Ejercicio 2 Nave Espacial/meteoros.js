 var shapes = [];
 var canvas;
 var ctx;

 function Cuadrado (id,color, x, y) {
 	this.id = id;
   this.speed = 0;
   this.angle = 0;
   this.moveAngle = 0;
   this.x = x;
   this.y = y;
   this.color=color;
   that=this;

   this.draw = function(){
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
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
  		this.x = this.x -5;
  		

  		//drawShapes();
  	}
}

function drawShapes(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(x in shapes) {
		ctx.save();
      shapes[x].draw();
      console.log	("Este es el identificador:");
		console.log(obj.id);
      ctx.restore();
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
  console.log("EStyo dentro de KeyHAndlerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  c1=getShape("c1");

  c1.moveAngle=0;
  c1.speed=0;
  //t1.moveAngle=0;
  //t1.speed=0;
  //ctx.clear()

	switch(event.key) {
		case "ArrowLeft":
			console.log("izquierda");
			c1.moveAngle=5;
         c1.move();
         //c1.draw();
         drawShapes();
         
         //t1.angulo("izquierda")
			//t1.draw();
		break;
		case "ArrowRight":
         console.log("derecha");
         c1.moveAngle=-5;
         c1.move();
         drawShapes();

         //c1.draw();
			//t1.angulo("derecha");

      break;
      case "ArrowUp":
      console.log("arriba");
         c1.speed=-5;
         c1.move();
         drawShapes();

         //c1.draw();        

      break;
      case "ArrowDown":
         c1.speed=5;
         c1.move();
         drawShapes();

         //c1.draw();

      break;
	default:
	console.log("Key not handled");
	}
}




function MeteorosRnd(){
	var position ;
	var positionx;

	//var radious;

	for (var i = 0; i < 7; i++) {

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

  	shapes.push(new Cuadrado("c1","blue", 100, 100));
  	
	//shapes[0].draw();
  	shapes.push(new Meteoro("m0",canvas.width,100,20,"red"));
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