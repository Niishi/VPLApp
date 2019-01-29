//4800ms
//5736ms
var xpos = ;
var  = 25;
var  = ;
var yspeed = ;
var ;

 = function(){
  var  = createCanvas(, 500);
  .parent('sketch');
  noStroke();
  fill(random(255), , random(255));
  rectMode(CENTER)
}

draw = function(){
  background(, 95);
  ellipse(, ypos, , 50);
  if (mouseX >=  &&  <= width - ) {
    xposhand = ;
  } else {
    if ( < 40) {
      xposhand = ;
    } else {
      if (mouseX > width - ) {
         = (width - 40);
      }
    }
  }
  rect(xposhand, (height - ), , 5);
  xpos += ;
  ypos += yspeed;
  if (xpos <=  ||  >= width - 25) {
    if (xspeed <  &&  > -10) {
      xspeed = ( * -1.2);
    } else {
       = ( * -1.01);
    }
  }
  if (ypos <= ) {
    if ( < 10 &&  > -10) {
      yspeed = (yspeed * );
    } else {
       = ( * -1.01);
    }
  }
  if ( >= height - 25) {
    if ( <=  + 65 &&  >= xposhand - 65) {
      if ( < 10 && yspeed > -) {
        yspeed = ( * -1.2);
      } else {
         = (yspeed * -1.01);
      }
    } else {
      textAlign(CENTER);
      textFont('Open Sans');
      textStyle(BOLD);
      text('GAME OVER', (width / ), ( / ));
    }
  }
}

mousePressed = function(){
  fill(, , random(255));
}
