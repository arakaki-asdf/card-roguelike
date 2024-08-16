
/**
 * 戦闘時の防御エフェクト
 */
class DefenceEffect extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);
    this.list = param.scene.add.group();
  }

  playCracked(x, y, depth = 1) {
    let sprite = this.scene.add.sprite(x, y, "defCracked").setScale(1.2);
    // let color = Phaser.Display.Color.GetColor(255, 255, 0);
    // sprite.setTint(color);
    // sprite.setTint(0xffff00);
    sprite.depth = depth;
    sprite.alpha = 0;
    this.list.add(sprite);

    this.scene.tweens.add({
      targets: sprite,
      duration: gameOptions.tweenSpeed,
      alpha: 1,
      y: y - 5,
      // ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.time.delayedCall(gameOptions.tweenSpeed * 3, () => {
          this.scene.tweens.add({
            targets: sprite,
            duration: gameOptions.tweenSpeed,
            alpha: 0,
            y: y + 5,
            // ease: 'Sine.easeInOut',
            onComplete: () => {
              sprite.destroy();
              // this.list.getChildren()[0].destroy();
            }
          });
        });
      }
    });
  }

  play(x, y, depth = 1) {
    var sprite = this.scene.add.sprite(x, y, "def").setScale(1.2);
    // let color = Phaser.Display.Color.GetColor(255, 255, 0);
    sprite.setTint(0xffff00);
    sprite.depth = depth;
    sprite.alpha = 0;
    this.list.add(sprite);

    this.scene.tweens.add({
      targets: sprite,
      duration: gameOptions.tweenSpeed,
      alpha: 1,
      y: y - 5,
      // ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.time.delayedCall(gameOptions.tweenSpeed * 3, () => {
          this.scene.tweens.add({
            targets: sprite,
            duration: gameOptions.tweenSpeed,
            alpha: 0,
            y: y + 5,
            // ease: 'Sine.easeInOut',
            onComplete: () => {
              sprite.destroy();
              // this.list.getChildren()[0].destroy();
            }
          });
        });
      }
    });
  }

  clear() {
    this.effectGroup.clear(true);
  }
}