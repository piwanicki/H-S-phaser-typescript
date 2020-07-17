export default class TilemapVisibility {
  constructor(shadowLayer) {
    this.shadowLayer = shadowLayer;
    this.activeRoom = null;
  }

  setActiveRoom(room) {
    // Only update if the active room has changed
    if (this.activeRoom !== room) {
      this.setRoomAlpha(room, 0); //Make the new room visible
      if (this.activeRoom) this.setRoomAlpha(this.activeRoom, 0.5); //add shadow to old room
      this.activeRoom = room;
    }
  }

  // set alpha for all tiles
  setRoomAlpha(room, alpha) {
    this.shadowLayer.forEachTile(
      (tile) => (tile.alpha = alpha),
      this,
      room.x,
      room.y,
      room.width,
      room.height
    );
  }
}
