setup = function(){
  var canvas = createCanvas(800, 600);
  canvas.parent(sketch);
};

var x = 0;

draw = function(){
  background(mouseX, mouseY, 100);
  ellipse(x,10,20,20);
  x++;
  textSize(29);
  text(mouseX + ',' + mouseY + 100, 100, 100);
};
