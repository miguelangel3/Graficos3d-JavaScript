 var shapes = [];
 var canvas;
 var ctx;

 function Cuadrado(id,color, x, y) {

   this.id = id;
   this.speed = 0;
   this.angle = 0;
   this.moveAngle = 0;
   this.x = x;
   this.y = y;
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
   	that.x = that.x -3;
   	

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
    	console.log("Estoy en pintar y esta es la coordenada:");
    	console.log(this.y);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.restore();

  	}
  	this.move = function(){
  		
  		ctx.clearRect(0, 0, canvas.width, canvas.height);
  		this.x = this.x -1;
  		

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
		      obj.x = canvas.width+30;
		   	obj.y = Math.floor(Math.random()*canvas.height);
		   }
		  }
		drawShapes();
	}

}

function MeteorosRnd(){
	var position ;
	//var radious;

	for (var i = 0; i < 4; i++) {

		position = Math.floor(Math.random()*canvas.height);

		shapes.push(new Meteoro("m" + i ,canvas.width +30 ,position,20,"red"));
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
  	
	shapes[0].draw();
  	//shapes.push(new Meteoro("m0",canvas.width,100,20,"red"));
	//console.log(shapes[1].y);
  	//shapes.push(new Meteoro("m1",canvas.width,300,20,"green"));
	//console.log(shapes[1].y);
  	//shapes[1].draw();
  	//shapes[2].draw();
  	//console.log(shapes[1].y);
  	//console.log(shapes[2].y);
  	//shapes[2].draw();
  	//MeteorosRnd();
  	//setInterval(render,20);
  
}