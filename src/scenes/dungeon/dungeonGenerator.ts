import Dungeon from "@mikewesthad/dungeon";
import TILES from "../tileMapping";
import EnemyGroup from "../../enemies/EnemyGroup";

// imports Enemies classes
import Tentacle from "../../enemies/enemiesTypes/Tentacle";
import UglyThing from "../../enemies/enemiesTypes/UglyThing";
import { animsKeys } from '~/anims/animsKeys';

export default class DungeonMap {
  private dungeon!: Dungeon;
  private scene!: Phaser.Scene;
  private enemies!: EnemyGroup;

  constructor(scene) {
    this.scene = scene;
    this.dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15, onlyOdd: true },
        height: { min: 7, max: 15, onlyOdd: true },
        maxRooms: 12,
      },
    });

    const enemyGroupConfig = {
      createCallback: (gameObj) => {
        const Obj = gameObj;
        Obj.body.onOverlap = true;
      },
    };
    this.enemies = new EnemyGroup(
      this.scene.physics.world,
      this.scene,
      enemyGroupConfig
    );
  }

  private addEnemyInRoom(enemy) {
    // set active and visible
    this.enemies.add(enemy);
    enemy.setActive(true);
    enemy.setVisible(true);
    //
    this.scene.add.existing(enemy);
    //// update the physics body size
    this.scene.physics.world.enable(enemy);

    enemy.body.setSize(enemy.width, enemy.height);
    return enemy;
  }

  private createTentacle = (
    x: number,
    y: number,
    scene: Phaser.Scene = this.scene,
    texture: string = "tentacle"
  ) => {
    const tentacle = new Tentacle(scene, x, y, texture);
    this.addEnemyInRoom(tentacle);
  };

  private createUglyThing = (
    x: number,
    y: number,
    scene: Phaser.Scene = this.scene,
    texture: string = "uglyThing"
  ) => {
    const uglyThing = new UglyThing(scene, x, y, texture);
    this.addEnemyInRoom(uglyThing);
  };

  private getMap() {
    return this.dungeon;
  }

  private generateMap = () => {

    const wallsLayer = this.scene["wallsLayer"];
    const stuffLayer = this.scene["stuffLayer"];
    const map = this.scene["tilemap"];
    const player = this.scene["player"];
    this.renderDungeon();

    const rooms = this.dungeon.rooms.slice();
    const startRoom = rooms.shift();
    const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(
      0,
      rooms.length * 0.9
    );

    stuffLayer.putTileAt(
      TILES.STAIRS_DOWN,
      endRoom["centerX"],
      endRoom["centerY"]
    );
    stuffLayer.putTileAt(
      TILES.STAIRS_UP,
      startRoom!.centerX - 2,
      startRoom!.centerY
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
    wallsLayer.setCollision(TILES.WALL.TOP);
    wallsLayer.setCollision(TILES.WALL.BOTTOM);
    wallsLayer.setCollision(TILES.WALL.LEFT);
    wallsLayer.setCollision(TILES.WALL.RIGHT);

    wallsLayer.setCollision(TILES.WALL.TOP_LEFT);
    wallsLayer.setCollision(TILES.WALL.TOP_LEFT_1);
    wallsLayer.setCollision(TILES.WALL.TOP_RIGHT);
    wallsLayer.setCollision(TILES.WALL.TOP_RIGHT_1);
    wallsLayer.setCollision(TILES.WALL.BOTTOM_LEFT);
    wallsLayer.setCollision(TILES.WALL.BOTTOM_1);
    wallsLayer.setCollision(TILES.WALL.BOTTOM_LEFT_1);
    wallsLayer.setCollision(TILES.WALL.BOTTOM_RIGHT);
    wallsLayer.setCollision(TILES.WALL.BOTTOM_RIGHT_1);

    wallsLayer.setCollision(TILES.DOOR.LEFT_BOTTOM);
    wallsLayer.setCollision(TILES.DOOR.RIGHT_BOTTOM);
    wallsLayer.setCollision(TILES.DOOR.BOTTOM_LEFT);
    wallsLayer.setCollision(TILES.DOOR.BOTTOM_RIGHT);
    wallsLayer.setCollision(TILES.DOOR.LEFT_TOP);
    wallsLayer.setCollision(TILES.DOOR.RIGHT_TOP);

    //stuffLayer.setCollisionByProperty({collide: true});
    stuffLayer.setCollision(TILES.FOUNTAIN);
    stuffLayer.setCollision(TILES.TOWER);
    stuffLayer.setCollision(TILES.CHEST);
    stuffLayer.setCollision(TILES.STATUE_1);
    stuffLayer.setCollision(TILES.STATUE_2);

    // Place the player in the center of the map. This works because the Dungeon generator places
    // the first room in the center of the map.

    const playerRoom = startRoom;
    const playerX = map.tileToWorldX(playerRoom!["centerX"]);
    const playerY = map.tileToWorldY(playerRoom!["centerY"]);
    player.sprite.x = playerX;
    player.sprite.y = playerY;

    // Place stuffLayer in the 90% "otherRooms"
    otherRooms.forEach((room) => {
      const rand = Math.random();
      const roomCenterOnWorldMap = map.tileToWorldXY(
        room.centerX,
        room.centerY
      );
      if (rand <= 0.05) {
        // 5% chance of HP
        stuffLayer.putTileAt(TILES.HP, room.centerX, room.centerY);
        this.createTentacle(
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50
        );
        this.createTentacle(
          roomCenterOnWorldMap.x - 50,
          roomCenterOnWorldMap.y + 50
        );
        this.createUglyThing(
          roomCenterOnWorldMap.x + 90,
          roomCenterOnWorldMap.y + 10
        );
      } else if (rand <= 0.1) {
        // 10% chance of Mana
        stuffLayer.putTileAt(TILES.MANA, room.centerX, room.centerY);
        this.createTentacle(
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50
        );
        this.createUglyThing(
          roomCenterOnWorldMap.x + 80,
          roomCenterOnWorldMap.y + 80
        );
      } else if (rand <= 0.25) {
        // 25% chance of chest
        stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
        this.createTentacle(
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50
        );
        this.createTentacle(
          roomCenterOnWorldMap.x - 50,
          roomCenterOnWorldMap.y + 50
        );
        this.createUglyThing(
          roomCenterOnWorldMap.x + 100,
          roomCenterOnWorldMap.y + 80
        );
      } else if (rand <= 0.5) {
        // 50% chance of a pot anywhere in the room... except don't block a door!
        const x = Phaser.Math.Between(room.left + 2, room.right - 2);
        const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
        stuffLayer.putTileAt(TILES.PENTAGRAM, x, y);
        this.createTentacle(
          roomCenterOnWorldMap.x + 50,
          roomCenterOnWorldMap.y + 50
        );
        this.createUglyThing(
          roomCenterOnWorldMap.x + 100,
          roomCenterOnWorldMap.y + 80
        );
      } else {
        // 25% of either 2 or 4 towers, depending on the room size
        if (room.height >= 9) {
          stuffLayer.putTileAt(
            TILES.STATUE_1,
            room.centerX - 1,
            room.centerY + 1
          );
          stuffLayer.putTileAt(
            TILES.STATUE_1,
            room.centerX - 1,
            room.centerY - 2
          );
          stuffLayer.putTileAt(
            TILES.STATUE_2,
            room.centerX + 1,
            room.centerY - 2
          );

          stuffLayer.putTileAt(
            TILES.STATUE_2,
            room.centerX + 1,
            room.centerY + 1
          );
          this.createTentacle(
            roomCenterOnWorldMap.x,
            roomCenterOnWorldMap.y + 100
          );
          this.createTentacle(
            roomCenterOnWorldMap.x,
            roomCenterOnWorldMap.y - 100
          );
          this.createUglyThing(
            roomCenterOnWorldMap.x,
            roomCenterOnWorldMap.y
          );
          this.createUglyThing(
            roomCenterOnWorldMap.x + 40,
            roomCenterOnWorldMap.y
          );
        } else {
          stuffLayer.putTileAt(
            TILES.STATUE_1,
            room.centerX - 1,
            room.centerY - 1
          );
          stuffLayer.weightedRandomize(
            TILES.STATUE_2,
            room.centerX + 1,
            room.centerY - 1
          );
          this.createTentacle(
            roomCenterOnWorldMap.x,
            roomCenterOnWorldMap.y + 50
          );
          this.createUglyThing(
            roomCenterOnWorldMap.x + 80,
            roomCenterOnWorldMap.y
          );
        }
      }
    });
    return this.dungeon;
  };


  private renderDungeon() {

    const groundLayer = this.scene["groundLayer"];
    const wallsLayer = this.scene["wallsLayer"];

    this.dungeon.rooms.forEach((room) => {
      // destructuring
      const { x, y, width, height, left, right, top, bottom } = room;
      // Fill the floor
      groundLayer.weightedRandomize(x, y, width, height, TILES.FLOOR);

      // Place the room corners
      wallsLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
      wallsLayer.putTileAt(TILES.WALL.TOP_LEFT_1, left, top + 1);
      wallsLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
      wallsLayer.putTileAt(TILES.WALL.TOP_RIGHT_1, right, top + 1);
      wallsLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);
      wallsLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);

      // // Walls
      wallsLayer.fill(TILES.WALL.TOP, left + 1, top, width - 2, 1);
      wallsLayer.weightedRandomize(
        left + 1,
        top + 1,
        width - 2,
        1,
        TILES.WALL.TOP_FILL
      );
      wallsLayer.fill(TILES.WALL.BOTTOM, left + 1, bottom, width - 2, 1);
      wallsLayer.fill(TILES.WALL.LEFT, left, top + 2, 1, height - 3);
      wallsLayer.fill(TILES.WALL.RIGHT, right, top + 2, 1, height - 3);

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
              wallsLayer.putTileAt(TILES.FLOOR, x + door.x, y + door.y);
              if (door.y === 2) {
                wallsLayer.putTileAt(
                  TILES.WALL.TOP_FILL_NORMAL,
                  x + door.x,
                  y + door.y - 1
                );
              } else {
                wallsLayer.putTileAt(
                  TILES.DOOR.TOP_LEFT,
                  x + door.x,
                  y + door.y - 1
                );
              }
              wallsLayer.putTileAt(
                TILES.DOOR.BOTTOM_LEFT,
                x + door.x,
                y + door.y + 1
              );
            }
            break;
          case width - 1: {
            wallsLayer.putTileAt(TILES.FLOOR, x + door.x, y + door.y);
            wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_TOP_1,
              x + door.x,
              y + door.y - 1
            );
            wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_BOTTOM,
              x + door.x,
              y + door.y + 1
            );
            if (door.y === 2) {
              wallsLayer.putTileAt(
                TILES.WALL.TOP_FILL_NORMAL,
                x + door.x,
                y + door.y - 1
              );
            } else {
              wallsLayer.putTileAt(
                TILES.DOOR.TOP_RIGHT,
                x + door.x,
                y + door.y - 1
              );
            }
            wallsLayer.putTileAt(
              TILES.DOOR.BOTTOM_RIGHT,
              x + door.x,
              y + door.y + 1
            );
          }
        }

        switch (door.y) {
          case 0: {
            wallsLayer.putTileAt(TILES.FLOOR, x + door.x, y + door.y);
            // if (door.x === right - 2) {
            //   wallsLayer.putTileAt(
            //     TILES.WALL.RIGHT,
            //     x + door.x - 1,
            //     y + door.y - 1
            //   );
            // } else {
            //   wallsLayer.putTileAt(
            //     TILES.DOOR.LEFT_TOP,
            //     x + door.x - 1,
            //     y + door.y - 1
            //   );
            // }
            wallsLayer.putTileAt(
              TILES.DOOR.LEFT_TOP,
              x + door.x + 1,
              y + door.y
            );
            wallsLayer.putTileAt(
              TILES.DOOR.TOP_LEFT,
              x + door.x - 1,
              y + door.y + 1
            );

            wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_TOP,
              x + door.x - 1,
              y + door.y
            );

            wallsLayer.putTileAt(
              TILES.DOOR.TOP_RIGHT,
              x + door.x + 1,
              y + door.y + 1
            );
            wallsLayer.removeTileAt(x + door.x, y + door.y + 1);
            break;
          }

          case height - 1: {
            wallsLayer.removeTileAt(x + door.x, y + door.y);
            wallsLayer.putTileAt(
              TILES.DOOR.LEFT_BOTTOM,
              x + door.x - 1,
              y + door.y
            );
            wallsLayer.putTileAt(
              TILES.DOOR.RIGHT_BOTTOM,
              x + door.x + 1,
              y + door.y
            );
          }
        }
      }
    });

  }
}
