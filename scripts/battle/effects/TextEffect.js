/**
 * 戦闘時のテキスト(数値)エフェクト
 */
class TextEffect extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);
    this.effectGroup = param.scene.add.group();
  }

  play(x, y, score, color) {
    var effectText = this.scene.add.text(x, y, `${score}`, {
      align: 'center',
      fill: color,
      font: `bold 48px ${gameOptions.font}`
    }).setOrigin(0.5);
    effectText.setShadow(-1, 1, 'rgba(255, 255, 255, 0.3)', 1);
    effectText.depth = 1;
    this.effectGroup.add(effectText);

    effectText.setScale(1.2);

    this.scene.tweens.add({
      targets: effectText,
      duration: 400,
      scaleX: 1.0,
      scaleY: 1.0,
      alpha: 0,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.effectGroup.getChildren()[0].destroy();
      }
    });
    this.scene.tweens.add({
      targets: effectText,
      duration: 300,
      y: y - 20,
      repeat: 0,
      onComplete: () => {
      }
    });
  }

  clear() {
    this.effectGroup.clear(true);
  }
}