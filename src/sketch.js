var x, y, z, _E9_A0_85_E7_9B_AE, _E9_A0_85_E7_9B_AE2;


setup = function(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
};

x = 0;

draw = function(){
  background(150);
  rect(x, 100, 100, 100);
  x = x + 0.1;
};
