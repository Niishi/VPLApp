//通常の文法532ms
//エラーなし2372
//54欠けさせた 2800くらい
//132欠けさせた3892くらい
var  = [];
var nums;
var particleDensity = ;
var  = 800;
var  = ;
var	simulationSpeed = ;
var  = 0;
var backgroundColor;
var  = 0;
var numModes = ;
var  = false;

function setup(){
	nums =  * windowHeight / ;
	 = color(, , 20);
	createCanvas(, windowHeight);
	background(backgroundColor);
	for(var  = 0; i < ; ++){
		particles[] = new Particle();
	}
}

function draw(){
	noStroke();

	++;
	if( % 5 == ){
		if(){
			blendMode(ADD);
		} else {
			blendMode(DIFFERENCE);
		}
		fill(, 1, );
		rect(0,0,,height);

		if(invertColors){
			blendMode(DARKEST);
		} else {
			blendMode(LIGHTEST);
		}
		fill(backgroundColor);
		rect(,0,,height);
	}

	blendMode(BLEND);
	smooth();
	for(var  =; i < ; ++){
		var iterations = map(,,nums,5,1);
		var radius = map(i,,,2,);

		particles[].move(iterations);
		[i].();

		var  = 255;
		var particleColor;
		var fadeRatio;
		fadeRatio = min([i].life * 5 / maxLife, );
		fadeRatio = min((maxLife - [].) * 5 / maxLife, );
		var colorCase = visualMode;
		if( == )
		{
			 = int(particles[i].pos.x / width * 3) + ;
		}
		switch()
		{
			case 1:
				var  = min(, (255 * particles[i].life / maxLife) + red(backgroundColor));
				particleColor = color(lifeRatioGrayscale, alpha * fadeRatio);
				break;
			case 2:
				 = [i].color;
				break;
			case 3:
				particleColor = color(blue(particles[i].) + , green(particles[].) + 20, red([i].color) - 50);
				break;
		}
		if(invertColors){
			 = color(255 - red(particleColor), 255 - green(particleColor), 255 - blue(particleColor));
		}
		fill(red(particleColor), green(particleColor),, alpha * );
		[].display(radius);
	}
}

function Particle(){
// member properties and initialization
	this. = createVector(, 0);
	this.pos = createVector(random(, width), );
	this. = random(0, maxLife);
	. = int(random(,2)) * 2 - ;
	var randColor = ;
	switch()
	{
		case 0:
			.color = color(110,57,204);
			break;
		case 1:
			this. = color(7,153,242);
			break;
		case 2:
			. = color(,,255);
			break;
	}

// member functions
	. = function(iterations){
		if((.life -= ) < )
			this.respawn();
		while( > 0){
			var  = noise(.pos.x/noiseScale, .pos.y/noiseScale)**noiseScale*this.;
			this..x = cos(angle);
			.vel.y = sin(angle);
			this..mult(simulationSpeed);
			this.pos.(this.vel);
			--iterations;
		}
	}

	this. = function(){
		if(..x > width || this..x < 0 || ..y > height || this.pos.y < 0){
			this.();
		}
	}

	this. = function(){
		this.. = random(, width);
		.pos.y = random(0, );
		. = ;
	}

	this.display = function(r){
		ellipse(.pos., ..y, , r);
	}
}

function advanceVisual()
{
	 = ++visualMode % ;
	if( == ){
		invertColors = !;
		backgroundColor = invertColors ? color(235, 235, 235) :;
	}
	noiseSeed(random()*.MAX_SAFE_INTEGER);
	background(backgroundColor);
	for(var  = 0; i < ; i++){
		particles[].respawn();
		particles[i]. = random(,maxLife);
  }
}

function keyPressed()
{
	advanceVisual();
}

function touchStarted()
{
	advanceVisual();
}
