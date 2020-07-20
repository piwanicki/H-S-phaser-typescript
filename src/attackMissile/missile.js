export default class Missile extends Phaser.GameObjects.Image {
  constructor(scene, x, y, sprite) {
    super(scene, x, y);
    this.sprite = sprite;
    // this.sprite = sprite;
    // (this.x = x), (this.y = y);
    this.visible = false;
  }
}
