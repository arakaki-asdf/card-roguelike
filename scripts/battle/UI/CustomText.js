/**
 * テキスト表示
 */
class CustomText extends Phaser.GameObjects.GameObject {
    /**
     * コンストラクタ
     * @param {*} param 
     * @param {Pahser.Scene} param.scene
     * @param {number} param.x
     * @param {number} param.y
     * @param {string} param.text
     * @param {number} param.origin
     * @param {number} param.fontSize
     * @param {number} param.fill
     * @param {boolean} param.bold
     */
    constructor(param) {
        super(param.scene);

        param.x ??= 0;
        param.y ??= 0;
        param.fontSize ??= 16;
        param.fill ??= "#ffffff";
        param.text ??= "";
        param.origin ??= 0.5;
        const bold = param.bold === undefined ? "" : "bold";

        this.text = this.scene.make.text({
            x: param.x,
            y: param.y, // - ((param.fontSize - 1) * 2),
            text: param.text,
            origin: param.origin,
            style: {
                font: `${bold} ${param.fontSize}px ${gameOptions.font}`,
                fill: param.fill,
            },
        });
    }

    destroy() {
        super.destroy();
        this.text.destroy();
    }
}