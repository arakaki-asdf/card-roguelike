class ScrollCamera extends Phaser.GameObjects.GameObject {
  /**
   * 画面固定のstaticなオブジェクトも設定可能
   * @param {scene, focusObject, staticObjects(object[])} param 
   * @param {scene, focusObject, cards[] } param 
   */
  constructor(param) {
    super(param.scene);

    this.scrollPos = {x: 0, y: 0};
    this.focusObject = param.focusObject;
    // this.camera = this.scene.cameras.main;
    this.startPos = {x: 0, y: 0};
    this.temporaryPos = {x: 0, y: 0};
    this.isPointerDown = false;
    // this.staticObjects = param.staticObjects;
    // this.staticPos = [];
    // for (let i = 0; i < this.staticObjects.length; ++i) {
    //   this.staticPos.push({
    //     x: this.staticObjects[i].x,
    //     y: this.staticObjects[i].y,
    //   });
    // }
    this.cards = param.cards;
    this.accel = 0;
    this.deltaPos = {x:0, y:0};

    this.counter = 0;
    this.frame = 15;

  }

  on() {
    this.focusObject.on("pointerdown", (pointer) => {
      this.isPointerDown = true;
      this.startPos = { x: pointer.x, y: pointer.y };
      this.temporaryPos = { x: this.scrollPos.x , y: this.scrollPos.y };
    });
    this.focusObject.on("pointermove", (pointer) => {
      if (!this.isPointerDown) { return; }
      this.deltaPos = {
        x: this.startPos.x - pointer.x,
        y: this.startPos.y - pointer.y,
      };

      this.scrollPos.y = this.temporaryPos.y + this.deltaPos.y;
      this.scrollPos.y = Phaser.Math.Clamp(this.scrollPos.y, this.range.min, this.range.max);
      for (let i = 0; i < this.cards.length; ++i) {
        this.cards[i].setPos(this.cardsPos[i].x, this.cardsPos[i].y - this.scrollPos.y);
      }
    });
    this.focusObject.on("pointerup", (pointer) => {
      this.accel = this.deltaPos.y / 2;
      this.isPointerDown = false;
    });
  }
  off() {
    this.focusObject.off("pointerdown");
    this.focusObject.off("pointermove");
    this.focusObject.off("pointerup");
  }
  reset(cards = null) {
    // this.camera.scrollX = 0;
    // this.camera.scrollY = 0;
    this.cards = cards;
    this.cardsPos = [];
    if (this.cards != null) {
      let row = Math.ceil(this.cards.length / 5);
      this.range = {
        min: 0,
        max: row * 320  + row * 60 - 600,
      };
      for (let i = 0; i < this.cards.length; ++i) {
        this.cardsPos.push({
          x: this.cards[i].sprite.x,
          y: this.cards[i].sprite.y,
        });
      }
    }
    this.startPos = { x: 0, y: 0 };
    this.temporaryPos = { x: 0, y: 0 };
    this.accel = 0;
    this.deltaPos = { x: 0, y: 0 };
    this.scrollPos = {x: 0, y: 0};
  }
  update() {
    if (this.cards == null || this.cards.length === 0) { return; }

    this.counter++;
    if (this.counter >= this.frame) {
      this.coutner = 0;
      if (!this.isPointerDown) {
        if (Math.abs(this.accel) <= 0.02) { return; }
        console.log("scroll update");
        this.accel *= 0.85;
        this.scrollPos.y += this.accel;
        this.scrollPos.y = Phaser.Math.Clamp(this.scrollPos.y, this.range.min, this.range.max);
        for (let i = 0; i < this.cards.length; ++i) {
          this.cards[i].setPos(this.cardsPos[i].x, this.cardsPos[i].y - this.scrollPos.y);
        }
      }
    }
  }
}