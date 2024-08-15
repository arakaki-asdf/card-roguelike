/**
 * 選択したカードをデッキに追加する
 */
class SelectCardManager extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);

    this.selectIndex = -1;
    this.button = new UIButton({
      scene: this.scene,
      x: game.config.width / 2,
      y: game.config.height / 10 * 9, 
      text: "skip",
      onClick: () => { 
        if (this.selectIndex !== -1) {
          let card = new Card({scene: this.scene, info: this.cardList[this.selectIndex].info});
          card.disable();
          this.scene.battleManager.deck.cards.add(card);
        }

        this.scene.onFade(() => { 
          this.reset();
          this.scene.player.nextBattle();
          console.log("next!!!");
        });
      }
    });

    // this.skipButton = new UIButton({
    //   scene: this.scene,
    //   x: game.config.width / 10 * 6,
    //   y: game.config.height / 10 * 9, 
    //   text: "Skip",
    //   onClick: () => { console.log(`${this.selectIndex}`); }
    this.black = this.scene.add.sprite(game.config.width / 2, game.config.height / 2, "black").setInteractive();
    this.black.visible = false;
    this.black.depth = 5;
    // this.cardGroup = this.scene.add.group();
    this.cardList = [];
    this.black.on("pointerdown", () => {
      this.bar.clear();
      this.button.setText("skip");
      this.selectIndex = -1;
      // this.emitter.on = false;
    });

    this.bar = this.scene.add.graphics();
    this.button.invisible();

    // let shape = new Phaser.Geom.Rectangle(-(90 + 5), -(160 + 5), 180 + 10, 320 + 10);
    // this.particles = this.scene.add.particles('red');
    // this.particles.depth = 5;
    // this.emitter = this.particles.createEmitter({
    //   // x: 600,
    //   // y: 100
    //   scale: 2.0,
    //   angle: { min: 0, max:360 },
    //   speed: 100,
    //   // gravityY: 200,
    //   lifespan: { min: 1000, max: 2000 },
    //   blendMode: 'ADD'
    // });

    // this.emitter = this.particles.createEmitter({
    //   speed: 0,
    //   // x: game.config.width / 2,
    //   // y: game.config.height / 2,
    //   delay: 0.1,
    //   alpha: { start: 1, end: 0 },
    //   // scale: { start: 1, end: 0 },
    //   scale: 0.4,
    //   quantity: 64,
    //   frequency: 100,
    //   // lifespan: 1000,
    //   emitZone: { type: 'edge', source: shape, quantity: 64 },
    //   blendMode: 'ADD',
    //   on: false
    // });
    // this.emitter.startFollow();
  }
  clearCards() {
    for (let i = 0; i < this.cardList.length; ++i) {
      let card = this.cardList[i];
      card.destroy();
    }
    this.cardList = [];
  }

  resetRandomCards() {
    this.clearCards();
    for (let i = 0; i < 3; ++i) {
      let random = Phaser.Math.Between(1, 2);
      let offset = 120;
      let x = game.config.width / 2 - (180 + offset) + i * 180 + i * offset;
      let y = game.config.height / 2;


      let randomCard = Phaser.Math.Between(0, this.scene.cardTable.length - 1);
      let cardData = this.scene.cardTable[randomCard];
      let card = new Card({
        scene: this.scene,
        info: cardData,
      });
      card.setPos(x, y);
      card.setAlpha(0);
      card.setDepth(6);
      card.setScale(1.0);

      // let sprite = this.scene.add.sprite(x, y, `card${random}`).setInteractive();
      card.sprite.alpha = 0;
      card.sprite.selectIndex = i;
      card.sprite.on("pointerdown", () => {
        if (this.cardList.length === 0) { return; }
        this.button.setText("ok");
        console.log(i);
        // this.emitter.on = true;
        // this.emitter.startFollow(sprite);
        this.selectIndex = i;
        this.bar.depth = 6;
        this.bar.clear();
        this.bar.fillStyle(0xffff00, 0.86);
        this.bar.fillRect(
          card.sprite.x - card.sprite.width / 2 - 10, 
          card.sprite.y - card.sprite.height / 2 - 10,
          card.sprite.width + 20, 
          card.sprite.height + 20);
      });
      this.cardList.push(card);
      // this.cardGroup.add(sprite);
    }
  }
  tweenCards(delayOffset) {
    for (let i = 0; i < this.cardList.length; ++i) {
      let card = this.cardList[i];
      card.sprite.alpha = 0;
      card.icon.alpha = 0;
      card.text.alpha = 0;
      card.costIcon.alpha = 0;

      this.scene.tweens.add({
        targets: [card.sprite, card.icon, card.text, card.costIcon],
        alpha: 1,
        delay: delayOffset * i,
        duration: gameOptions.tweenSpeed * 5,
        onComplete: () => { }
      });
    }
  }

  reset() {
    this.selectIndex = -1;
    this.bar.clear();
    this.black.visible = false;
    this.button.invisible();
    this.button.setText("skip");
    this.clearCards();
  }

  start() {
    this.resetRandomCards();
    this.button.visible();
    this.black.visible = true;
    this.black.alpha = 0;
    this.scene.tweens.add({
      targets: [this.black],
      alpha: 0.8,
      duration: gameOptions.tweenSpeed * 2,
      onComplete: () => {
        this.tweenCards(100);
      }
    });
  }
}

