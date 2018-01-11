var x, y, z;


x = 0;

setup = function(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
};

draw = function(){
  background(150);
  rect(x, 100, 100, 100);
  x = x + 0.1;
};
