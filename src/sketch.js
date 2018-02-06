var y, _E9_A0_85_E7_9B_AE, item, _E9_A0_85_E7_9B_AE2, i;


y = 100;

y++;

setup = function(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
};

i++;

i < 10;

background(0);

i = 0;

for (i = 0; i <= 0; i++) {
}

draw = function(){
  frameRate(60);
  background(0);
  stroke(255);
  y = y - 1;
  if (y < 0) {
    y = (height);
  }
  line(0, y, (width), y);
};
