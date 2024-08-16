
// ゲームの全体設定 (jsonとかでも良さそう)
const gameOptions = {
  tweenSpeed: 75,
};

// ゲーム用汎用処理
const Common = {
  /**
   * X座標をパーセント(0~100)で指定
   * @param {number} percent 割合 0~100
   * @returns X座標
   */
  posX(percent) {
    return config.width * 0.01 * percent;
  },

  /**
   * Y座標をパーセント(0~100)で指定
   * @param {number} percent 割合 0~100
   * @returns X座標
   */
  posY(percent) {
    return config.height * 0.01 * percent;
  },
}

// 設定データ
const config = {
  type: Phaser.AUTO,
  width: 1280,                // 画面 幅
  height: 720,                // 画面 高さ
  backgroundColor: 0x242424,  // 背景色
  scene: [TitleScene, BattleScene],         // 初期シーン
};

const game = new Phaser.Game(config);