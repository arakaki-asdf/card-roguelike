
class DeckSetting extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);
    this.defaultDepth = 10;

    this.black = this.scene.add.sprite(game.config.width / 2, game.config.height / 2, "black"); // .setInteractive();
    this.black.setScale(2.0);
    this.black.alpha = 0.7;
    this.black.depth = this.defaultDepth - 1;

    this.touchObject = this.scene.add.sprite(game.config.width / 2, game.config.height / 2, "black").setInteractive();
    this.touchObject.setScale(2.0);
    this.touchObject.alpha = 0.0001;
    this.touchObject.depth = this.defaultDepth + 1;

    this.cardList = [];
    this.closeButton = this.scene.add.sprite(game.config.width - 98 / 2 - 10, 10 + 98 / 2, "crossButton")
      .setScale(0.8)
      .setInteractive();
    this.closeButton.depth = this.defaultDepth + 1;
    this.closeButton.on("pointerout", () => {
      this.scene.tweens.add({
        targets: [this.closeButton],
        scaleX: 0.8,
        scaleY: 0.8,
        duration: gameOptions.tweenSpeed,
      });
    });
    this.closeButton.on("pointerover", () => {
      this.scene.tweens.add({
        targets: [this.closeButton],
        scaleX: 0.9,
        scaleY: 0.9,
        duration: gameOptions.tweenSpeed,
      });
    });
    this.closeButton.on("pointerdown", () => {
      this.close();
    });

    this.scrollCamera = new ScrollCamera({
      scene: this.scene,
      focusObject: this.touchObject,
      cards: this.cardList,
      staticObjects: [this.closeButton],
    });

    this.close();
  }

  clearCards() {
    for(let i = 0; i < this.cardList.length; ++i) {
      let card = this.cardList[i];
      card.destroy();
    }
    this.cardList = [];
  }

  open() {
    this.black.visible = true;
    this.touchObject.visible = true;
    this.closeButton.visible = true;
    this.closeButton.x = game.config.width - 98 / 2 - 10;
    this.closeButton.y = 10 + 98 / 2;
    this.resetCards(this.defaultDepth);
    this.scrollCamera.reset(this.cardList);
    this.scrollCamera.on();
  }

  close() {
    this.black.visible = false;
    this.touchObject.visible = false;
    this.closeButton.visible = false;
    this.scrollCamera.off();
    this.scrollCamera.reset();
    this.clearCards();
  }

  resetCards(depth) {
    this.clearCards();
    const maxX = 5;
    let cards = this.scene.battleManager.deck.cards;

    for (var i = 0; i < cards.children.size; ++i) {
      let width = 180;
      let height = 320;
      let start = {x: 180 / 2 + 100, y: 320 / 2 + 80 };
      let posX = start.x + i % 5 * 210;
      let posY = start.y + Math.floor(i / 5) * 380;
      // cards.info;
      // this.cards.add(new Card({
      //   scene: this.scene,
      //   info: cardTable[2]
      // }));
      let cardOrigin = cards.children.entries[i];
      let card = new Card({
        scene: this.scene,
        info: cardOrigin.info
      });
      card.setPos(posX, posY);
      card.setDepth(depth);
      card.setScale(1.0);
      this.cardList.push(card);
    }
  }

  create() {
    // for (let i = 0; i < cards.children.size; ++i) {
    //     console.log(Math.floor(i / 5));
    //     let cardOrigin = cards.children.entries[i];
    //     let sprite = this.add.sprite(posX, posY, `card${cardOrigin.info.id}`);
    //     this.spriteGroup.add(sprite);
    // }
  }

  update() {
    this.scrollCamera.update();
  }
};

