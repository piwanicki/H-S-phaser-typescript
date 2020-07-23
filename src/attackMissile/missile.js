export default class Missile extends Phaser.GameObjects.Image {
  constructor(scene, sprite) {
    super(scene);
    this.sprite = sprite;
    this.visible = false;
  }
}
