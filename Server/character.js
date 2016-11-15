//Character class modeled after BrowserQuest
//Used to see how they made it modular
//Character class is for players and NPCs
var cls = require("./lib/class"),
    Messages = require("./message"),
    Utils = require("./utils"),
    Types = require("../../shared/gametypes");

    module.exports = Character = Entity.extend({
    init: function(id, type, kind, x, y) {
        this._super(id, type, kind, x, y);

        this.orientation = Utils.randomOrientation();
        this.enemies = {};
        this.target = null;
    },

    getState: function() {
        var basestate = this._getBaseState(),
            state = [];

        state.push(this.orientation);
        if(this.target) {
            state.push(this.target);
        }

        return basestate.concat(state);
    },

    resetHealth: function(maxHealth) {
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
    },

    regenHealthBy: function(value) {
        var hp = this.health,
            max = this.maxHealth;

        if(hp < max) {
            if(hp + value <= max) {
                this.health += value;
            }
            else {
                this.health = max;
            }
        }
    },

    hasFullHealth: function() {
        return this.health === this.maxHealth;
    },

    setTarget: function(entity) {
        this.target = entity.id;
    },

    clearTarget: function() {
        this.target = null;
    },

    hasTarget: function() {
        return this.target !== null;
    },

    attack: function() {
        return new Messages.Attack(this.id, this.target);
    },

    health: function() {
        return new Messages.Health(this.health, false);
    },

    regen: function() {
        return new Messages.Health(this.health, true);
    },

    addEnemy: function(entity) {
        if(entity) {
            this.enemies[entity.id] = entity;
        }
    },

    removeEnemy: function(entity) {
        if(entity && entity.id in this.enemies) {
            delete this.enemies[entity.id];
            log.debug(this.id +" REMOVED ENEMY "+ entity.id);
        }
    },

    forEachEnemy: function(callback) {
        for(var id in this.enemies) {
            callback(this.enemies[id]);
        }
    }
});
