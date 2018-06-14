setup = function(){
  var canvas = createCanvas(800, 450);
  canvas.parent('sketch');
}

var x = 10;
var y = 10;

draw = function(){
  background(255);
  rect(x, y, 100, 100);
  if (keyIsDown(LEFT_ARROW)) {
    x -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    x += 5;
  }
  if (keyIsDown(UP_ARROW)) {
    y -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    y += 5;
  }
}
