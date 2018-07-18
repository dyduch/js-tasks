var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var currentPlayer;
var squares = [];
var mainIntervalId;
var players = [];
var leaderboard = [null, null, null];
var counterTickTime = 1000;
var x = canvas.width/2;
var y = canvas.height/2;
var ballRadius = 10;
var ballFill = "pink";
var ballXSpeed = 0;
var ballYSpeed = 0;
var speed = 2;
var timer = 60;
var squareSize = 40;
var score = 0;
var squaresNumber = 30;
var level = 1;

class Square {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.color = "#00ff00";
    this.timer = 20;
  }
}


class Player {
  constructor(name){
    this.name = name;
  }

  setScore(){
    this.score = score;
  }

 toString(){
    return String(this.name + " " + this.score);
  }
}

document.getElementById("score").innerHTML = score;
document.getElementById("timer").innerHTML = timer;

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inRange(square){
  return (x > square.x && x < square.x + squareSize && y > square.y && y < square.y + squareSize)
}

function ballInSquare(){
  for (var i in squares){
    if(inRange(squares[i])){
      squares[i].x = getRandomInt(0, canvas.width - squareSize);
      squares[i].y = getRandomInt(0, canvas.height- squareSize);
      score += squares[i].timer;
      squares[i].timer = 20;
      squares[i].color = "#00ff00";
      document.getElementById("score").innerHTML = score;
    }
  }
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
  ctx.fillStyle=ballFill;
  ctx.fill();
  ctx.closePath();
}


function pickSquares(){
  console.log("squares number ", squaresNumber);
  squares = [];
  for(var i = 0; i < squaresNumber; i++){
    var x = getRandomInt(0, canvas.width - squareSize)
    var y = getRandomInt(0, canvas.height - squareSize)
    squares.push(new Square(x, y));
  }
}

function drawSquares(){
  for(var i = 0; i < squaresNumber; i++){
    ctx.beginPath();
    var x = squares[i].x;
    var y = squares[i].y;
    ctx.rect(x, y, squareSize, squareSize);
    ctx.fillStyle=squares[i].color;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "bold 15px Monospace"
    if(squares[i].timer >= 0) ctx.fillStyle="#000000";
    else ctx.fillStyle="#ffffff"
    ctx.fillText(squares[i].timer, x + 5,  y + 25);
    ctx.closePath;
  }
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSquares();
  drawBall();
  ballInSquare();

  x += ballXSpeed;
  y += ballYSpeed;

  if(x > canvas.width) x = 0;
  if(x < 0) x = canvas.width;
  if(y > canvas.height) y = 0;
  if(y < 0) y = canvas.height;

  requestAnimationFrame(draw);

}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function setup(){

  counterTickTime = 1000;
  x = canvas.width/2;
  y = canvas.height/2;
  ballXSpeed = 0;
  ballYSpeed = 0;
  score = 0;
  squaresNumber = 30;
  level = 1;
  var playerName = window.prompt("Please enter your name", "Dohn Joe");
  currentPlayer = new Player(playerName);

  speed = parseInt(window.prompt("Please enter ball speed\n1 - slowest, 5 - fastest", "speed"));
  while(speed < 1 || speed > 5 || isNaN(speed)){
    speed = parseInt(window.prompt("Please enter ball speed\n1 - slowest, 5 - fastest", "speed"));
  }
  var difficulty = parseInt(window.prompt("Please enter the difficulty\n1 - easiest, 3 - hardest", "difficulty"));
  while(difficulty < 1 || difficulty > 3 || isNaN(difficulty)){
    difficulty = parseInt(window.prompt("Please enter the difficulty\n1 - easiest, 3 - hardest", "difficulty"));
  }
  counterTickTime = 2000/difficulty

  squaresNumber = parseInt(window.prompt("Please enter the squares number\n(not more than 20)", "squares"));
  while(squaresNumber > 20 || isNaN(squaresNumber)){
    squaresNumber = parseInt(window.prompt("Please enter the squares number\n(not more than 20)", "squares"));
  }
  console.log("Level: " + level + "\nSpeed: " + speed + "\nTime between lowering counter: " + counterTickTime +
              "\nSquares number: " + squaresNumber);
  pickSquares();
  clearInterval(mainIntervalId);
  setUpTheMainInterval();
  window.alert("LEVEL" + level);
}

