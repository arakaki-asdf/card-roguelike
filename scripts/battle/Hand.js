/**
 * プレイヤーの手札を管理する
 */
class Hand extends Phaser.GameObjects.GameObject {
  /**
   * 
   * @param {scene} param 
   */
  constructor(param, cardTable) {
    super(param.scene);
    this.cards = [];
    this.enemyAttackIndex = 0;
  }

  /**
   * ターン開始時にデッキからカードを引く際に使用
   */
  turnInitialize(cardAry) {
    this.reset();
    this.cards = cardAry;
    for (let i = 0; i < this.cards.length; ++i) {
      let card = this.cards[i]
      // let offset = 300 - this.cards.length * 30;
      let offset = 150;

      // カード枚数の真ん中をセンターにするためにずらす値
      let centerX = 0;
      if (this.cards.length == 1) { centerX = game.config.width / 2; }
      else { centerX = (game.config.width / 2 + card.sprite.width / 2) - offset * this.cards.length / 2; }
      let rev = this.cards.length - 1 - i;
      card.setDefaultPos(rev * offset + centerX, game.config.height * 9 / 10);
      card.setPos(0, game.config.height * 9 / 10);
      card.initializeTween(i);
      // card.setPos(i * 150 + centerX, game.config.height * 9 / 10);
      card.enable();
    }
  }

  enemyAttack() {
    if (this.scene.player.lifeGauge.isDead()) {
      // 黒背景
      this.black = this.scene.add.sprite(Common.posX(50), Common.posY(50), "black").setInteractive();
      this.black.visible = true;
      this.black.depth = 5;
      this.black.alpha = 0.01;

      // END文字
      this.endText = this.scene.add.text(
        game.config.width / 2,
        game.config.height / 2,
        "END", {
          font: "bold 64px monospace"
        }).setOrigin(0.5);
      this.endText.depth = 6;
      this.endText.alpha = 0;

      this.scene.player.onDead(() => {
            this.scene.tweens.add({
              targets: [this.endText],
              alpha: 1,
              duration: gameOptions.tweenSpeed * 2,
              onComplete: () => {
                this.scene.time.delayedCall(500, () => {
                  this.scene.tweens.add({
                    targets: [this.endText],
                    alpha: 0,
                    duration: 500,
                  });
                  this.scene.cameras.main.fadeOut(700, 0, 0);
                  this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.scene.transition({
                      target: "TitleScene",
                      duration: 500,
                    });
                  });
                });
              }
            })
      });

