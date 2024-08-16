class LifeGauge extends Phaser.GameObjects.GameObject {
  /**
   * 
   * @param {*} param 
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} lifeMax
   */
  constructor(param) {
    super(param.scene);
    this.lifeMax = param.lifeMax;
    this.life = param.lifeMax;
    this.box = this.scene.add.graphics();
    this.bar = this.scene.add.graphics();
    this.barWidth = 110;
    this.barHeight = 28;
    this.barX = param.x - this.barWidth / 2;
    this.barY = param.y - this.barHeight / 2;
    this.box.fillStyle(0x42629b, 0.8);
    this.box.fillRect(this.barX, this.barY, this.barWidth, this.barHeight);

    this.text = this.scene.make.text({
      x: this.barX + this.barWidth / 2 - 20,
      y: this.barY + this.barHeight / 2 - 8,
      text: '',
      style: {
        font: 'bold 12px Arial',
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

  _textUpdate() {
    this.text.setText(`${this.life} / ${this.lifeMax}`);
  }
  _barUpdate() {
    let percent = (this.life === 0 || this.lifeMax === 0) ? 0 : this.life / this.lifeMax;
    // console.log(`${percent}`);
    this.bar.clear();
    if (percent === 0) { return; }
    this.bar.fillStyle(0xffffff, 1);
    this.bar.fillRect(this.barX + 5, this.barY + 5, (this.barWidth * percent) - 10, this.barHeight - 10);
  }

  addLife(value) {
    this.life += value;
    // ライフ上限を超えないように設定
    this.life = Phaser.Math.Clamp(this.life, 0, this.lifeMax);

    this._barUpdate();
    this._textUpdate();
  }

  isDead() {
    return this.life <= 0;
  }

}

