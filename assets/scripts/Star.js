// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    pickRadius: 0,
  },

  getPlayerDistance() {
    let playerPos = this.game.player.getPosition();
    let dist = this.node.position.sub(playerPos).mag();

    return dist;
  },

  onPicked() {
    this.game.spawnNewStar();
    this.game.gainScore();
    this.node.destroy();
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {},

  update(dt) {
    if (this.getPlayerDistance() < this.pickRadius) {
      this.onPicked();
      return;
    }

    let opacityRatio = 1 - this.game.timer / this.game.starDuration;
    let minOpacity = 30;
    this.node.opacity =
      minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    this.node.scale = opacityRatio;
  },
});
