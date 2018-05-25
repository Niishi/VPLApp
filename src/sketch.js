var system;

setup = function(){
  createCanvas(720, 400);
  system = (new ParticleSystem(createVector(((width) / 2), 50)));
}

draw = function(){
  background(51);
  system.addParticle();
  system.run();
}

var Particle = function( position){
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
};
Particle.prototype.run = function( ){
  this.update();
  this.display();
};
Particle.prototype.update = function( ){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};
Particle.prototype.display = function( ){
  stroke(200, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};
Particle.prototype.isDead = function( ){
  return (this.lifespan < 0);
};
var ParticleSystem = function( position){
  this.origin = position.copy();
  this.particles = [];
};
ParticleSystem.prototype.addParticle = function( ){
  this.particles.push((new Particle(this.origin)));
};
ParticleSystem.prototype.run = function( ){
  for (var i = (this.particles.length - 1); (i >= 0); (i--) ) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};
