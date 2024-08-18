/**
 * 各カード情報を管理する
 */
class Card extends Phaser.GameObjects.GameObject {

  /**
   * 
   * @param {scene, info} param 
   */
  constructor(param) {
    super(param.scene);

    // jsonから取得したカードオブジェクト
    this.info = param.info;
    this.isGrab = false;
    this.defaultX = 0;
    this.defaultY = 0;
    this.defaultScale = 0.8;
    this.nowTween = null;

    this.createCard(param.x, param.y, param.info);
  }

  destroy() {
    this.sprite.destroy();
    this.icon.destroy();
    this.customText.destroy();
    this.costIcon.destroy();
    super.destroy();
  }


  getPercentY(percent, y, scale) {
    if (scale === undefined) { scale = this.sprite.scaleY; }
    if (y === undefined) { y = this.sprite.y; }
    let up = y - this.sprite.height * scale / 2;
    return up + this.sprite.height * scale * percent;
  }
  getPercentX(percent, x, scale) {
    if (scale === undefined) { scale = this.sprite.scaleX; }
    if (x === undefined) { x = this.sprite.x; }
    let left = x - this.sprite.width * scale / 2;
    return left + this.sprite.width * scale * percent;
  }

  createCard(x, y, info) {
    this.sprite = this.scene.add.sprite(x, y, "card_background", info.rare);
    this.icon = this.scene.add.sprite(x, y, "card_icon", info.id);
    this.customText = new CustomText({
      scene: this.scene,
      x: x,
      y: y + 80,
      text: info.text,
      bold: true,
      fontSize: 16,
      fill: "#000000"
    })
    this.costIcon = this.scene.add.sprite(x, y, "card_cost", info.cost);

    this.sprite.setInteractive();
    this.sprite.depth = 2;
    this.sprite.setScale(this.defaultScale);

    this.icon.depth = 2;
    this.icon.setScale(this.defaultScale);

    this.customText.text.depth = 2;
    this.customText.text.setScale(this.defaultScale);

    this.costIcon.depth = 2;
    this.costIcon.setScale(this.defaultScale);
    this.costIconPercentX = 0.5;
    this.costIconPercentY = 0.02;

  }

  setAlpha(alpha) {
    this.sprite.alpha = alpha;
    this.icon.alpha = alpha;
    this.customText.text.alpha = alpha;
    this.costIcon.alpha = alpha;
  }
  setDepth(depth) {
    this.sprite.depth = depth;
    this.icon.depth = depth;
    this.customText.text.depth = depth;
    this.costIcon.depth = depth;
  }
  setScale(scale) {
    this.sprite.setScale(scale);
    this.setPos(this.sprite.x, this.sprite.y);
  }
  disable() {
    this.sprite.visible = false;
    this.icon.visible = false;
    this.customText.text.visible = false;
    this.costIcon.visible = false;
  }
  enable() {
    this.sprite.visible = true;
    this.sprite.setScale(this.defaultScale);
    this.icon.visible = true;
    this.icon.setScale(this.defaultScale);
    this.customText.text.visible = true;
    this.customText.text.setScale(this.defaultScale);
    this.costIcon.visible = true;
    this.costIcon.setScale(this.defaultScale);
    this.setPos(this.sprite.x, this.sprite.y);
    this.sprite.on("pointerover", this.pointerOver, this);
    this.sprite.on("pointerout", this.pointerOut, this);
    this.sprite.on("pointerdown", this.pointerDown, this);
  }

  setDefaultPos(x, y) {
    this.defaultX = x;
    this.defaultY = y;
  }
  setPos(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;

    this.icon.x = this.getPercentX(0.5, x, this.sprite.scaleX);
    this.icon.y = this.getPercentY(0.25, y, this.sprite.scaleY);
    this.icon.setScale(this.sprite.scaleX);

    this.customText.setPositionX(this.getPercentX(0.5, x, this.sprite.scaleX));
    this.customText.setPositionY(this.getPercentY(0.7, y, this.sprite.scaleY));
    this.customText.text.setScale(this.sprite.scaleX);

    this.costIcon.x = this.getPercentX(this.costIconPercentX, x, this.sprite.scaleX);
    this.costIcon.y = this.getPercentY(this.costIconPercentY, y, this.sprite.scaleY);
    this.costIcon.setScale(this.sprite.scaleX);
  }
  /**
   *
   * @param {*} x
   * @param {*} y
   * @memberof Card
   */
  getAngleCenter(x, y) {
    let rad = Math.atan2(x - game.config.width / 2, y - game.config.height / 2);
    let deg = rad * 180 / Math.PI;
    // return 0;
    return deg / 16; // 微調整
  }

