
class Player extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);

    this.defense = 0;
    this.sprite = this.scene.add.sprite(150, game.config.height / 2, "player");

    this.lifeGauge = new LifeGauge({
      scene: this.scene,
      x: 150,
      y: game.config.height / 2 + this.sprite.height / 2 + 25,
      lifeMax: 30
    });

    this.target = new Target({
      scene: this.scene,
      tag: "target",
      x: this.sprite.x,
      y: this.sprite.y + 20,
      depth: 1,
      scale: 1.2,
    });

    this.scene.anims.create({
      key: "deadAnimation",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 4,
        first: 0,
      }),
      frameRate: 6,
    });

    this.createDef();
  }

  turnInitialize() {
    this.resetDef();
  }

  /**
   * 次の戦闘 (バフ系は削除する)
   */
  nextBattle() {
    this.resetDef();
  }

  createDef() {
    this.def = 0;
    this.defIcon = this.scene.add.sprite(this.sprite.x - 40,  this.sprite.y + this.sprite.height / 2 + 50, "def").setScale(0.5);
    this.defText = new CustomText({
      scene: this.scene,
      x: this.defIcon.x + this.defIcon.width * 0.5 - 10,
      y: this.defIcon.y + this.defIcon.width * 0.5,
      text: "10",
      bold: true,
      fill: "#ffff00",
      fontSize: 16,
    });
    this.defText.text.depth = 3;
    this.defText.text.setShadow(-1, 1, 'rgba(0, 0, 0, 0.7)', 5);

    this.defIcon.visible = false;
    this.defText.text.visible = false;
  }

  takenDamage(damage) {
    let pos = {
      x: this.sprite.x,
      y: this.sprite.y,
    };
    let diff = this.def - damage;

    if (diff === 0) {
      this.scene.defenceEffect.play(pos.x, pos.y, this.sprite.depth + 1);
      this.resetDef();
    } else if (diff > 0) {
      this.scene.defenceEffect.play(pos.x, pos.y, this.sprite.depth + 1);
      this.def = diff;
      this.defText.text.setText(`${diff}`);
    } else {
      // if (this.def > 0) { 
        // this.scene.defenceEffect.playCracked(pos.x, pos.y, this.sprite.depth + 1);
      // }

      this.resetDef();
      this.lifeGauge.addLife(diff);

      this.scene.damageEffect.play(pos.x, pos.y);
      this.scene.textEffect.play(pos.x, pos.y - 30, Math.abs(diff), "#f72a2a");
      this.scene.camera.shake(100, 0.01);
    }
  }

  /**
   * 
   * @param {*} def 
   * @returns {number} over damage
   */
  addDef(def) {
    this.def += def;
    this.defIcon.visible = true;
    this.defText.text.visible = true;
    this.defText.text.setText(`${this.def}`);
    return 0;
  }

  resetDef() {
    this.def = 0;
    this.defIcon.visible = false;
    this.defText.text.visible = false;
  }

  hasDef() {
    return this.def > 0;
  }

  onDead(callback = () => { }) {
    this.sprite.play("deadAnimation").once('animationcomplete', () => {
      callback();
   });
  }
}

