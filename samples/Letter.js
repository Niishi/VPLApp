var fontsize = 32;

setup = function(){
  var canvas = createCanvas(710, 400);
  canvas.parent('sketch');
  textSize(fontsize);
  textAlign(CENTER, CENTER);
};

var typedLetter = '';

draw = function(){
  background(160);
  var gap = 52;
  var margin = 10;
  translate(margin * 4, margin * 4);
  var counter = 35;
  for ( y = 0; y < height - gap; y += gap ) {
    for ( x = 0; x < width - gap; x += gap ) {
      var letter = char(counter);
      if (letter == typedLetter) {
        fill('#ed225d');
      } else {
        fill(255);
      }
      text(letter, x, y);
      counter++;
    }
  }
};

keyTyped = function( ){
  typedLetter = key;
};
