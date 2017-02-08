 var shapes = [];
 var canvas;
 var ctx;
const desp = 3;

function Triangle(id,x,y,color) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.color = color;
  that=this;
		console.log("estoy entrando en la función");
	this.draw =function(){
		console.log("Estoy pintando");
    // Triángulo rellenado
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(that.x,that.x);
    console.log(x);
    ctx.lineTo(that.x,that.y);
    ctx.lineTo(that.y,that.x);
    ctx.fillStyle = that.color;
    ctx.fill();
   //this.move = function(val)

	}
  this.angulo = function(){
    ctx.rotate()
  }
	this.move = function(orientacion){
    if (orientacion == "derecha"){
      that.x = that.x +10;
      that.y = that.y +10
    }else{
      that.x = that.x -10;
      that.y = that.y -10;
    }
	}
}


function keyHandler(event){
  console.log("EStyo dentro de KeyHAndler");

	switch(event.key) {
		case "ArrowLeft":
			console.log("izquierda");
			t1.move("izquierda");
			t1.draw();
		break;
		case "ArrowRight":
      console.log("derecha");
			t1.move("derecha");
      t1.draw();
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
  	t1= new Triangle("t1", 50, 25,"#FFF000");
    t1.draw();
    document.addEventListener('keydown', keyHandler, false);
}

//1 mover nave espacial
//2 torpedos
//3 Asteroides
