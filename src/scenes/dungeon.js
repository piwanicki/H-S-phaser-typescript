import Phaser from "phaser";
import TILES from "./tileMapping";
import TilemapVisibility from "./TilemapVisibility";
import createTentacleAnims from "../anims/tentacle-anims";
import createPlayerAnims from "../anims/player-anims";
import createUglyThingAnims from "../anims/uglyThing-anims";
import {scenesKeys} from "./scenesKeys";
import DungeonMap from "./dungeon/dungeonGenerator";
import eventsCenter from "../events/eventsCenter";

export default class DungeonScene extends Phaser.Scene {
  initData;
  player;
  dungeon;
  dungeonMap;
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
  tilemap;
  tilesetStuff;
  dungeonMapJson;

  constructor() {
    super(scenesKeys.scenes.DUNGEON);
    // Constructor is called once when the scene is created for the first time. When the scene is
    // stopped/started (or restarted), the constructor will NOT be called again.
    this.level = 1;
  }

  enemyCollisionDmgHandler = (enemy) => {
    const dmg = enemy.dealPhysicalDamage();
    //const dx = this.player.sprite.x - enemy.x;
    //const dy = this.player.sprite.y - enemy.y;
    //const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(2000);
    this.player.takeDamage(dmg);
  };

  playerMissilesCollisionDmgHandler = (missile, enemy) => {
    if (enemy.dead) return;
    const dmg = this.player.damageEnemy(missile);
    enemy.takeDamage(dmg);
  };

  init(data) {
    this.initData = data;
  }

  onWake(sys, data) {
    this.wakeData = data;
  }

  // onSleep(sys) {
  // }

  create() {
    this.events.on("wake", this.onWake, this);
    //this.events.on("sleep", this.onSleep, this);

    this.levelComplete = false;
    this.backToSurface = false;
    createPlayerAnims(this.anims);
    createTentacleAnims(this.anims);
    createUglyThingAnims(this.anims);

    let music = this.sound.add("dungeonTheme");
    //music.play();

    // Create a blank tilemap with dimensions matching the dungeon
    this.tilemap = this.make.tilemap({
      tileWidth: 32,
      tileHeight: 32,
      width: 50,
      height: 50,
    });

    const dungeonTileset = this.tilemap.addTilesetImage(
      "dungeonTileset",
      "dungeonTileset",
      32,
      32,
      1,
      2
    );
    const dungeon2 = this.tilemap.addTilesetImage(
      "dungeon2",
      "dungeon2",
      32,
      32,
      1,
      2
    );
    this.groundLayer = this.tilemap.createBlankDynamicLayer(
      "groundLayer",
      dungeonTileset
    );
    this.wallsLayer = this.tilemap.createBlankDynamicLayer(
      "wallsLayer",
      dungeonTileset
    );
    this.tilesetStuff = this.tilemap.addTilesetImage(
      "dungeonSet",
      "dungeonSet",
      32,
      32,
      1,
      2
    );
    this.stuffLayer = this.tilemap.createBlankDynamicLayer(
      "stuffLayer",
      this.tilesetStuff
    );

    if (this.wakeData !== undefined) {
      this.player = this.wakeData.PLAYER;
      this.wakeData = undefined;
      // need to save the whole dungeon config with stuff/enemies/ and redraw it isntead of generating a new one
      //this.dungeonMap.generateMap();
    } else {
      this.player = this.initData.PLAYER;
      this.dungeonMap = new DungeonMap(this);
    }
    this.player.initPlayer(this);
    this.dungeon = this.dungeonMap.generateMap();

    // Watch the player and layer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player.sprite, this.wallsLayer);
    this.physics.add.collider(this.player.sprite, this.stuffLayer);
    this.physics.add.overlap(
      this.player.sprite,
      this.dungeonMap.enemies,
      (player, enemy) => {
        this.enemyCollisionDmgHandler(enemy);
      }
    );

    this.physics.add.overlap(
      this.player.missiles,
      this.dungeonMap.enemies,
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
    camera.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
    camera.setZoom(2);

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
            //.player.destroy();
            music.pause();
            this.scene.wake(scenesKeys.scenes.CITY, {PLAYER: this.player});
            this.scene.switch(scenesKeys.scenes.CITY);
          });
        } else {
          this.stuffLayer.setTileIndexCallback(TILES.STAIRS_DOWN, null);
          this.levelComplete = true;
          this.player.freeze();
          camera.fade(250, 0, 0, 0);
          camera.once("camerafadeoutcomplete", () => {
            music.pause();
            this.scene.restart(this.player);
            this.player.destroy();
          });
        }
      }
    });
    const shadowLayer = this.tilemap
      .createBlankDynamicLayer("shadow", dungeonTileset)
      .fill(TILES.BLANK);

    this.tilemapVisibility = new TilemapVisibility(shadowLayer);
  }

  update(time, delta) {
    if (this.levelComplete || this.backToSurface) return;
    this.player.update();

    // Find the player's room using another helper method from the dungeon that converts from dungeon XY (in grid units) to the corresponding room instance
    const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
    const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
    const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);
    this.tilemapVisibility.setActiveRoom(playerRoom);

    // Update enemy only when player is in the room
    this.dungeonMap.enemies.children.iterate((enemy) => {
      const enemyTileX = this.groundLayer.worldToTileX(enemy.x);
      const enemyTileY = this.groundLayer.worldToTileY(enemy.y);
      const enemyRoom = this.dungeon.getRoomAt(enemyTileX, enemyTileY);
      if (enemyRoom === playerRoom) {
        enemy.update();
        enemy.hpBar.bar.setVisible(true);
      } else {
        enemy.hpBar.bar.setVisible(false);
      }
    });
  }
}
