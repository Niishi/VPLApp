var y;


y = 100;

setup = function(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
};

draw = function(){
  frameRate(30);
  background(0);
  stroke(255);
  y = y - 0.01;
  if (y < 0) {
    y = (height);
  }
  line(0, y, (width), y);
};
