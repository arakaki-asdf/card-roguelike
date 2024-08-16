/**
 * 汎用ボタン
 * scaleアニメーションを行う
 */
class UIButton extends Phaser.GameObjects.GameObject {
    /**
     * @param {object} param
     * @param {Phaser.Scene} param.scene
     * @param {string} param.name
     * @param {number} param.x
     * @param {number} param.y
     * @param {string} param.text
     * @param {function} param.onClick クリック時のコールバック
     */
    constructor(param) {
        super(param.scene);
        const depth = 7;

        this.button = this.scene.add.sprite(param.x, param.y, param.name);
        this.button.setInteractive();
        this.button.setScale(0.8);
        this.button.depth = depth;
        this.onClick = param.onClick;

        // ボタン範囲外
        this.button.on("pointerout", () => {
            this.scene.tweens.add({
                targets: [this.button],
                scaleX: 0.8,
                scaleY: 0.8,
                duration: gameOptions.tweenSpeed,
                onComplete: () => { },
            });
        });

        // ボタン範囲内
        this.button.on("pointerover", () => {
            this.scene.tweens.add({
                targets: [this.button],
                scaleX: 0.9,
                scaleY: 0.9,
                duration: gameOptions.tweenSpeed,
                onComplete: () => { },
            });
        });

        // ボタンクリック時
        this.button.on("pointerdown", () => {
            // 連打防止
            this.button.disableInteractive();
            this.onClick();
        });
    }

    /**
     * 表示
     */
    visible() {
        this.button.visible = true;
        this.button.setInteractive();
    }

    /**
     * 非表示
     */
    invisible() {
        this.button.visible = false;
        this.button.disableInteractive();
    }
}