  stopTween() {
    if (this.nowTween == null) { return; }
    this.nowTween.stop();
  }

  pointerDown(pointer) {
    this.stopTween();
    this.sprite.off("pointerover");
    this.sprite.off("pointerout");
    console.log("grab");
    this.isGrab = true;

    this.sprite.setScale(0.5);
    this.sprite.x = pointer.x;
    this.sprite.y = pointer.y;

    this.icon.setScale(0.5);
    this.icon.x = this.getPercentX(0.5, pointer.x, 0.5);
    this.icon.y = this.getPercentY(0.25, pointer.y, 0.5);
    // this.icon.x = pointer.x - 50;
    // this.icon.y = pointer.y;

    this.customText.text.setScale(0.5);
    this.customText.text.x = this.getPercentX(0.5, pointer.x, 0.5);
    this.customText.text.y = this.getPercentY(0.7, pointer.y, 0.5);

    this.costIcon.setScale(0.5);
    this.costIcon.x = this.getPercentX(this.costIconPercentX, pointer.x, 0.5);
    this.costIcon.y = this.getPercentY(this.costIconPercentY, pointer.y, 0.5);
    // this.text.setScale(0.5);
    // this.text.x = pointer.x - 50;
    // this.text.y = pointer.y;
    this.scene.oneGrab = true;

    if (this.info.type == 1) {
      let player = this.scene.player;
      player.target.visible(player.sprite.x, player.sprite.y);
    } else if (this.info.type === 0) {
      this.scene.enemyGroup.children.iterate((child) => {
        child.target.visible(child.sprite.x, child.sprite.y);
      })
    }
  }
  pointerOut() {
    if (this.scene.oneGrab) { return; }

    this.sprite.depth = 1;
    this.nowTween = this.scene.tweens.add({
      targets: [this.sprite],
      scaleX: this.defaultScale,
      scaleY: this.defaultScale,
      y: this.defaultY,
      duration: gameOptions.tweenSpeed,
    });

    this.icon.depth = 1;
    let iconY = this.getPercentY(0.25, this.defaultY, this.defaultScale);
    this.scene.tweens.add({
      targets: [this.icon],
      scaleX: this.defaultScale,
      scaleY: this.defaultScale,
      // y: this.defaultY - 60,
      y: iconY,
      duration: gameOptions.tweenSpeed,
    });

    
    this.customText.text.depth = 1;
    let textY = this.customText.getCalcPositionY(this.getPercentY(0.7, this.defaultY, this.defaultScale));
    this.scene.tweens.add({
      targets: [this.customText.text],
      scaleX: this.defaultScale,
      scaleY: this.defaultScale,
      // y: this.defaultY + 60,
      y: textY,
      duration: gameOptions.tweenSpeed,
    });

    this.costIcon.depth = 1;
    let costY= this.getPercentY(this.costIconPercentY, this.defaultY, this.defaultScale);
    this.scene.tweens.add({
      targets: [this.costIcon],
      scaleX: this.defaultScale,
      scaleY: this.defaultScale,
      // y: this.defaultY + 60,
      y: costY,
      duration: gameOptions.tweenSpeed,
    });
  }
  pointerOver() {
    if (this.scene.oneGrab) { return; }
    this.sprite.depth = 3;
    this.nowTween = this.scene.tweens.add({
      targets: [this.sprite],
      scaleX: 1.0,
      scaleY: 1.0,
      y: this.sprite.y - 80,
      duration: gameOptions.tweenSpeed,
      onComplete: () => { },
    });

    let iconY = this.getPercentY(0.25, this.sprite.y - 80, 1.0);
    this.icon.depth = 3;
    this.scene.tweens.add({
      targets: [this.icon],
      scaleX: 1.0,
      scaleY: 1.0,
      // y: this.icon.y - 80,
      y: iconY,
      duration: gameOptions.tweenSpeed,
    });

    let textY = this.getPercentY(0.7, this.sprite.y - 80, 1.0);
    this.customText.text.depth = 3;
    this.scene.tweens.add({
      targets: [this.customText.text],
      scaleX: 1.0,
      scaleY: 1.0,
      y: textY,
      duration: gameOptions.tweenSpeed,
    });

    let costY = this.getPercentY(this.costIconPercentY, this.sprite.y - 80, 1.0);
    this.costIcon.depth = 3;
    this.scene.tweens.add({
      targets: [this.costIcon],
      scaleX: 1.0,
      scaleY: 1.0,
      y: costY,
      duration: gameOptions.tweenSpeed,
    });
  }
  pointerUp() {
    this.isGrab = false;
    this.sprite.on("pointerover", this.pointerOver, this);
    this.sprite.on("pointerout", this.pointerOut, this);
    this.sprite.setScale(this.defaultScale);
    this.setPos(this.defaultX, this.defaultY);

    this.scene.player.target.invisible();
    this.scene.enemyGroup.children.iterate((child) => {
      child.target.invisible();
    });
  }

