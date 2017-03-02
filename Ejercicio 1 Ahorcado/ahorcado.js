
// var fruta = "melon";
var fruta = "";
var contadorVidas = 1;
var arrayFruits = ["melon","sandia","naranja","manzana","pera","platano","coco","granada","kiwi","limon"];
var wordToFind =[];

function chooseFruit(){
	var x ;
	x = Math.floor(Math.random() * arrayFruits.length);
	console.log(x);
	fruta = arrayFruits[x]

}

function toBarraBaja(word){
	var wordBarraBaja = [];
	for (var i = 0; i < word.length; i++) {
		wordBarraBaja[i] = " _"
	}
	return wordBarraBaja;
}

function restart(){

	location.reload(true);
}

function checkLetter (wordToFind){
	var letter;
	var encontrada = 0;

	letter = document.getElementById("letter").value;
	letter = letter.toLowerCase();
		for (i=0; i<fruta.length; i++){
			if (fruta[i] === letter) {
				document.getElementById("word").innerHTML = "letra correcta";
				wordToFind[i] = fruta[i].split("");
				encontrada += 1;
			}
		}
		if (encontrada == 0 ) {
			if (contadorVidas <= 6) {
				contadorVidas += 1;
				document.getElementById("myImage").src = "imagenes/ahorcado"+contadorVidas+".jpg"
				document.getElementById("word").innerHTML = "letra incorrecta";
			}
		}
	return wordToFind;
}

function inicio() {
	chooseFruit();
	wordToFind = toBarraBaja(fruta);
	document.getElementById("wordToFind").innerHTML = wordToFind;
}

function main() {

	finalWordToFind = wordToFind;

	if (fruta == document.getElementById("letter").value) {
		document.getElementById("wordToFind").innerHTML = "Felicidades la respuesta es: "+ fruta;
	}
	else {
		var finalWordToFind = checkLetter(finalWordToFind);
		document.getElementById("wordToFind").innerHTML = finalWordToFind;
	}
	if (contadorVidas== 7){
		document.getElementById("wordToFind").innerHTML = "Perdiste!! :( la fruta era:"+ fruta;
	}
	document.getElementById("letter").value = "";
}

main();
