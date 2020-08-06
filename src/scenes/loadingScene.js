import {scenesKeys} from "./scenesKeys";
import MenuScene from "./MenuScene";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super(scenesKeys.scenes.LOAD);
  }

  init(data) {
    //console.log(data);
  }

  preload() {
    // custom font
    this.load.bitmapFont(
      "doomed",
      "assets/fonts/doomed.png",
      "assets/fonts/doomed.fnt"
    );
    this.load.bitmapFont(
      "doomed2",
      "assets/fonts/doomed2.png",
      "assets/fonts/doomed2.fnt"
    );

    this.load.image("menuBackground", "assets/images/menu_background.png");
    //this.load.image("gameNameLogo", "assets/images/menu_gameLogo.png");
    this.load.image("menuHoverPointer", "assets/images/menu_hoverPointer.png");

    // buttons
    // this.load.image('startBtn', 'assets/images/menu_background.png');
    // this.load.image('optionsBtn', 'assets/images/menu_background.png');

    // audio
    //this.load.audio('menuTheme', 'assets/audio/menu_theme.mp3');
    this.load.audio("menuTheme2", "assets/audio/menu_theme2.mp3");
    this.load.audio("cityTheme", "assets/audio/city_theme.mp3");
    this.load.audio("dungeonTheme", "assets/audio/dungeon_theme.mp3");

    // player
    this.load.audio("playerDead", "assets/audio/player/dead.mp3");
    this.load.audio("playerHit", "assets/audio/player/hit.mp3");

    // enemy
    this.load.audio("tentacleDead", "assets/audio/enemies/tentacle/dead.mp3");
    this.load.audio("tentacleHit", "assets/audio/enemies/tentacle/hit.mp3");

    this.add.text(
      this.game.renderer.width * 0.45,
      this.game.renderer.height * 0.7,
      "Loading...",
      {
        fontSize: 30,
      }
    );

    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0x989898, // gray
      },
    });

    /*
     loader Events :
      complete - when done loading everything
      progress - loader number progress in decimal
    */

    // simulate large loading
    // for (let i = 0; i < 100; i++) {
    //   this.load.image(
    //     "menuBackground" + i,
    //     "assets/images/menu_background.png"
    //   );
    // }

    // loading city scene preload() {
    this.load.image("tree1", "assets/images/trees/mangrove_2.png");
    this.load.image("tree2", "assets/images/trees/tree_2_lightred.png");
    this.load.image("stone", "assets/images/stone.png");
    this.load.tilemapTiledJSON("map1", "assets/tilemaps/Level1.json");
    this.load.image("dungeonSet", "assets/tilemaps/DungeonCrawl_extruder.png");
    //this.load.image("dungeonSet", "assets/tilemaps/DungeonCrawl.png");

    this.load.image(
      "waterEdge-left",
      "assets/images/waters/deep_water_wave_east.png"
    );
    this.load.image(
      "waterEdge-right",
      "assets/images/waters/deep_water_wave_west.png"
    );
    this.load.image(
      "waterEdge-up",
      "assets/images/waters/deep_water_wave_north.png"
    );
    this.load.image(
      "waterEdge-down",
      "assets/images/waters/deep_water_wave_south.png"
    );
    this.load.image("statusBar", "assets/images/statusBar.png");
    this.load.image("arrowMissile", "assets/images/player/arrow.png");

    // loading dungeon scene preload()
    this.load.image("dungeonSet", "assets/tilemaps/DungeonCrawl_extruder.png");
    this.load.image("dungeonTileset", "assets/tilemaps/Dungeon_Tileset_extruded.png");
    this.load.image("dungeon2", "assets/tilemaps/dungeon_extruder.png");
    // this.load.spritesheet("player", "assets/images/player/deep_elf_male.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    //   margin: 0,
    //   spacing: 0,
    // });

 this.load.spritesheet("player", "assets/images/player/ranger_spritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });

    this.load.spritesheet("player-warrior", "assets/images/player/warrior_spritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });

    this.load.spritesheet("player-thief", "assets/images/player/thief_spritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });


    // tentacle
    this.load.spritesheet("tentacle", "assets/images/enemies/tentacle.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });

    this.load.spritesheet(
      "deadTentacle",
      "assets/images/enemies/deadTentacle.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 0,
        spacing: 0,
      }
    );

    this.load.image("tentacleMissile", "assets/images/enemies/poison.png");

    // uglyThing
    this.load.spritesheet("uglyThing", "assets/images/enemies/ugly_thing.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });

    this.load.image("blood", "assets/images/player/blood.png");

    this.load.on("progress", (percent) => {
      loadingBar.fillRect(
        0,
        this.game.renderer.height * 0.8,
        this.game.renderer.width * percent,
        50
      );
    });

    this.load.on("complete", () => {
      //this.scene.start(scenesKeys.scenes.MENU, "data to pass into next scene");
      this.scene.start(scenesKeys.scenes.DUNGEON, "data to pass into next scene");
      //this.scene.start('Game', "data to pass into next scene");
    });
  }

  create() {}
}
