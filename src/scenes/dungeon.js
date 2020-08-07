import Phaser from "phaser";
import Dungeon from "@mikewesthad/dungeon";
import Player from "../Player/Player";
import TILES from "./tileMapping";
import TilemapVisibility from "./TilemapVisibility";
import Tentacle from "../enemies/Tentacle";
import UglyThing from "../enemies/UglyThing";
import createTentacleAnims from "../anims/tentacle-anims";
import createPlayerAnims from "../anims/player-anims";
import createUglyThingAnims from "../anims/uglyThing-anims";
import {scenesKeys} from "./scenesKeys";
import EnemyGroup from "~/enemies/EnemyGroup";

export default class DungeonScene extends Phaser.Scene {
  constructor() {
    super(scenesKeys.scenes.DUNGEON);
    // Constructor is called once when the scene is created for the first time. When the scene is
    // stopped/started (or restarted), the constructor will NOT be called again.
    this.level = 1;
  }
  player;
  dungeon;
  groundLayer;
  wallsLayer;
  stuffLayer;
  enemiesLayer;
  tilemapVisibility;
  levelComplete;
  backToSurface;
  tentacle;
  UglyThing;
  enemies;

  addEnemyInRoom(enemy) {
    // set active and visible
    this.enemies.add(enemy);
    enemy.setActive(true);
    enemy.setVisible(true);
    //
    this.add.existing(enemy);
    //// update the physics body size
    this.physics.world.enable(enemy);

    enemy.body.setSize(enemy.width, enemy.height);
    return enemy;
  }

  enemyCollisionDmgHandler = (enemy) => {
    const dmg = enemy.dealPhysicalDamage();
    //const dx = this.player.sprite.x - enemy.x;
    //const dy = this.player.sprite.y - enemy.y;
    //const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(2000);
    this.player.takeDamage(dmg);
  };

  playerMissilesCollisionDmgHandler = (missile, enemy) => {
    const dmg = this.player.damageEnemy(missile);
    enemy.takeDamage(dmg);
  };

