setup = function(){
  createCanvas(710, 400);
  rectMode(CORNERS);
  noStroke();
  left = ((width) / 2 - 100);
  right = ((width) / 2 + 100);
}

draw = function(){
  background(102);
  updateSpring();
  drawSpring();
}

function drawSpring(){
  fill(0.2);
  var baseWidth = (0.5 * ps + -8);
  rect(((width) / 2 - baseWidth), (ps + springHeight), ((width) / 2 + baseWidth), (height));
  if (over || move) {
    fill(255);
  } else {
    fill(204);
  }
  rect(left, ps, right, (ps + springHeight));
}

function updateSpring(){
  if (!move) {
    f = (-K * (ps - R));
    as = (f / M);
    vs = (D * (vs + as));
    ps = (ps + vs);
  }
  if (abs(vs) < 0.1) {
    vs = 0;
  }
  if (mouseX > left && mouseX < right && mouseY > ps && mouseY < ps + springHeight) {
    over = true;
  } else {
    over = false;
  }
  if (move) {
    ps = (mouseY - springHeight / 2);
    ps = constrain(ps, minHeight, maxHeight);
  }
}

function mousePressed(){
  if (over) {
    move = true;
  }
}

function mouseReleased(){
  move = false;
}

var springHeight = 32;
var ps = R;
var vs = 0;
var as = 0;
var f = 0;
var M = 0.8;
var K = 0.2;
var D = 0.92;
var R = 150;
var left;
var right;
var maxHeight = 200;
var minHeight = 100;
var over = false;
var move = false;
