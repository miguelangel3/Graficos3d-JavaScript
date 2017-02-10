 var shapes = [];
 var canvas;
 var ctx;

function Meteoro (id,x,y,radious,color){
	this.id = id;
  	this.x = x;
  	this.y = y;
  	this.radious = radious;
  	this.color = color;
  	that=this;

  	this.draw = function(){
  		ctx.save();
  		ctx.beginPath();
    	ctx.arc(that.x, that.y, that.radious, 0, 2 * Math.PI, false);
    	ctx.fillStyle = that.color;
    	ctx.fill();
    	ctx.restore();

  	}
  	this.move = function(){
  		that.x = that.x -1;
  		drawShapes();
  	}
}

function drawShapes(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(x in shapes) {
      shapes[x].draw();
    }


}

function getShape(id) {
  for(x in shapes) {
   	if(shapes[x].id === id)
      return shapes[x];
  }
}

function render() {
	var id ="m0";
	var obj = getShape(id);
	console.log(id);
	  if(obj !== undefined)
	  {
	    obj.move();
	    if(obj.x < (-30))
	      obj.x = canvas.width+30;
	  }

	  //points = Math.random();

	  drawShapes();
}

function MeteorosRnd(){
	var position ;
	//var radious;

	for (var i = 0; i < 0; i++) {

		position = Math.floor(Math.random()*200);

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

  	shapes.push(new Meteoro("m1",canvas.width+30,200,20,"red"));
  	//MeteorosRnd();
  	//setInterval(render,60);
  
}