  create() {
    this.levelComplete = false;
    this.backToSurface = false;
    createPlayerAnims(this.anims);
    createTentacleAnims(this.anims);
    createUglyThingAnims(this.anims);

    let music = this.sound.add("dungeonTheme");
    //music.play();

    // Generate a random world
    this.dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: {min: 7, max: 15, onlyOdd: true},
        height: {min: 7, max: 15, onlyOdd: true},
        maxRooms: 12,
      },
    });

    // Create a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 32,
      tileHeight: 32,
      width: this.dungeon.width,
      height: this.dungeon.height,
    });

    const dungeonTileset = map.addTilesetImage(
      "dungeonTileset",
      "dungeonTileset",
      32,
      32,
      1,
      2
    );
    const dungeon2 = map.addTilesetImage("dungeon2", "dungeon2", 32, 32, 1, 2);
    this.groundLayer = map.createBlankDynamicLayer(
      "groundLayer",
      dungeonTileset
    );
    this.wallsLayer = map.createBlankDynamicLayer("wallsLayer", dungeonTileset);
    const tilesetStuff = map.addTilesetImage(
      "dungeonSet",
      "dungeonSet",
      32,
      32,
      1,
      2
    );
    this.stuffLayer = map.createBlankDynamicLayer("stuffLayer", tilesetStuff);

    this.dungeon.rooms.forEach((room) => {
      // destructuring
      const {x, y, width, height, left, right, top, bottom} = room;
      // Fill the floor
      this.groundLayer.weightedRandomize(x, y, width, height, TILES.FLOOR);

      // Place the room corners
      this.wallsLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
      this.wallsLayer.putTileAt(TILES.WALL.TOP_LEFT_1, left, top + 1);
      this.wallsLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
      this.wallsLayer.putTileAt(TILES.WALL.TOP_RIGHT_1, right, top + 1);
      this.wallsLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);
      this.wallsLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);

      // // Walls
      this.wallsLayer.fill(TILES.WALL.TOP, left + 1, top, width - 2, 1);
      this.wallsLayer.weightedRandomize(
        left + 1,
        top + 1,
        width - 2,
        1,
        TILES.WALL.TOP_FILL
      );
      this.wallsLayer.fill(TILES.WALL.BOTTOM, left + 1, bottom, width - 2, 1);
      this.wallsLayer.fill(TILES.WALL.LEFT, left, top + 2, 1, height - 3);
      this.wallsLayer.fill(TILES.WALL.RIGHT, right, top + 2, 1, height - 3);

      // add doors
      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
      // room's location. Each direction has a different door to tile mapping.
      const doors = room.getDoorLocations();

      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];

        // depends on which wall door is, put different entrance to next room
        switch (door.x) {
          case 0:
            {
              this.wallsLayer.putTileAt(TILES.FLOOR, x + door.x, y + door.y);
              if (door.y === 2) {
                this.wallsLayer.putTileAt(
                  TILES.WALL.TOP_FILL_NORMAL,
                  x + door.x,
                  y + door.y - 1
                );
              } else {
                this.wallsLayer.putTileAt(
                  TILES.DOOR.TOP_LEFT,
                  x + door.x,
                  y + door.y - 1
                );
              }
              this.wallsLayer.putTileAt(
                TILES.DOOR.BOTTOM_LEFT,
                x + door.x,
                y + door.y + 1
              );
            }
            break;
          case width - 1: {
            this.wallsLayer.putTileAt(TILES.FLOOR, x + door.x, y + door.y);
            this.wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_TOP_1,
              x + door.x,
              y + door.y - 1
            );
            this.wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_BOTTOM,
              x + door.x,
              y + door.y + 1
            );
            if (door.y === 2) {
              this.wallsLayer.putTileAt(
                TILES.WALL.TOP_FILL_NORMAL,
                x + door.x,
                y + door.y - 1
              );
            } else {
              this.wallsLayer.putTileAt(
                TILES.DOOR.TOP_RIGHT,
                x + door.x,
                y + door.y - 1
              );
            }
            this.wallsLayer.putTileAt(
              TILES.DOOR.BOTTOM_RIGHT,
              x + door.x,
              y + door.y + 1
            );
          }
        }

        switch (door.y) {
          case 0: {
            this.wallsLayer.putTileAt(TILES.FLOOR, x + door.x, y + door.y);
            // if (door.x === right - 2) {
            //   this.wallsLayer.putTileAt(
            //     TILES.WALL.RIGHT,
            //     x + door.x - 1,
            //     y + door.y - 1
            //   );
            // } else {
            //   this.wallsLayer.putTileAt(
            //     TILES.DOOR.LEFT_TOP,
            //     x + door.x - 1,
            //     y + door.y - 1
            //   );
            // }
            this.wallsLayer.putTileAt(
              TILES.DOOR.LEFT_TOP,
              x + door.x + 1,
              y + door.y
            );
            this.wallsLayer.putTileAt(
              TILES.DOOR.TOP_LEFT,
              x + door.x - 1,
              y + door.y + 1
            );

            this.wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_TOP,
              x + door.x - 1,
              y + door.y
            );

            this.wallsLayer.putTileAt(
              TILES.DOOR.TOP_RIGHT,
              x + door.x + 1,
              y + door.y + 1
            );
            this.wallsLayer.removeTileAt(x + door.x, y + door.y + 1);
            break;
          }

          case height - 1: {
            this.wallsLayer.removeTileAt(x + door.x, y + door.y);
            this.wallsLayer.putTileAt(
              TILES.DOOR.LEFT_BOTTOM,
              x + door.x - 1,
              y + door.y
            );
            this.wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_BOTTOM,
              x + door.x + 1,
              y + door.y
            );
          }
        }
      }
    });

    const rooms = this.dungeon.rooms.slice();
    const startRoom = rooms.shift();
    const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(
      0,
      rooms.length * 0.9
    );

    this.stuffLayer.putTileAt(
      TILES.STAIRS_DOWN,
      endRoom.centerX,
      endRoom.centerY
    );
    this.stuffLayer.putTileAt(
      TILES.STAIRS_UP,
      startRoom.centerX - 2,
      startRoom.centerY
    );

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    // wall 1123-1126
    //const mappedTiles = this.dungeon.getMappedTiles({
    //  empty: -1,
    //  floor: 105,
    //  door: 1124,
    //  wall: 1043,
    //});
    //groundLayer.putTilesAt(mappedTiles, 0, 0);

    // We only need one tile index (the wallsLayer) to be colliding for now

    // move collision to property in tiled
    this.wallsLayer.setCollision(TILES.WALL.TOP);
    this.wallsLayer.setCollision(TILES.WALL.BOTTOM);
    this.wallsLayer.setCollision(TILES.WALL.LEFT);
    this.wallsLayer.setCollision(TILES.WALL.RIGHT);

    this.wallsLayer.setCollision(TILES.WALL.TOP_LEFT);
    this.wallsLayer.setCollision(TILES.WALL.TOP_LEFT_1);
    this.wallsLayer.setCollision(TILES.WALL.TOP_RIGHT);
    this.wallsLayer.setCollision(TILES.WALL.TOP_RIGHT_1);
    this.wallsLayer.setCollision(TILES.WALL.BOTTOM_LEFT);
    this.wallsLayer.setCollision(TILES.WALL.BOTTOM_1);
    this.wallsLayer.setCollision(TILES.WALL.BOTTOM_LEFT_1);
    this.wallsLayer.setCollision(TILES.WALL.BOTTOM_RIGHT);
    this.wallsLayer.setCollision(TILES.WALL.BOTTOM_RIGHT_1);

    this.wallsLayer.setCollision(TILES.DOOR.LEFT_BOTTOM);
    this.wallsLayer.setCollision(TILES.DOOR.RIGHT_BOTTOM);
    this.wallsLayer.setCollision(TILES.DOOR.BOTTOM_LEFT);
    this.wallsLayer.setCollision(TILES.DOOR.BOTTOM_RIGHT);
    this.wallsLayer.setCollision(TILES.DOOR.LEFT_TOP);
    this.wallsLayer.setCollision(TILES.DOOR.RIGHT_TOP);

    //this.stuffLayer.setCollisionByProperty({collide: true});
    this.stuffLayer.setCollision(TILES.FOUNTAIN);
    this.stuffLayer.setCollision(TILES.TOWER);
    this.stuffLayer.setCollision(TILES.CHEST);
    this.stuffLayer.setCollision(TILES.STATUE_1);
    this.stuffLayer.setCollision(TILES.STATUE_2);

    // Place the player in the center of the map. This works because the Dungeon generator places
    // the first room in the center of the map.

    const axe = "axe.cur";
    const playerRoom = startRoom;
    const playerX = map.tileToWorldX(playerRoom.centerX);
    const playerY = map.tileToWorldY(playerRoom.centerY);
    this.player = new Player(this, "player", playerX, playerY, axe, map);
    this.stuffLayer.putTileAt(
      TILES.STAIRS_UP,
      this.player.sprite.x + 50,
      this.player.sprite.y
    );

    this.enemiesLayer = map.createBlankDynamicLayer(
      "enemies",
      tilesetStuff,
      0,
      0
    );

    const enemyGroupConfig = {
      createCallback: (gameObj) => {
        const Obj = gameObj;
        Obj.body.onOverlap = true;
      },
    };

    this.enemies = new EnemyGroup(this.physics.world, this, enemyGroupConfig);

    // Place stuffLayer in the 90% "otherRooms"
    otherRooms.forEach((room) => {
      const rand = Math.random();
      const roomCenterOnWorldMap = map.tileToWorldXY(
        room.centerX,
        room.centerY
      );
      if (rand <= 0.05) {
        // 5% chance of chest
        this.stuffLayer.putTileAt(TILES.HP, room.centerX, room.centerY);
        const tentacle = new Tentacle(
          this,
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50,
          "tentacle"
        );
        this.addEnemyInRoom(tentacle);
        const uglyThing = new UglyThing(
          this,
          roomCenterOnWorldMap.x + 100,
          roomCenterOnWorldMap.y + 80,
          "uglyThing"
        );
        this.addEnemyInRoom(uglyThing);
      } else if (rand <= 0.1) {
        // 10% chance of Mana
        this.stuffLayer.putTileAt(TILES.MANA, room.centerX, room.centerY);
        const tentacle = new Tentacle(
          this,
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50,
          "tentacle"
        );
        this.addEnemyInRoom(tentacle);
        const uglyThing = new UglyThing(
          this,
          roomCenterOnWorldMap.x + 80,
          roomCenterOnWorldMap.y + 80,
          "uglyThing"
        );
        this.addEnemyInRoom(uglyThing);
      } else if (rand <= 0.25) {
        // 25% chance of chest
        this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
        const tentacle = new Tentacle(
          this,
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50,
          "tentacle"
        );
        this.addEnemyInRoom(tentacle);
        const uglyThing = new UglyThing(
          this,
          roomCenterOnWorldMap.x + 100,
          roomCenterOnWorldMap.y + 80,
          "uglyThing"
        );
        this.addEnemyInRoom(uglyThing);
      } else if (rand <= 0.5) {
        // 50% chance of a pot anywhere in the room... except don't block a door!
        const x = Phaser.Math.Between(room.left + 2, room.right - 2);
        const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
        this.stuffLayer.putTileAt(TILES.PENTAGRAM, x, y);
        const tentacle = new Tentacle(
          this,
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50,
          "tentacle"
        );
        this.addEnemyInRoom(tentacle);
        const uglyThing = new UglyThing(
          this,
          roomCenterOnWorldMap.x + 100,
          roomCenterOnWorldMap.y + 80,
          "uglyThing"
        );
        this.addEnemyInRoom(uglyThing);
      } else {
        // 25% of either 2 or 4 towers, depending on the room size
        if (room.height >= 9) {
          this.stuffLayer.putTileAt(
            TILES.STATUE_1,
            room.centerX - 1,
            room.centerY + 1
          );
          this.stuffLayer.putTileAt(
            TILES.STATUE_1,
            room.centerX - 1,
            room.centerY - 2
          );
          this.stuffLayer.putTileAt(
            TILES.STATUE_2,
            room.centerX + 1,
            room.centerY - 2
          );

          this.stuffLayer.putTileAt(
            TILES.STATUE_2,
            room.centerX + 1,
            room.centerY + 1
          );
          const tentacle = new Tentacle(
            this,
            roomCenterOnWorldMap.x + 80,
            roomCenterOnWorldMap.y + 50,
            "tentacle"
          );
          this.addEnemyInRoom(tentacle);
          const uglyThing = new UglyThing(
            this,
            roomCenterOnWorldMap.x - 50,
            roomCenterOnWorldMap.y,
            "uglyThing"
          );
          this.addEnemyInRoom(uglyThing);
        } else {
          this.stuffLayer.putTileAt(
            TILES.STATUE_1,
            room.centerX - 1,
            room.centerY - 1
          );
          this.stuffLayer.weightedRandomize(
            TILES.STATUE_2,
            room.centerX + 1,
            room.centerY - 1
          );
          const tentacle = new Tentacle(
            this,
            roomCenterOnWorldMap.x + 80,
            roomCenterOnWorldMap.y + 50,
            "tentacle"
          );
          const uglyThing = new UglyThing(
            this,
            roomCenterOnWorldMap.x + 100,
            roomCenterOnWorldMap.y + 10,
            "uglyThing"
          );
          this.addEnemyInRoom(uglyThing);
          this.addEnemyInRoom(tentacle);
        }
      }
    });

    // Watch the player and layer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player.sprite, this.wallsLayer);
    this.physics.add.collider(this.player.sprite, this.stuffLayer);
    this.physics.add.overlap(
      this.player.sprite,
      this.enemies,
      (player, enemy) => {
        this.enemyCollisionDmgHandler(enemy);
      }
    );

    this.physics.add.overlap(
      this.player.missiles,
      this.enemies,
      (missile, enemy) => {
        this.playerMissilesCollisionDmgHandler(missile, enemy);
      }
    );

    this.physics.add.collider(
      this.player.missiles,
      this.wallsLayer,
      (missile) => {
        this.player.hitWithMissile(missile);
      }
    );

    this.physics.add.collider(
      this.player.missiles,
      this.stuffLayer,
      (missile) => {
        this.player.hitWithMissile(missile);
      }
    );

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2);

    // Help text that has a "fixed" position on the screen
    // this.add.text(
    //   this.scale.width * 2.6,
    //   `Slash'em All!! :  Level : ${this.level}`,
    //   {
    //     font: "18px monospace",
    //     fill: "#000000",
    //     padding: {x: 20, y: 10},
    //     backgroundColor: "#ffffff",
    //   }
    // );
    // //.setScrollFactor(-2);

    // add tileIndex callback
    this.stuffLayer.setTileIndexCallback(TILES.STAIRS_DOWN, (sprite) => {
      if (sprite === this.player.sprite) {
        this.stuffLayer.setTileIndexCallback(TILES.STAIRS_DOWN, null);
        this.levelComplete = true;
        this.level++;
        this.player.freeze();
        camera.fade(250, 0, 0, 0);
        camera.once("camerafadeoutcomplete", () => {
          music.pause();
          this.player.destroy();
          this.scene.restart();
        });
      }
    });

    this.stuffLayer.setTileIndexCallback(TILES.STAIRS_UP, (sprite) => {
      if (sprite === this.player.sprite) {
        if (this.level === 1) {
          this.backToSurface = true;
          this.stuffLayer.setTileIndexCallback(TILES.STAIRS_DOWN, null);
          this.player.freeze();
          camera.fade(250, 0, 0, 0);
          camera.once("camerafadeoutcomplete", () => {
            this.player.destroy();
            this.scene.start(scenesKeys.scenes.CITY);
            music.pause();
          });
        } else {
          this.stuffLayer.setTileIndexCallback(TILES.STAIRS_DOWN, null);
          this.levelComplete = true;
          this.player.freeze();
          camera.fade(250, 0, 0, 0);
          camera.once("camerafadeoutcomplete", () => {
            music.pause();
            this.player.destroy();
            this.scene.restart();
          });
        }
      }
    });
    const shadowLayer = map
      .createBlankDynamicLayer("shadow", dungeonTileset)
      .fill(TILES.BLANK);

    this.tilemapVisibility = new TilemapVisibility(shadowLayer);
  }

  update(time, delta) {
    if (this.levelComplete || this.backToSurface) return;
    this.player.update();

    //const tentacleRoom = this.dungeon.getRoomAt(this.enemies, this.enemies);
    //console.log(tentacleRoom)

    // Find the player's room using another helper method from the dungeon that converts from dungeon XY (in grid units) to the corresponding room instance
    const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
    const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
    const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);
    this.tilemapVisibility.setActiveRoom(playerRoom);

    // Update enemy only when player is in the room
    this.enemies.children.iterate((enemy) => {
      const enemyTileX = this.groundLayer.worldToTileX(enemy.x);
      const enemyTileY = this.groundLayer.worldToTileY(enemy.y);
      const enemyRoom = this.dungeon.getRoomAt(enemyTileX, enemyTileY);
      if (enemyRoom === playerRoom) {
        enemy.update();
      }
    });
  }
}
