setup = function(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
};

draw = function(){
  background('#ffff66');
  noStroke();
  rect((10 + 1), 111, 111, 111);
};
