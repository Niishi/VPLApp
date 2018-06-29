setup = function(){
  const canvas = createCanvas(800, 550);
  canvas.parent('sketch');
}

draw = function(){
  background('#ffffff');
  noStroke();
  const n = 5;
  const gradation = 255 / n;
  const d = 30;
  const f = 30;
  const g = d + f;
  for (var i = 0; i < n; i++ ) {
    for (var j = 0; j < n; j++ ) {
      fill(255, i * gradation, j * gradation);
      rect(30 + i * g, 30 + j * g, d, d);
    }
  }
}
