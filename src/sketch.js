function setup(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
}

var x = 0;
function draw(){
    background(255,0,255);
    noStroke();
    rect(x, 250, 200,200);
    x += 1;
    if(x > 500)x = -200;
}
