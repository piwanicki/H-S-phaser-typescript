export const createFloatingText = (scene, x, y, message, tint, font) => {
  //let animation =scene.add.bitmapText(x, y, font, message).setTint(tint);
  let animation = scene.add.text(x, y, message, {fontSize: 12}).setTint(tint);
  let tween = scene.add.tween({
    targets: animation,
    duration: 750,
    ease: "Exponential.In",
    y: y - 30,
    onComplete: () => {
      animation.destroy();
    },
    callbackScope: this,
  });
};


export const prepareSpriteFromTile = (layer, tile, tileKey, sizeX, sizeY, offstetX, offsetY) => {
  layer.removeTileAt(tile.x, tile.y);
  const x = tile.getCenterX();
  const y = tile.getCenterY();
  const waterEdge = this.waterEdges?.create(x, y, tileKey)
  waterEdge.body.setSize(sizeX, sizeY).setOffset(offstetX, offsetY);
}