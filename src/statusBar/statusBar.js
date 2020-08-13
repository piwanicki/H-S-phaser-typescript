export default class StatusBar {
  constructor(scene, x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.maxValue = value;
    this.init(scene);
  }

  init(scene) {
    this.scene = scene;
    this.bar = new Phaser.GameObjects.Graphics(scene);
    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.value -= amount;
    if (this.value < 0) {
      this.value = 0;
    }
    if (this.value === 0) {
      this.bar.destroy();
      return;
    }
    this.drawMiniHPBar();
  }

  drawMiniHPBar() {
    this.bar.clear();
    //  BG
    this.bar.fillStyle(0x989898);
    this.bar.fillRect(this.x, this.y - 8, 32, 5);

    //  Health
    //this.bar.fillStyle(0x989898);
    this.bar.fillRect(this.x, this.y - 8, 32, 5);

    if (this.value / this.maxValue < 0.5 && this.value / this.maxValue > 0.3) {
      this.bar.fillStyle(0xffff00);
    } else if (this.value / this.maxValue < 0.3) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x11c10e);
    }

    const hp = (this.value / this.maxValue) * 32;
    this.bar.fillRect(this.x, this.y - 8, hp, 5);
  }

  update(delta, time) {
    this.drawMiniHPBar();
  }
}
