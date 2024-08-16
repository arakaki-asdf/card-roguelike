class Enemy extends Phaser.GameObjects.GameObject {
  /**
   * @param {x, y scene, lifeOffsetY, lifeMax} param 
   */
  constructor(param) {
    super(param.scene);
    this.defense = 0;
    this.sprite = this.scene.add.sprite(param.x, param.y, "enemy");

    this.attackIcon = this.scene.add.sprite(param.x, param.y - this.sprite.height * 0.01 * 50, "atk").setScale(0.8);
    this.attackIcon.setScale(0.8 * -1, 0.8);
    this.attackText = this.scene.add.text(this.attackIcon.x + this.attackIcon.width / 2 - 45, this.attackIcon.y + 3, "10", {
      fill: "#ffff00",
      fontSize: '16px',
      fontStyle: "bold",
    });

    this.lifeGauge = new LifeGauge({
      scene: this.scene, 
      x: param.x,
      y: param.y + param.lifeOffsetY,
      lifeMax: param.lifeMax
    });

    this.target = new Target({
      scene: this.scene,
      tag: "target",
      x: this.sprite.x,
      y: this.sprite.y + 20,
      depth: 1,
      scale: 1.2,
    });

    this.actionFunc = () => { };
  }

  turnInitialize() {
    let ary = [8, 9, 10, 10, 15];
    let random = Phaser.Math.Between(0, 4);
    let damage = ary[random];
    this.attackText.setText(`${damage}`);

    this.actionFunc = (onComplete) => {
      this.attackTween(damage, onComplete);
    };

    this.scene.tweens.add({
      targets: [this.attackIcon, this.attackText],
      alpha: 1,
      duration: gameOptions.tweenSpeed * 3,
    });
  }

  destroy() {
    this.sprite.destroy();
    this.lifeGauge.destroy();
    this.attackIcon.destroy();
    this.attackText.destroy();
    super.destroy();
  }

  /**
   * 死亡演出
   * 透明になる
   * @param {function} onComplete 演出終了後のコールバック
   */
  tweenDead(onComplete = () => { }) {
    this.scene.tweens.add({
      targets: [this.sprite, this.lifeGauge, this.attackIcon, this.attackText],
      alpha: 0,
      duration: gameOptions.tweenSpeed,
      onComplete: () => {
        if (this.scene.enemyGroup.children.size === 1) {
          console.log("GAME END!");
        }
        this.destroy();
        onComplete();
      }
    });
  }

  action(onComplete = () => { }) {
    this.actionFunc(onComplete);
    // this.attackTween(onComplete);
  }

  /**
   * ダメージ演出
   * 大きく動く
   * @param {function} onComplete 演出終了後のコールバック 
   */
  attackTween(damage, onComplete = () => { }) {
    let offset = 50;
    let x = this.sprite.x;
    this.scene.tweens.add({
      targets: [this.sprite],
      x: x + offset,
      duration: gameOptions.tweenSpeed * 0.5,
      onComplete: () => {
        this.scene.tweens.add({
          targets: [this.sprite],
          x: x - offset,
          duration: gameOptions.tweenSpeed * 0.5,
          onComplete: () => {
            this.scene.tweens.add({
              targets: [this.sprite],
              x: x,
              duration: gameOptions.tweenSpeed * 0.5,
              onComplete: () => {
                this.scene.player.takenDamage(damage);

                this.scene.tweens.add({
                  targets: [this.attackIcon, this.attackText],
                  alpha: 0,
                  duration: gameOptions.tweenSpeed,
                });

                this.scene.time.delayedCall(200, () => {
                  onComplete();
                });
              },
            });
          },
        });
      },
    });
  }

  /**
   * 被ダメージtween
   * 少し震える
   * @param {*} damage 
   */
  takenDamageTween() {
    let offset = 10;
    let x = this.sprite.x;
    this.scene.tweens.add({
      targets: [this.sprite],
      x: x + offset,
      duration: gameOptions.tweenSpeed * 0.5,
      onComplete: () => {
        this.scene.tweens.add({
          targets: [this.sprite],
          x: x,
          duration: gameOptions.tweenSpeed * 0.5,
          onComplete: () => { },
        });
      },
    });
  }
}

