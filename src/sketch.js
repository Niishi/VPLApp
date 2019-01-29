var x = -100;

setup = function(){
  var canvas = createCanvas(800, 600);
  canvas.parent(sketch);
};

draw = function(){
  background(100);
  rect(100, 100, 300, 200);
  if (x < 0) {






                            x = x * -1 ;}
  textSize(50);
  text(0 + x, 200, 200);
};
