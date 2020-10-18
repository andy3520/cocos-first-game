// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    jumpHeight: 0,
    jumpDuration: 0,
    maxMoveSpeed: 0,
    accel: 0,

    jumpAudio: {
      default: null,
      type: cc.AudioClip,
    },
  },

  setJumpAction: function () {
    let jumpUp = cc
      .moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight))
      .easing(cc.easeCubicActionOut());
    let jumpDown = cc
      .moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight))
      .easing(cc.easeCubicActionIn());

    let audioCallback = cc.callFunc(this.playJumpSound, this);

    return cc.repeatForever(cc.sequence(jumpUp, jumpDown, audioCallback));
  },

  playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true;
        break;
      default:
        break;
    }
  },

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false;
        break;
      default:
        break;
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.jumpAction = this.setJumpAction();
    this.node.runAction(this.jumpAction);

    this.accLeft = false;
    this.accRight = false;

    this.xSpeed = 0;
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  },

  start() {},

  update(dt) {
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    }

    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
    }

    this.node.x += this.xSpeed * dt;
  },
});
