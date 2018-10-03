setup = function(){
  var canvas = createCanvas(800, 600);
  canvas.parent('sketch');
};

draw = function(){
  background(200, 250, 220);
  fill('#ffffff');
  for (var i = 0; i < 10; i++ ) {
    rect(100, 100, 300, 200);
  }
  fill('#ff0000');
  for (var i = 0; i < 10; i++ ) {
    ellipse(100,200,120,120);
  }
  if (x == 0) {
  }
};
