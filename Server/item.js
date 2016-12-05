// @author Alec Lucas

//require main file objects
var server = require('./server.js');
var col = require('./collision.js');

function item(type, xPos, yPos, size, dur, held){
  this.type = type;
  this.x = xPos;
  this.y = yPos;
  this.width = size;
  this.height = size;
  this.durability = dur;
  this.held = held;
}

module.exports = {
  spawnItems:
    function spawnItems(itemObj){
      var amount = 11;
      for(var i = 1; i <= amount; i++){

        var type = Math.floor((Math.random() * 5) + 1);
        var held = 0;
        var size;
        var dur;
        var xPos;
        var yPos;

        if(type == 1){
          type = "speed";
          size = 20;
          dur = 1;
        }

        else if(type == 2){
          type = "healing";
          size = 20;
          dur = 1;
        }

        else if(type == 3){
          type = "atkSpeed";
          size = 20;
          dur = 1;
        }

        else if (type == 4){
          type = "atkStrength";
          size = 20;
          dur = 1;
        }

        else{
          type = "armor";
          size = 20;
          dur = 3;
        }

        xPos = Math.floor((Math.random() * 700) + 50);
        yPos = Math.floor((Math.random() * 500) + 50);

        var newItem = new item(type, xPos, yPos, size, dur, held);
        itemObj[i] = newItem;
      }
    }
  }

  // this.getType: function(){
  //   return this.id;
  // };
  //
  // this.getX: function(){
  //   return this.x;
  // };
  //
  // this.getY: function(){
  //   return this.y;
  // };
  //
  // this.getSize: function(){
  //   return this.size;
  // };
  //
  // this.getDur: function(){
  //   return this.durability;
  // };
  //
  // this.setX: function(newX){
  //   this.x = newX;
  // };
  //
  // this.setY: function(newY){
  //   this.y = newY;
  // };
  //
  // this.setDur: function(newDur){
  //   this.durability = newDur;
  // };
  //
  // this.subDur: function(){
  //   if(this.durability > 0){
  //   this.durability = this.durability - 1;
  //   }
  // };
  //
  // this.addDur: function(val){
  //   if((this.durability + val) > this.maxDur){
  //     this.durability = this.maxDur;
  //   }
  //   else{
  //     this.durability = this.durability + val;
  //   }
  // };
