/**
 * キャラクターの体力ゲージ表示
 */
class LifeGauge extends Phaser.GameObjects.GameObject {
  /**
   * コンストラクタ
   * @param {*} param オブジェクト
   * @param {Phaser.Scene} param.scene 現在のシーン
   * @param {number} param.x 表示するX座標
   * @param {number} param.y 表示するY座標
   * @param {number} param.lifeMax ライフ最大値
   */
  constructor(param) {
    super(param.scene);

    // 最大値
    this.lifeMax = param.lifeMax;
    // 現在値
    this.life = param.lifeMax;

    // 体力ゲージ 現在
    this.bar = this.scene.add.graphics();
    this.barWidth = 110;
    this.barHeight = 28;
    this.barX = param.x - this.barWidth * 0.5;
    this.barY = param.y - this.barHeight * 0.5;

    // 体力ゲージ 全体
    this.box = this.scene.add.graphics();
    this.box.fillStyle(0x42629b, 0.8);
    this.box.fillRect(this.barX, this.barY, this.barWidth, this.barHeight);

    this.text = this.scene.make.text({
      x: this.barX + this.barWidth * 0.5,
      y: this.barY + this.barHeight * 0.5 - (12 * 2),
      text: `${this.life} / ${this.lifeMax}`,
      origin: 0.5,
      style: {
        font: `bold 12px ${gameOptions.font}`,
        fill: '#000000',
      },
    });

    this.addLife(0);
  }

  destroy() {
    this.box.destroy();
    this.bar.destroy();
    this.text.destroy();
  }

  invisible() {
    this.box.visible = false;
    this.bar.visible = false;
  }

  visible() {
    this.box.visible = true;
    this.bar.visible = true;
  }

  updateText() {
    this.text.setText(`${this.life} / ${this.lifeMax}`);
  }

  updateBar() {
    let percent = (this.life === 0 || this.lifeMax === 0) ? 0 : this.life / this.lifeMax;
    // console.log(`${percent}`);
    this.bar.clear();
    if (percent === 0) { return; }
    this.bar.fillStyle(0xffffff, 1);
    this.bar.fillRect(this.barX + 5, this.barY + 5, (this.barWidth * percent) - 10, this.barHeight - 10);
  }

  // ライフ回復
  addLife(value) {
    this.life += value;
    // ライフ上限を超えないように設定
    this.life = Phaser.Math.Clamp(this.life, 0, this.lifeMax);

    this.updateBar();
    this.updateText();
  }

  // 死んでいるか
  isDead() {
    return this.life <= 0;
  }

}

