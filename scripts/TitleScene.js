
class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.spritesheet("card_background", "assets/card/card_background_180x320.png", {
      frameWidth: 180,
      frameHeight: 320,
    });
    this.load.spritesheet("card_icon", "assets/card/card_icon_140x120.png", {
      frameWidth: 140,
      frameHeight: 120,
    });
    this.load.json("cardTable", "assets/json/card.json");

    this.load.image("bg", "assets/piko85.png");

    this.load.image("turnEndButton", "assets/turnEndButton.png");
  }

  create() {
    this.add.sprite(game.config.width / 2, game.config.height / 2, "bg").setScale(0.67).setInteractive();

    this.turnEndButton = this.add.sprite(game.config.width / 2, game.config.height - 200, "turnEndButton").setScale(0.8).setInteractive();
    this.turnEndButton.on("pointerout", () => {
      this.tweens.add({
        targets: [this.turnEndButton],
        scaleX: 0.8,
        scaleY: 0.8,
        duration: gameOptions.tweenSpeed,
        onComplete: () => { },
      });
    });
    this.turnEndButton.on("pointerover", () => {
      this.tweens.add({
        targets: [this.turnEndButton],
        scaleX: 0.9,
        scaleY: 0.9,
        duration: gameOptions.tweenSpeed,
        onComplete: () => { },
      });
    });
    this.turnEndButton.on("pointerdown", () => {
      console.log("hello world");

      // シーン切り替え
      this.turnEndButton.removeInteractive();
      this.cameras.main.fadeOut(600, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });
  }
}