/**
 * デッキ
 * ゲームを進める毎にカード枚数が増減する
 * バトル開始時にデッキからカードを引く
 * デッキとは別にバトル情報を管理するクラスが必要
 */
class Deck extends Phaser.GameObjects.GameObject {
  /**
   * @param {scene} param 
   */
  constructor(param) {
    super(param.scene);
    this.cards = this.scene.add.group();
    let cardTable = this.scene.cardTable;
    // attack 3枚
    for (var i = 0; i < 6; ++i) {
      this.cards.add(new Card({
        scene: this.scene,
        info: cardTable[2]
      }));
    }

    // defance 2枚
    for (var i = 0; i < 4; ++i) {
      this.cards.add(new Card({
        scene: this.scene,
        info: cardTable[1]
      }));
    }

    // for (var i = 0; i < 5; ++i) {
    //   this.cards.add(new Card({
    //     scene: this.scene,
    //     info: cardTable[3]
    //   }));
    // }
  }

  /**
   * ゲーム開始時のデッキ構成に設定する
   * @param {*} cardTable 
   */
  initialize(cardTable) {
    // this.cards.clear(true);
    this.cardsInVisible();
  }

  cardsVisble() {
    this.cards.children.iterate((card) => {
      card.sprite.visible = true;
    })
  }
  cardsInVisible() {
    this.cards.children.iterate((card) => {
      card.sprite.visible = false;
    })
  }
}


