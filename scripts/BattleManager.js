class BattleManager extends Phaser.GameObjects.GameObject {
  /**
   * 必要なデータを準備
   * @param {scene, deck} param 
   */
  constructor(param) {
    super(param.scene);

    // 参照
    this.deck = param.deck;
    this.turn = 0;
    this.hand = new Hand({scene: this.scene});

    this.costMax = 3;
    this.pastCost = 3;
    this.costText = this.scene.add.text(game.config.width / 10 * 0.7, game.config.height / 10 * 9, `${this.pastCost} / ${this.costMax}`, {
      font: "36px monospace"
    }).setOrigin(0.5);
  }

  /**
   * コストを消費し、手札の使えないカードはpointerdownを無効化する
   * @param {*} cost 
   */
  useCost(cost, cards) {
    this.pastCost -= cost;
    this.costText.setText(`${this.pastCost}  / ${this.costMax}`);
    for (let i = 0; i < cards.length; ++i) {
      if (cards[i].info.cost > this.pastCost) {
        cards[i].sprite.off("pointerdown");
        cards[i].sprite.off("pointerover");
        cards[i].sprite.off("pointerout");
        cards[i].setAlpha(0.5);
      }
    }
  }

  /**
   * ターン開始
   * デッキから特定の枚数引く
   */
  initialize() {
    if (this.scene.player.lifeGauge.isDead()) {
      this.testText = this.scene.add.text(game.config.width / 2, game.config.height / 2, "END", {
        font: "bold 64px monospace"
      }).setOrigin(0.5);
      this.scene.scene.pause();
      return;
    }
    this.pastCost = this.costMax;
    this.costText.setText(`${this.pastCost}  / ${this.costMax}`);
    this.shuffleCards = this._deckShuffle();
    this.hand.turnInitialize(this.pullCards());

    this.scene.player.turnInitialize();
    this.scene.enemyGroup.children.iterate((child) => {
      child.turnInitialize();
    });
  }

  /**
   * @returns {Card[]} シャッフルしたカード配列
   */
  _deckShuffle() {
    // デッキ初期化
    var deckCopys = [];
    this.deck.cards.children.iterate((child) => {
      deckCopys.push(child);
      child.disable();
    })
    return Phaser.Utils.Array.Shuffle(deckCopys);
  }

  /**
   * @returns {Card[]} 手札に加えるカード配列
   */
  pullCards() {
    let pullMax = 5;
    let count = 0;

    var handCards = [];
    while (true) {
      if (this.shuffleCards.length === 0) { console.log("カードがタリナイ"); }
      handCards.push(this.shuffleCards.shift());
      count++;
      if (count == pullMax) { break; }
    }

    return handCards;
  }

  update() {
    this.hand.update();
  }
  
  cardRelease() {
    this.hand.cardRelease();
  }

  turnEnd() {
    this.hand.turnEnd();
  }

  reset() {
    this.hand.reset();
    this.pastCost = this.costMax;
    this.costText.setText(`${this.pastCost}  / ${this.costMax}`);
  }
}


