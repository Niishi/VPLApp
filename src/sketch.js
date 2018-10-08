var x = 100;

setup = function(){
  var canvas = createCanvas(700, 300);
  canvas.parent('sketch');
};

boxes = [];

draw = function(){
  background(100);
  fill('#ff9966');
  rect(mouseX, mouseY, 100, 100);
  for(box of boxes){
  }
};
