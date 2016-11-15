//Player class
//@author Alec lucas

module.exports = function(id, startX, startY, maxHealth, dir){
  this.id = id;
  this.startX = startX;
  this.startY = startY;
  this.x = startX;
  this.y = startY;
  this.maxHealth = maxHealth;
  this.health = maxHealth;
  this.direction = dir;

  this.getid: function(){
  return this.id;
  };

  this.getX: function(){
  return this.x;
  };

  this.getY: function(){
  return this.y;
  };

  this.getHealth: function(){
  return this.health;
  };

  this.getDirection: function(){
  return this.direction;
  };

  this.respawn: function(){
  this.x = this.startX;
  this.y = this.startY;
  this.health = this.maxHealth;
  };

  this.regenHealth: function(){

  };
};
