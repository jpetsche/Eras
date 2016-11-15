// @author Alec Lucas

module.exports = function(id, xPos, yPos, size, dur){
  this.type = id;
  this.x = xPos;
  this.y = yPos;
  this.size = size;
  this.maxDur = dur;
  this.durability = dur;

  this.getType: function(){
    return this.id;
  };

  this.getX: function(){
    return this.x;
  };

  this.getY: function(){
    return this.y;
  };

  this.getSize: function(){
    return this.size;
  };

  this.getDur: function(){
    return this.durability;
  };

  this.setX: function(newX){
    this.x = newX;
  };

  this.setY: function(newY){
    this.y = newY;
  };

  this.setDur: function(newDur){
    this.durability = newDur;
  };

  this.subDur: function(){
    if(this.durability > 0){
    this.durability = this.durability - 1;
    }
  };
  
  this.addDur: function(val){
    if((this.durability + val) > this.maxDur){
      this.durability = this.maxDur;
    }
    else{
      this.durability = this.durability + val;
    }
  };

};