  defaultPosTween(x, y) {
    this.setDefaultPos(x, y);
    // this.setAngleAuto();
    this.scene.tweens.add({
      targets: [this.sprite],
      x: this.defaultX,
      y: this.defaultY,
      duration: gameOptions.tweenSpeed,
      onComplete: () => { }
    });
    this.scene.tweens.add({
      targets: [this.icon],
      x: this.defaultX,
      y: this.getPercentY(0.25, this.defaultY),
      duration: gameOptions.tweenSpeed,
      onComplete: () => { }
    });
    this.scene.tweens.add({
      targets: [this.customText.text],
      x: this.defaultX,
      y: this.getPercentY(0.7, this.defaultY),
      duration: gameOptions.tweenSpeed,
      onComplete: () => { }
    });
    this.scene.tweens.add({
      targets: [this.costIcon],
      // x: this.defaultX - (this.sprite.width * this.sprite.scaleX) / 2,
      x: this.defaultX,
      y: this.getPercentY(this.costIconPercentY, this.defaultY),
      duration: gameOptions.tweenSpeed,
      onComplete: () => { }
    });
  }

  useCardTween() {
    this.isGrab = false;
    this.sprite.off("pointerover");
    this.sprite.off("pointerout");
    this.sprite.off("pointerdown");

    this.scene.tweens.add({
      targets: [this.sprite, this.icon, this.customText.text, this.costIcon],
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      onComplete: () => { },
    });

    this.scene.tweens.add({
      targets: [this.sprite, this.icon, this.customText.text, this.costIcon],
      alpha: 0,
      duration: 150,
      onComplete: () => { 
        this.setPos(0, 0);
        this.sprite.setScale(this.defaultScale);
        this.sprite.visible = false;
        this.sprite.alpha = 1;

        this.icon.setScale(this.defaultScale);
        this.icon.visible = false;
        this.icon.alpha = 1;

        this.customText.text.setScale(this.defaultScale);
        this.customText.text.visible = false;
        this.customText.text.alpha = 1;

        this.costIcon.setScale(this.defaultScale);
        this.costIcon.visible = false;
        this.costIcon.alpha = 1;
      },
    });

  }

  initializeTween(delayOffset) {
    this.sprite.alpha = 0;
    this.icon.alpha = 0;
    this.customText.text.alpha = 0;
    this.costIcon.alpha = 0;

    let moveDuration = gameOptions.tweenSpeed * 3;
    this.scene.tweens.add({
      targets: [this.sprite, this.icon, this.customText.text, this.costIcon],
      alpha: 1,
      delay: delayOffset * 60,
      duration: 100,
    });
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.defaultX,
      y: this.defaultY,
      angle: this.getAngleCenter(this.defaultX, this.defaultY),
      delay: delayOffset * 60,
      duration: moveDuration,
    });

    this.icon.y = this.getPercentY(0.25);
    this.scene.tweens.add({
      targets: this.icon,
      x: this.defaultX,
      angle: this.getAngleCenter(this.defaultX, this.icon.y),
      delay: delayOffset * 60,
      duration: moveDuration,
    });

    this.customText.setPositionY(this.getPercentY(0.7));
    this.scene.tweens.add({
      targets: this.customText.text,
      x: this.defaultX,
      delay: delayOffset * 60,
      angle: this.getAngleCenter(this.defaultX, this.customText.text.y),
      duration: moveDuration,
    });

    this.costIcon.y = this.getPercentY(this.costIconPercentY);
    this.scene.tweens.add({
      targets: this.costIcon,
      x: this.defaultX,
      angle: this.getAngleCenter(this.defaultX, this.costIcon.y),
      delay: delayOffset * 60,
      duration: moveDuration,
    });

  }

}