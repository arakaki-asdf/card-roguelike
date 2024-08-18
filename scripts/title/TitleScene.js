
/**
 * タイトル画面
 */
class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("titleBG", "assets/title/bg.png");
    this.load.image("startButton", "assets/title/startButton.png");
    this.load.image("title", "assets/title/title.png");
    this.load.spritesheet("player", "assets/player700x70.png", {
      frameWidth: 70,
      frameHeight: 70,
    });

    // フェードしたいので初期カメラ非表示
    this.camera = this.cameras.main;
    this.camera.visible = false;
  }

  create() {
    this.time.delayedCall(500, () => {
      this.cameras.main.fadeIn(600, 0, 0, 0, (_camera, progress) => {
        if (progress >= 1) {
          this.fadeComplete();
        }
      });
      this.camera.visible = true;
    })



    // 背景
    this.add.sprite(Common.posX(50), Common.posY(50), "titleBG").setScale(0.67);
    // タイトル
    this.add.sprite(Common.posX(50), Common.posY(20), "title").setScale(0.67);
    // ボタン
    this.startButton = new UIButton({
      scene: this,
      name: "startButton",
      x: Common.posX(50),
      y: Common.posY(80),
      onClick: () => { 
        // シーン切り替え
        this.startButton.removeInteractive();
        this.cameras.main.fadeOut(600, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('BattleScene');
        });
      }
    });

    const config = {
      key: "animation",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 9,
        first: 0
      }),
      frameRate: 7,
      repeat: -1,
      // yoyo: true,
    };
    this.anims.create(config);
    this.add.sprite(Common.posX(50), Common.posY(60), "player").play("animation");
  }

  fadeComplete() {
      this.startButton.setInteractive();
  }
}