function printLeaderboard(){
  document.getElementById("first").innerHTML = leaderboard[0];
  if(leaderboard.length > 1)
    document.getElementById("second").innerHTML = leaderboard[1];
  if(leaderboard.length > 2)
    document.getElementById("third").innerHTML = leaderboard[2];
}

function endGame(){
  window.alert("GAME OVER\nYOUR SCORE: " + score);
  currentPlayer.setScore();
  if(leaderboard.length == 0) leaderboard.push(currentPlayer);
  else if(leaderboard[0] == null) leaderboard[0] = currentPlayer;
  else if (leaderboard.length > 0 && leaderboard.length <= 3) {
    var i = 0;
    while(i < leaderboard.length){
      if(leaderboard[i].score > currentPlayer.score) i++;
      else break;
    }
    switch (i) {
      case 0:
        leaderboard[2] = leaderboard[1];
        leaderboard[1] = leaderboard[0];
        leaderboard[0] = currentPlayer;
        break;
      case 1:
        leaderboard[2] = leaderboard[1];
        leaderboard[1] = currentPlayer;
        break;
      case 2:
        leaderboard[2] = currentPlayer;
        break;
      default:
        break;
    }
  }
  console.log(leaderboard);
  printLeaderboard();
  setup();
}

function nextLevel(){
  level++;
  if(level == 4) endGame();
  else{
    window.alert("LEVEL" + level);
    speed *= 2;
    squaresNumber += 4;
    pickSquares();
    counterTickTime /= 1.2;
    console.log("Level: " + level + "\nSpeed: " + speed + "\nTime between lowering counter: " + counterTickTime +
                "\nSquares number: " + squaresNumber);
    clearInterval(mainIntervalId);
    setUpTheMainInterval();
  }
}

function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;
  var relativeY = e.clientY - canvas.offsetTop;
  if(relativeX > 0 && relativeX < canvas.width){
    if(relativeX > x + 2 * ballRadius){
      ballXSpeed = (relativeX - x) / 20;
    }
    else if(relativeX < x - 2 * ballRadius){
      ballXSpeed = -Math.abs(relativeX - x) / 20;
    }
    else{
      ballXSpeed = 0;
    }
  }
  if(relativeY > 0 && relativeY < canvas.height){
    if(relativeY > y + 2 * ballRadius){
      ballYSpeed = (relativeY - y) / 20;
    }
    else if(relativeY < y - 2 * ballRadius){
      ballYSpeed = -Math.abs(relativeY - y) / 20;
    }
    else{
      ballYSpeed = 0;
    }
  }
}

function keyDownHandler(e){
  if(e.keyCode == 37){
    ballXSpeed = -speed;
  }
  else if(e.keyCode == 38){
    ballYSpeed = -speed;
  }
  else if(e.keyCode == 39){
    ballXSpeed = speed;
  }
  else if(e.keyCode == 40){
    ballYSpeed = speed;
  }
}

function keyUpHandler(e){
  if(e.keyCode == 37){
    ballXSpeed = 0;
  }
  else if(e.keyCode == 38){
    ballYSpeed = 0;
  }
  else if(e.keyCode == 39){
    ballXSpeed = 0;
  }
  else if(e.keyCode == 40){
    ballYSpeed = 0;
  }
}

function setUpTheMainInterval(){
  mainIntervalId = setInterval(function(){
              for(var i = 0; i < squaresNumber; i++){
                if(squares[i].timer == -99) timer++;
                  squares[i].timer--;
                  if(squares[i].timer < 0) squares[i].color = "#ff0000"

              }
          }, counterTickTime);
}

setup();
draw();
setUpTheMainInterval();
setInterval(function() {
    document.getElementById("timer").innerHTML = timer;
    timer--;
    if(timer == 0){
      timer = 60;
      nextLevel();
    }
}, 1000)
