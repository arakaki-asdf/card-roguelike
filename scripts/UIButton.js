
/**
 * 汎用ボタン
 */
class UIButton extends Phaser.GameObjects.GameObject {
  /**
   * @param {object} param
   * @param {Phaser.Scene} param.scene
   * @param {number} param.x
   * @param {number} param.y
   * @param {string} param.text
   * @param {function} param.onClick クリック時のコールバック
   */
  constructor(param) {
    super(param.scene);

    const depth = 7;
    this.button = this.scene.add.sprite(param.x, param.y, "buttonBase");
    this.button.setInteractive();
    // this.button.setScale(0.9);
    this.button.alpha = 0.9;
    this.button.depth = depth;

    this.text = this.scene.add.text(param.x, param.y - 2, param.text, {
      font: 'bold 30px Arial',
      align: 'center',
      fill: "#FFFFFF",
    }).setOrigin(0.5);
    this.text.alpha = 0.9;
    this.text.depth = depth;
    this.onClick = param.onClick;

    this.button.on("pointerout", () => {
      this.scene.tweens.add({
        targets: [this.button, this.text],
        alpha: 0.9,
        duration: gameOptions.tweenSpeed,
        onComplete: () => {
        },
      });
    });

    this.button.on("pointerover", () => {
      this.scene.tweens.add({
        targets: [this.button, this.text],
        alpha: 1.0,
        duration: gameOptions.tweenSpeed,
        onComplete: () => {
        },
      });
    });

    this.button.on("pointerdown", () => {
      this.button.disableInteractive(); // 連打防止

      this.scene.tweens.add({
        targets: [this.button, this.text],
        scaleX: 0.9,
        scaleY: 0.9,
        duration: gameOptions.tweenSpeed,
        onComplete: () => {
          this.scene.tweens.add({
            targets: [this.button, this.text],
            scaleX: 1.0,
            scaleY: 1.0,
            duration: gameOptions.tweenSpeed,
            onComplete: () => {
              this.onClick();
              this.button.setInteractive();
            },
          });
        },
      });
    });

  }

  visible() {
    this.button.visible = true;
    this.text.visible = true;
  }

  invisible() {
    this.button.visible = false;
    this.text.visible = false;
  }
  setText(text) {
    this.text.setText(text);
  }
}
