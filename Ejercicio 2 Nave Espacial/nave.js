 var shapes = [];
 var canvas;
 var ctx;
const desp = 3;

function triangle(id,x,y,color) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.color = color;
		console.log("estoy entrando en la función");
	this.draw =function(){
		console.log("Estoy pintando");
  
    // Triángulo rellenado
    ctx.beginPath();
    ctx.moveTo(x,x);
    console.log(x);
    ctx.lineTo(x,y);
    ctx.lineTo(y,x);
    ctx.fillStyle = color;
    ctx.fill();

   //this.move = function(val)

	}()
	this.move = function(despx){
		x= x +despx;
	}
}

function getShape(id) {
  for(x in shapes) {
    if(shapes[x].id === id)
      return shapes[x];
  }
}

function keyHandler(event){
	var obj;
	obj = getShape("c1");
	//if(obj === undefined)
	//return;

	switch(event.key) {
		case "ArrowLeft":
			console.log("izquierda");
			obj.move(-desp);
			obj.draw();
		break;
		case "ArrowRight":
			obj.move(+desp);
		break;
	default:
	console.log("Key not handled");
	}

}

function main(){
	canvas = document.getElementById('canvas');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return false;
  }
  	ctx = canvas.getContext('2d');
  	document.addEventListener('keydown', keyHandler, false);

  	shapes.push(new triangle("t1", 80, 25,"#FFF000"));
}