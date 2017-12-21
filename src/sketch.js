function setup(){
    var canvas = createCanvas(500,500);
    canvas.parent('sketch');
}

function draw(){
    background("#cccccc");
    for(var count = 0; count < 10; count++){
        rect(100,100,300,200);
    }
}
