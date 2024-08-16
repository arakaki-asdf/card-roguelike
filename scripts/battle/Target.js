
/**
 * バトル時の対象を選択する
 */
class Target extends Phaser.GameObjects.GameObject {
  /**
   * @param {scene, tag, depth, scale} param (scene、tag, depth(z-index), scale(サイズ))
   */
  constructor(param) {
    super(param.scene);

    this.sprite = this.scene.add.sprite(param.x, param.y, param.tag);
    this.sprite.depth = param.depth;
    this.sprite.setScale(param.scale);
    this.invisible();
  }

  visible() {
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