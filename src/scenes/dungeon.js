import Phaser from "phaser";
import Dungeon from "@mikewesthad/dungeon";
import Player from "../Player/player";

export default class DungeonScene extends Phaser.Scene {
  constructor() {
    super("dungeonMap");
  }
  player;

  preload() {
    this.load.image("dungeonSet", "../assets/tilemaps/DungeonCrawl.png");
    this.load.spritesheet("player", "assets/images/player/deep_elf_male.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
  }

  create() {
    // Generate a random world
    const dungeon = new Dungeon({
      width: 50,
      height: 50,
      rooms: {
        width: {min: 7, max: 15},
        height: {min: 7, max: 15},
        maxRooms: 12,
      },
    });

    // Create a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 32,
      tileHeight: 32,
      width: dungeon.width,
      height: dungeon.height,
    });
    const tilesetMap = map.addTilesetImage("dungeonSet", null, 32, 32, 0, 0);
    const layer = map.createBlankDynamicLayer("Layer 1", tilesetMap);

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    // wall 1123-1126
    const mappedTiles = dungeon.getMappedTiles({
      empty: -1,
      floor: 1155,
      door: 1124,
      wall: 1043,
    });
    layer.putTilesAt(mappedTiles, 0, 0);
    layer.setCollision(1043); // We only need one tile index (the walls) to be colliding for now

    // Place the player in the center of the map. This works because the Dungeon generator places
    // the first room in the center of the map.

    const axe = "axe.cur";
    this.player = new Player(
      this,
      "player",
      map.widthInPixels / 2,
      map.heightInPixels / 2,
      axe,
      map
    );

    // Watch the player and layer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player.sprite, layer);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2.6);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(this.scale.width * 2.6, "Slash'em All!!", {
        font: "18px monospace",
        fill: "#000000",
        padding: {x: 20, y: 10},
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0).set
  }

  update(time, delta) {
    this.player.update();
  }
}

