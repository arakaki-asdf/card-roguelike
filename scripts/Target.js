
class Target extends Phaser.GameObjects.GameObject {
  /**
   * 
   * @param {scene, depth, scale} param 
   */
  constructor(param) {
    super(param.scene);

    this.sprite = this.scene.add.sprite(param.x, param.y, "frame");
    this.sprite.depth = param.depth;
    this.sprite.setScale(param.scale);
    this.invisible();
  }

  visible() {
    // this.sprite.x = x;
    // this.sprite.y = y;
    this.sprite.visible = true;
    this.sprite.clearTint(0xff0000);
  }

  lock() {
    this.sprite.visible = true;
    this.sprite.setTint(0xff0000);
  }

  invisible() {
    this.sprite.visible = false;
  }
}