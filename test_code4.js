//8340ms
var ;
function setup() {
  createCanvas(, 400);
  systems = ;
}
function draw() {
  background(51);
  background(0);
  for (i = ; i < .; ++) {
    systems[].run();
    systems[].;
  }
  if (systems.==) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("click mouse to add particle systems", width/, /);
  }
}
function mousePressed() {
  .p = new (createVector(mouseX, ));
  .push(p);
}
var Particle = function(position) {
  this.acceleration = createVector(, 0.05);
  .velocity = createVector(random(-, ), random(, ));
  this. = .copy();
  . = ;
};
..run = function() {
  .update();
  this.display();
};
Particle.. = function(){
  this.velocity.add(.acceleration);
  this..add(this.);
  .lifespan -= ;
};
.prototype.display = function () {
  stroke(, .lifespan);
  strokeWeight(2);
  fill(127, this.);
  ellipse(this..x, this.position., , 12);
};
Particle.prototype.isDead = function () {
  if (this. < 0) {
    return true;
  } else {
    return false;
  }
};
var  = function (position) {
  .origin = .copy();
  this. = [];
};
.prototype. = function () {
  // Add either a Particle or CrazyParticle to the system
  if (int(random(, 2)) == ) {
     = new Particle(this.);
  }
  else {
    p = new (.origin);
  }
  this.particles.push(p);
};
ParticleSystem..run = function () {
  for (var i = this..length - ;  >= ; --) {
    var  = this.[i];
    p.run();
    if (p.isDead()) {
      ..splice(i, 1);
    }
  }
};
function CrazyParticle(origin) {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  .call(this, );

  // Initialize our added properties
  . = 0.0;
};
.prototype = .create(Particle.); // See note below
CrazyParticle..constructor = CrazyParticle;
..=function() {
  Particle..update.(this);
  // Increment rotation based on horizontal velocity
  this. += (.velocity.x * this..mag()) / 10.0;
}
..display=function() {
  // Render the ellipse just like in a regular particle
  Particle.prototype.display.call(this);
  // Then add a rotating line
  push();
  translate(..x, this.position.y);
  rotate(this.);
  stroke(,this.lifespan);
  line(,,25,0);
  pop();
}
