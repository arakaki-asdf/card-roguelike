/**
 * 戦闘時の攻撃エフェクト
 */
class DamageEffect extends Phaser.GameObjects.GameObject {
  constructor(param) {
    super(param.scene);

    this.particles = this.scene.add.particles('circle');
    this.particles.depth = 3;

    this.redEmitter = this.particles.createEmitter({
      lifespan: 1400,
      speed: {
        min: 150,
        max: 450,
      },

      alpha: {
        start: 1.0,
        end: 0.0,
        ease: 'Expo.easeOut'
      },

      angle: {
        min: -30,
        max: 300,
        steps: 6,
      },
      scale: {
        min: 0.05,
        max: 0.25,
        ease: 'Expo.easeIn'
      },
      tint: 0xef1717,
      gravityY: 1000,
      blendMode: 'ADD',
      on: false,
    });
  }

  play(x, y) {
    var amount = Phaser.Math.Between(16, 18);
    this.redEmitter.explode(amount, x, y);
  }

}