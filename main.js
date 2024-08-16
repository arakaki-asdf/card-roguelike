
// ゲームの全体設定 (jsonとかでも良さそう)
const gameOptions = {
  tweenSpeed: 75,
  // レイヤー
  depth: {
    back: 1,

    default: 3,

    selectCard: 6,
  },
};


// 設定データ
const config = {
  type: Phaser.AUTO,
  width: 1280,                // 画面 幅
  height: 720,                // 画面 高さ
  // width: 960,                // 画面 幅
  // height: 540,                // 画面 高さ
  backgroundColor: 0x242424,  // 背景色
  // scene: [GameScene],         // 初期シーン
  scene: [TitleScene, GameScene],         // 初期シーン
};

const game = new Phaser.Game(config);