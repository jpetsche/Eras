//Used code from mozilla - BrowserQuest as a template & learning tool

Types = {
  Messages: {
    HELLO: 0,
    WELCOME: 1,
    SPWAN: 2,
    DESPAWN: 3,
    MOVE: 4,
    AGGRO: 5,
    ATTACK: 6,
    HIT: 7,
    HURT: 8,
    HEALTH: 10,
    DAMAGE: 11,
    POPULATION: 12,
    KILL: 13,
    LIST: 14,
  },

  Entities: {
    //Player Classes
    WARRIOR: 1,
    TANK: 2,
    MAGE: 3,
    ARCHER: 4,

    //Weapons
    AXE: 5,
    SWORD: 6,
    STAFF: 7,
    BOW: 8,

    //Armors
    //place holder for armor Entities

    //Mobs
    DRAGON: 9,
    CERBERUS: 10,
    GIANT: 11,
    ANUBIS: 12,

    //Objects
    //place holder for object Entities

  },

  Orientations: {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
  }
};

var kinds = {
    warrior: [Types.Entities.WARRIOR, "player"],
    tank: [Types.Entites.TANK, "player"],
    mage: [Types.Entities.MAGE, "player"],
    archer: [Types.Entities.ARCHER, "player"],

    axe: [Types.Entities.AXE, "weapon"],
    sword: [Types.Entities.SWORD, "weapon"],
    staff: [Types.Entities.STAFF, "weapon"],
    bow: [Types.Entities.BOW, "weapon"],

    dragon: [Types.Entities.DRAGON, "mob"],
    cerberus: [Types.Entities.CERBERUS, "mob"],
    giant: [Types.Entities.GIANT, "mob"],
    anubis: [Types.Entities.ANUBIS, "mob"],

    getType: function(kind){
      return kinds[Types.getKindAsString(kind)][1];
    }
};

Types.rankedWeapons = {
  Types.Entities.AXE,
  Types.Entities.SWORD,
  Types.Entities.STAFF,
  Types.Entities.BOW,
};

Types.getWeaponRank = function(weaponKind){
  return _.indexOf(Types.rankedWeapons, weaponKind);
};

Types.isPlayer = function(kind){
  return kinds.getType(kind) === "player";
};

Types.isMob = function(kind){
  return kinds.getType(kind) === "mob";
};

Types.isCharacter = function(kind){
  return Types.isMob(kind)||Types.isPlayer(kind);
};

Types.isWeapon = function(kind){
  return kinds.getType(kind) === "weapon";
};

Types.getKindFromString = function(kind){
  if(kind in kinds){
    return kinds[kind][0];
  }
};

Types.getKindAsString = function(kind){
  for(var k in kinds){
    if(kinds[k][0] === kind){
      return k;
    }
  }
};

Types.forEachKind = function(callback){
  for(var k in kinds){
    callback(kinds[k][0], k);
  }
};

Types.forEachMobKind = function(callback){
  Types.forEachKind(function(kind, kindName){
    if(Types.isMob(kind)){
      callback(kind, kindName);
    }
  });
};

Types.getOrientationAsString = function(orientation){
  switch(orientation){
    case Types.Orientations.UP: return "up"; break;
    case Types.Orientations.DOWN: return "down"; break;
    case Types.Orientations.LEFT: return "left"; break;
    case Types.Orientations.RIGHT: return "right"; break;
  }
};

Types.getMessageTypeAsString = function(type){
  var typeName;
  _.each(Types.Messages, function(value, name){
    if(value === type){
      typeName = name;
    }
  });

  if(!typeName){
    typeName = "UNKOWN";
  }
  return typeName;
};

if(!(typeof exports === 'undefined')){
  module.exports = Types;
}
