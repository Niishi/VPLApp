var xpos = 255;
var ypos = 25;
var xspeed = 4;
var yspeed = 4;
var xposhand;

setup = function(){
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch');
  noStroke();
  fill(random(255), random(255), random(255));
  rectMode(CENTER);
}

draw = function(){
  background(100, 95);
  ellipse(xpos, ypos, 50, 50);
  if (mouseX >= 40 && mouseX <= width - 40) {
    xposhand = mouseX;
  } else {
    if (mouseX < 40) {
      xposhand = 40;
    } else {
      if (mouseX > width - 40) {
        xposhand = (width - 40);
      }
    }
  }
  rect(xposhand, (height - 2.5), 80, 5);
  xpos += xspeed;
  ypos += yspeed;
  if (xpos <= 25 || xpos >= width - 25) {
    if (xspeed < 10 && xspeed > -10) {
      xspeed = (xspeed * -1.2);
    } else {
      xspeed = (xspeed * -1.01);
    }
  }
  if (ypos <= 25) {
    if (yspeed < 10 && yspeed > -10) {
      yspeed = (yspeed * -1.2);
    } else {
      yspeed = (yspeed * -1.01);
    }
  }
  if (ypos >= height - 25) {
    if (xpos <= xposhand + 65 && xpos >= xposhand - 65) {
      if (yspeed < 10 && yspeed > -10) {
        yspeed = (yspeed * -1.2);
      } else {
        yspeed = (yspeed * -1.01);
      }
    } else {
      textAlign(CENTER);
      textFont('Open Sans');
      textStyle(BOLD);
      text('GAME OVER', (width / 2), (height / 2));
    }
  }
}

mousePressed = function(){
  fill(random(255), random(255), random(255));
}
