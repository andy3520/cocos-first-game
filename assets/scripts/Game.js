// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    starPrefab: {
      default: null,
      type: cc.Prefab,
    },
    maxStarDuration: 0,
    minStartDuration: 0,

    ground: {
      default: null,
      type: cc.Node,
    },

    player: {
      default: null,
      type: cc.Node,
    },

    scoreDisplay: {
      default: null,
      type: cc.Label,
    },

    scoreAudio: {
      default: null,
      type: cc.AudioClip,
    },
  },

  spawnNewStar() {
    let newStar = cc.instantiate(this.starPrefab);
    this.node.addChild(newStar);
    newStar.setPosition(this.getNewStarPosition());
    newStar.getComponent("Star").game = this;

    this.starDuration =
      this.minStartDuration +
      Math.random() * (this.maxStarDuration - this.minStartDuration);
    this.timer = 0;
  },

  getNewStarPosition() {
    let randX = 0;
    let randY =
      this.groundY +
      Math.random() * this.player.getComponent("Player").jumpHeight +
      50;

    let maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;

    return cc.v2(randX, randY);
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.groundY = this.ground.y + this.ground.height / 2;
    this.player.getComponent("Player").game = this;
    this.timer = 0;
    this.starDuration = 0;
    this.score = 0;

    this.spawnNewStar();
  },

  start() {
    document.getElementById("GameCanvas").focus();
  },

  gainScore() {
    this.score += 1;
    this.scoreDisplay.string = "Score: " + this.score;

    cc.audioEngine.playEffect(this.scoreAudio, false);
  },

  update(dt) {
    if (this.timer > this.starDuration) {
      this.gameOver();
      return;
    }

    this.timer += dt;
  },

  gameOver() {
    this.player.stopAllActions();
    cc.director.loadScene("Game");
  },
});
