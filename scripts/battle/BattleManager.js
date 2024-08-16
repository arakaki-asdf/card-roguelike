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
    this.costText = this.scene.add.text(
      Common.posX(3),
      Common.posY(90),
      "", {
        font: `36px bold ${gameOptions.font}`,
        origin: 0.5,
    });
    this.updateCostText();
  }

  updateCostText() {
    this.costText.setText(`${this.pastCost} / ${this.costMax}`);
  }

  /**
   * コストを消費し、手札の使えないカードはpointerdownを無効化する
   * @param {*} cost 
   */
  useCost(cost, cards) {
    this.pastCost -= cost;
    this.updateCostText();
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
    this.pastCost = this.costMax;
    this.updateCostText();
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
    this.updateCostText();
  }
}


