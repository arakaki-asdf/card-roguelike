
/**
 * バトルシーン
 */
class GameScene extends Phaser.Scene {

  // おまじない
  constructor() {
    super("GameScene");
  }

  // シーン読み込み Phaserライフサイクル
  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("frame", "assets/frame.png");
    this.load.image("circle", "assets/circle.png");
    this.load.image("book", "assets/book.png");
    this.load.image("black", "assets/black.png");
    this.load.image("turnEndButton", "assets/turnEndButton.png");
    this.load.image("buttonBase", "assets/buttonBase.png");
    this.load.image("xButton", "assets/xButton.png");
    this.load.image('red', 'assets/red.png');

    this.load.image("def", "assets/icon/def.png");
    this.load.image("defCracked", "assets/icon/defCracked.png");
    this.load.image("atk", "assets/icon/atk.png");

    // 画像を効率よく
    this.load.spritesheet("card_background", "assets/card/card_background_180x320.png", {
      frameWidth: 180,
      frameHeight: 320,
    });
    this.load.spritesheet("card_icon", "assets/card/card_icon_140x120.png", {
      frameWidth: 140,
      frameHeight: 120,
    });
    this.load.spritesheet("card_cost", "assets/card/card_cost_40x40.png", {
      frameWidth: 40,
      frameHeight: 40,
    });

    this.load.json("cardTable", "assets/card/cardTable.json");
    this.load.json("stageTable", "assets/stageTable.json");
  }

  // シーン作成時 Phaserライフサイクル
  create() {
    this.selectCardManager = new SelectCardManager({scene: this});

    /**
     * name カード名
     * rare レアリティ
     * type アタック、スキル、パワー
     * cost 発動コスト
     */
    this.cardTable = this.cache.json.get("cardTable");



    /**
     * [ {
     *  name: "",
     *  "enemies": [ { type, x, y, life }]
     * }]
     */
    this.stageTable = this.cache.json.get("stageTable");
    this.camera = this.cameras.main;
    this.deck = new Deck({scene: this});
    this.deck.initialize();
    this.deckSetting = new DeckSetting({scene: this});

    this.bookButton = this.add.sprite(game.config.width - 98 / 2 - 10, 10 + 98 / 2, "book").setScale(0.8).setInteractive();
    this.bookButton.on("pointerdown", () => {
      this.deckSetting.open();
    });
    this.bookButton.on("pointerout", () => {
      this.tweens.add({
        targets: [this.bookButton],
        scaleX: 0.8,
        scaleY: 0.8,
        duration: gameOptions.tweenSpeed,
        onComplete: () => { },
      });
    });
    this.bookButton.on("pointerover", () => {
      this.tweens.add({
        targets: [this.bookButton],
        scaleX: 0.9,
        scaleY: 0.9,
        duration: gameOptions.tweenSpeed,
        onComplete: () => { },
      });
    });

    this.damageEffect = new DamageEffect({scene: this});
    this.textEffect = new TextEffect({scene: this});
    this.defenceEffect = new DefenceEffect({scene: this});

    this.player = new Player({scene: this});
    this.stageCount = 0;
    this.enemyGroup = this.add.group();

    let stage = this.stageTable[this.stageCount];
    this.resetStage(stage);

    this.turnEndButton = this.add.sprite(game.config.width - 100, game.config.height - 40, "turnEndButton").setScale(0.8).setInteractive();
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
      this.battleManager.turnEnd();
    });

    this.battleManager = new BattleManager({scene: this, deck: this.deck});
    this.battleManager.initialize();

    this.oneGrab = false;
    // this.target = this.add.sprite(0, 0, "frame");
    // this.target.visible = false;

    // this.hands = new Hand({scene: this}, this.cardTable);
    // this.enemy = this.add.sprite(game.config.width - 150, game.config.height / 2, "enemy").setScale(2.0);

    this.input.on("pointerup", () => {
      this.battleManager.cardRelease();
    });
  }

  // シーン更新 Phaserライフサイクル
  update() {
    this.battleManager.update();
    this.deckSetting.update();
  }

  resetStage(stage) {
    this.enemyGroup.clear(true);

    let enemies = stage.enemies;
    for (let i = 0; i < enemies.length; ++i) {
      let enemyData = enemies[i];
      let enemy = new EnemyA({
        scene: this,
        x: enemyData.x,
        y: enemyData.y,
        lifeOffsetY: 70,
        lifeMax: enemyData.life
      });
      this.enemyGroup.add(enemy);
    }
  }

  // setTargetInvisible() {
  //   this.target.visible = false;
  // }
  // setTarget(x, y, scale = 1.0) {
  //   this.target.visible = true;
  //   this.target.x = x;
  //   this.target.y = y;
  //   this.target.setScale(scale);
  //   this.target.setTint(0xffff00);
  //   this.target.depth = 0;
  // }

  /**
   * 
   * @param {function} fadeOutComplete フェードイン(真っ暗)の状態でのコールバック
   * @param {function} fadeInComplete フェードアウト (ゲーム開始)の状態でのコールバック
   */
  onFade(fadeOutComplete = () => { }, fadeInComplete = () => { }) {
    this.camera.fadeOut(300);
    this.camera.on("camerafadeoutcomplete", () => {
      this.camera.fadeEffect.alpha = 1.0;
      this.camera.off("camerafadeoutcomplete");

      fadeOutComplete();

      this.deck.cardsInVisible();
      this.stageCount = (this.stageCount + 1) % this.stageTable.length;
      let stage = this.stageTable[this.stageCount];
      this.resetStage(stage);
      this.battleManager.reset();

      this.time.delayedCall(50, () => {
        this.camera.fadeIn(300);
        this.camera.on("camerafadeincomplete", () => {
          this.camera.off("camerafadeincomplete");

          fadeInComplete();
          this.battleManager.initialize();
          console.log("onFadeIn");
        });
      });
    });
  }

};

