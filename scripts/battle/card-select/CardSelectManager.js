/**
 * カード選択画面
 */
class CardSelectManager extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);

    this.selectIndex = -1;

    // スキップボタン
    this.skipButton = new UIButton({
      scene: this.scene,
      name: "skipButton",
      x: game.config.width / 2,
      y: game.config.height / 10 * 9, 
      onClick: () => { 
        this.scene.onFade(() => { 
          this.reset();
          this.scene.player.nextBattle();
          console.log("next!!!");
        });
      }
    });
    this.skipButton.invisible();

    // 決定ボタン
    this.okButton = new UIButton({
      scene: this.scene,
      name: "okButton",
      x: game.config.width / 2,
      y: game.config.height / 10 * 9,
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
    this.okButton.invisible();

    // 黒背景
    this.black = this.scene.add.sprite(Common.posX(50), Common.posY(50), "black").setInteractive();
    this.black.visible = false;
    this.black.depth = 5;

    this.cardList = [];
    this.black.on("pointerdown", () => {
      this.bar.clear();
      this.skipButton.visible();
      this.okButton.invisible();
      this.selectIndex = -1;
    });

    this.bar = this.scene.add.graphics();
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
        this.skipButton.invisible();
        this.okButton.visible();
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
    this.skipButton.invisible();
    this.okButton.invisible();
    this.clearCards();
  }

  start() {
    this.resetRandomCards();
    this.skipButton.visible();
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

