setup = function(){
  const canvas = createCanvas(900, 550);
  canvas.parent('sketch');
}

var x = 0;

draw = function(){
  background(255);
  noStroke();
  fill('#99ff99');
  rect(x, 100, x, x);
  x = x + 5;
  if (x > width) {
    x = 0;
  }
}

x;
