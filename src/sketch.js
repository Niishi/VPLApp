var a, angle, _E9_A0_85_E7_9B_AE, TWO_PI, npoints, item, sx, x, radius, sy, y, CLOSE;


function setup(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
}

function draw(){
  background(102);
  push();
  translate(((width) * 0.2), ((height) * 0.5));
  rotate(((frameCount) / 200));
  polygon(0, 0, 82, 3);
  pop();
  push();
  translate(((width) * 0.5), ((height) * 0.5));
  rotate(((frameCount) / 50));
  polygon(0, 0, 80, 20);
  pop();
  push();
  translate(((width) * 0.8), ((height) * 0.5));
  rotate(((frameCount) / -100));
  polygon(0, 0, 70, 7);
  pop();
}

function polygon(x, y, radius, npoints){
  angle = TWO_PI / npoints;
  beginShape();
  for ( (a = 0); (a < TWO_PI); (a = angle) ) {
    sx = x + (cos(a)) * radius;
    sy = y + (sin(a)) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
