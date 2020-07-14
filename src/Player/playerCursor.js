export default class playerCursor {
  constructor(scene, sprite) {
    //this.map = map;
    this.scene = scene;

    this.graphics = scene.add.graphics();
    scene.input.setDefaultCursor(
      `url(assets/images/player/cursors/${sprite}), pointer`
    );
  }

  destroy() {
    this.graphics.destroy();
  }
}
