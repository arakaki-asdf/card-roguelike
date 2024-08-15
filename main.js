
// ゲームの全体設定 (jsonとかでも良さそう)
const gameOptions = {
  tweenSpeed: 75,
  // レイヤー
  depth: {
    back: 1,

    default: 3,

    selectCard: 6,
  },
};

class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
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
    this.load.json("cardTable", "assets/card/cardTable.json");
  }

  create() {

  }
  update() { }

  testCollision() {
    this.isTouch = false;
    this.sprite2 = this.add.sprite(game.config.width / 2, game.config.height /2 , "card_background", 0);
    this.sprite1 = this.add.sprite(200, 200, "card_background", 0).setInteractive();
    this.sprite1.on("pointerdown", (pointer) => {
      this.sprite1.x = pointer.x;
      this.sprite1.y = pointer.y;
      this.isTouch = true;
    });
    this.sprite1.on("pointermove", (pointer) => {
      if (!this.isTouch) { return; }
      this.sprite1.x = pointer.x;
      this.sprite1.y = pointer.y;
      if (Phaser.Geom.Rectangle.Overlaps(this.sprite1.getBounds(), this.sprite2.getBounds())) {
        console.log("collision!!!");
      }
    });
    this.sprite1.on("pointerup", (pointer) => {
      this.isTouch = false;
      this.sprite1.x = pointer.x;
      this.sprite1.y = pointer.y;
    });
  }

  testCreateCard(x, y, id) {
    this.cardTable = this.cache.json.get("cardTable");
    let cardData = this.cardTable[id];

    this.add.sprite(x, y, "card_background", cardData.rare);
    this.add.sprite(x, y - 80, "card_icon", cardData.id);
    this.add.text(x, y + 80, `${cardData.text}`, {
      font: 'bold 16px Arial',
      align: 'center',
      fill: "#000000",
    }).setOrigin(0.5);
  }
  testEffect() {
    let sprite1 = this.add.sprite(game.config.width / 2, game.config.height / 2, "card");
    let shape = new Phaser.Geom.Rectangle(-(90 + 15), -(160 + 15), 180 + 30, 320 + 30);
    var particles = this.add.particles('red');


    this.emitter = particles.createEmitter({
      speed: 30,
      // x: game.config.width / 2,
      // y: game.config.height / 2,
      alpha: { start: 1, end: 0 },
      // scale: { start: 1, end: 0 },
      scale: 0.65,
      quantity: 20,
      frequency: 100,
      // lifespan: 1000,
      emitZone: { type: 'edge', source: shape, quantity: 50 },
      blendMode: 'ADD'
    });
    // this.emitter.startFollow();
    this.emitter.emitParticleAt(game.config.width / 2, game.config.height / 2);
  }

  testFadeInput() {
    this.camera = this.cameras.main;
    this.input.on("pointerdown", () => {
      this.camera.fadeOut(250);
    });
    this.camera.on("camerafadeoutcomplete", () => {
      this.time.delayedCall(150, () => {
        this.camera.fadeIn(250);
      });
    });
  }

}

// 設定データ
const config = {
  type: Phaser.AUTO,
  width: 1280,                // 画面 幅
  height: 720,                // 画面 高さ
  backgroundColor: 0x242424,  // 背景色
  scene: [GameScene],         // 初期シーン
};

const game = new Phaser.Game(config);