
var entries = new Map();
entries.set("quantity", ["ilość", "wielkość", "dawka"]);
entries.set("right", ["prawo", "prawy", "odpowiedni", "właściwy", "dobry"]);
entries.set("fair", ["targi", "kiermasz", "sprawiedliwy", "rzetelny", "blond", "piękny", "słuszny"]);
entries.set("idle", ["bezczynny", "leniwy", "bezrobotny", "wałkonić się"]);
entries.set("cheap", ["tani", "tandetny", "ulogwy"]);
entries.set("jealous", ["zazdrosny", "zawistny"]);
entries.set("insist", ["obstawać", "nalegać", "domagać się", "nalegać na coś"]);
entries.set("appeal", ["apel", "apelacja", "wezwanie", "urok", "odezwa", "odwołać się", "zaskarżyć"]);
entries.set("suspicious", ["podejrzany", "podejrzliwy", "nieufny"]);
entries.set("take advantage of", ["wykorzystać", "oszukać"]);


function printElements() {
  var mapString = '';
  for(var [key, value] of entries){
    mapString += key + ": " + value + "<br />";
  }
  document.getElementById("dictionary").innerHTML = mapString;
  drawGraphs();
}


function performAction(){
  var input = document.forms[0].elements[0].value;
  var elements = input.split(" ");
  var op = elements.shift();
  if(op == "+") addToDict(elements);
  if(op == "-") removeFromDict(elements);
  if(op == "^") updateDict(elements);
}


function addToDict(words) {
  var singleWord = words[0];
  var finalWord = singleWord.slice(0, -1);
  var translations = words;
  translations.splice(0, 1);
  entries.set(finalWord, translations);
}


function removeFromDict(words) {
  entries.delete(words[0]);
}


function updateDict(words){
  var translations = words;
  translations[0] = translations[0].slice(0, -1);
  removeFromDict(translations);
  words[0] += ':';
  addToDict(words);
}


function getMapOfLengths(){
  var lengths = new Map();
  for(var [key, value] of entries){
    lengths.set(key, value.length);
  }
  return lengths;
}


function getAndRemoveMostTranslated(map){
  var maxValue = 0
  var word;
  for(var [key,value] of map){
    if(value > maxValue){
      maxValue = value;
      word = key;
    }
  }
  if(maxValue > 0){
    map.delete(word);
    return [word,maxValue];
  }
}

function getMapOfMostTranslated(map, counter){
  var mostTranslated = new Map();
  var pair;
  for(var i = 0; i < counter; i++){
    pair = getAndRemoveMostTranslated(map);
    mostTranslated.set(pair[0],pair[1]);
  }
  return mostTranslated;
}


var lengths = new Map();
lengths = getMapOfLengths();
var numberOfGraphs = 6;
var mostTranslated = getMapOfMostTranslated(lengths, numberOfGraphs);

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.font = 'bold 20px Monospace';
ctx.textBaseline = 'top';


function drawGraphs(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  var lengths = new Map();
  var scale;
  var multiplier;
  lengths = getMapOfLengths();
  var numberOfGraphs = 6;
  var mostTranslated = getMapOfMostTranslated(lengths, numberOfGraphs);
  var height = 40;
  var iterator = mostTranslated.entries();
  scale = window.innerWidth * 0.05;
  for(var i = 0; i < numberOfGraphs; i++){
    var pair = iterator.next().value;
    while(scale*pair[1] > window.innerWidth * 0.40){
      scale = scale / 1.1;
    }
    ctx.fillStyle = 'azure';
    ctx.fillRect(20, height, scale*pair[1], 30);
    ctx.fillStyle = 'pink';
    ctx.fillText(pair[0], 25, height+5);
    ctx.fillStyle = 'grey';
    ctx.fillText(pair[1], scale*pair[1] + 40, height+5);
    height+=80;
  }
}

drawGraphs();

function resize() {

	var width = window.innerWidth* 0.9;

	var ratio = (canvas.height/canvas.width);
	var height = height * width;

	canvas.style.width = width+'px';
	canvas.style.height = height+'px';
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