      return;
    }

    let index = this.enemyAttackIndex;
    if (index < this.scene.enemyGroup.children.size) {
      let enemy = this.scene.enemyGroup.children.entries[index];
      enemy.action(() => {
        this.enemyAttackIndex++;
        this.enemyAttack();
      });
    } else {
      this.enemyAttackIndex = 0;
      this.scene.battleManager.initialize();
      console.log("end");
    }
  }

  /**
   * ターン終了の処理 残っている手札をすべて捨てる
   */
  turnEnd() {
    for (let j = 0; j < this.cards.length; ++j) {
      this.cards[j].useCardTween();
    }
    this.enemyAttack();
  }

  /**
   * カードをクリアする
   */
  reset() {
    for(let i = 0; i < this.cards.length; ++i) {
      let card = this.cards[i];
      card.disable();
    }
    this.cards = [];
  }

  update() {
    for (let i = 0; i < this.cards.length; ++i) {
      let card = this.cards[i];
      if (!card.isGrab) { continue; }

      card.setPos(game.input.mousePointer.x, game.input.mousePointer.y);

      if (card.info.type === 0) {
        let index = this.checkCollisionEnemy(card);
        for (let i = 0; i < this.scene.enemyGroup.children.size; ++i) {
          let enemy = this.scene.enemyGroup.children.entries[i];
          if (i !== index) {
            enemy.target.visible();
            continue;
          }
          enemy.target.lock();
        }
      } else if (card.info.type === 1) {
        let player = this.scene.player;
        if (this.checkCollisionPlayer(card) === 0) {
          player.target.lock();
        } else {
          player.target.visible();
        }
      }

      return;
    }
  }

  checkCollisionSprite(sprite1, sprite2) {
    return Phaser.Geom.Rectangle.Overlaps(sprite1.getBounds(), sprite2.getBounds());
  }
  /**
   * 
   * @param {Card} card 
   * @returns {number} [0 player] [1 enemy] [-1 nothing]
   */
  checkCollisionPlayer(card) {
    // アタックタイプはplayerを指定できない
    if (card.info.type === 0) { return -1; }
    if (this.checkCollisionSprite(card.sprite, this.scene.player.target.sprite)) { return 0; }
    // if (this.scene.checkCollision(card.sprite, this.scene.player.sprite)) { return 0; } 
    return -1;
  }

  checkCollisionEnemy(card) {
    // ディフェンスタイプは敵を指定できない
    if (card.info.type === 1) { return - 1; }

    // let index = 0;
    for (var i = 0; i < this.scene.enemyGroup.children.size; ++i) {
      var enemy = this.scene.enemyGroup.children.entries[i];
      if (this.checkCollisionSprite(card.sprite, enemy.target.sprite)) { return i; }
      // if (this.scene.checkCollision(card.sprite, enemy.sprite)) { return i; }
    }

    return -1;
  }

  /**
   * カード効果を発動する
   * cardTableのidからそのカードの効果を付与する
   * @param {*} card 
   */
  cardEffect(card, enemyIndex) {
    let enemy = enemyIndex != -1 ? this.scene.enemyGroup.children.entries[enemyIndex] : 0;
    this.aryFunc = [
      (enemy) => { this.cardEffect0(enemy); },
      (enemy) => { this.cardEffect1(enemy); },
      (enemy) => { this.cardEffect2(enemy); },
      (enemy) => { this.cardEffect3(enemy); },
    ];

    this.aryFunc[card.info.id](enemy);
  }
  cardEffect0(enemy) {
    let damage = 12;
    enemy.lifeGauge.addLife(-damage);
    enemy.takenDamageTween();
    this.scene.damageEffect.play(enemy.sprite.x, enemy.sprite.y);
    this.scene.textEffect.play(enemy.sprite.x, enemy.sprite.y - 40, damage, "#f72a2a");
  }
  cardEffect1() {
    this.scene.player.addDef(5);
  }
  cardEffect2(enemy) {
    let damage = 5;
    enemy.lifeGauge.addLife(-damage);
    enemy.takenDamageTween();
    this.scene.damageEffect.play(enemy.sprite.x, enemy.sprite.y);
    this.scene.textEffect.play(enemy.sprite.x, enemy.sprite.y - 40, damage, "#f72a2a");
  }
  cardEffect3(enemy) {
    let damage = 20;
    enemy.lifeGauge.addLife(-damage);
    enemy.takenDamageTween();
    this.scene.damageEffect.play(enemy.sprite.x, enemy.sprite.y);
    this.scene.textEffect.play(enemy.sprite.x, enemy.sprite.y - 40, damage, "#f72a2a");
  }



  /**
   * カードを離す
   */
  cardRelease() {
    this.scene.player.target.invisible();
    this.scene.enemyGroup.children.iterate((child) => {
      child.target.invisible();
    });

    for (let i = 0; i < this.cards.length; ++i) {
      var card = this.cards[i];
      if (!card.isGrab) { continue; }

      this.scene.oneGrab = false;
      let collision = this.checkCollisionPlayer(card);
      if (collision === 0) {
        this.scene.battleManager.useCost(card.info.cost, this.cards);
        this.cardEffect(card, -1);
        card.useCardTween();
        this.cards.splice(i, 1);
        for (let j = 0; j < this.cards.length; ++j) {
          let offset = 150;
          // カード枚数の真ん中をセンターにするためにずらす値
          let centerX = 0;
          if (this.cards.length == 1) { centerX = game.config.width / 2; }
          else { centerX = (game.config.width / 2 + card.sprite.width / 2) - offset * this.cards.length / 2; }
          let rev = this.cards.length - 1 - j;
          let x = rev * offset + centerX;
          let y = game.config.height * 9 / 10;
          this.cards[j].defaultPosTween(x, y);
        }
        return;
      }

      let enemyIndex = this.checkCollisionEnemy(card);
      if (enemyIndex != -1) {
        this.scene.battleManager.useCost(card.info.cost, this.cards);
        this.cardEffect(card, enemyIndex);
        card.useCardTween();
        this.cards.splice(i, 1);
        for (let j = 0; j < this.cards.length; ++j) {
          let offset = 150;
          // カード枚数の真ん中をセンターにするためにずらす値
          let centerX = 0;
          if (this.cards.length == 1) { centerX = game.config.width / 2; }
          else { centerX = (game.config.width / 2 + card.sprite.width / 2) - offset * this.cards.length / 2; }
          let rev = this.cards.length - 1 - j;
          let x = rev * offset + centerX;
          let y = game.config.height * 9 / 10;
          this.cards[j].defaultPosTween(x, y);
        }

        let enemy = this.scene.enemyGroup.children.entries[enemyIndex];
        if (enemy.lifeGauge.isDead()) {
          enemy.tweenDead(() => {
            if (this.scene.enemyGroup.children.size == 0) {
              this.scene.time.delayedCall(300, () => {
                this.scene.cardSelectManager.start();
              });
            }
          });
        }
        return;
      }

      card.pointerUp();
      return;
    }
  }

}

