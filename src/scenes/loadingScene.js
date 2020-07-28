import {scenesKeys} from "./scenesKeys";
import MenuScene from "./menuScene";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super(scenesKeys.scenes.LOAD);
  }

  init(data) {
    //console.log(data);
  }

  preload() {
    this.load.image("menuBackground", "assets/images/menu_background.png");

    this.load.image("gameNameLogo", "assets/images/menu_gameLogo.png");

    // buttons
    // this.load.image('startBtn', 'assets/images/menu_background.png');
    // this.load.image('optionsBtn', 'assets/images/menu_background.png');

    // audio
    // this.load.audio('menuBackground', 'assets/music/menu_music.mp3');

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

    //simulate large loading
    // for (let i = 0; i < 100; i++) {
    //   this.load.image(
    //     "menuBackground" + i,
    //     "assets/images/menu_background.png"
    //   );
    // }

    this.load.on("progress", (percent) => {
      loadingBar.fillRect(
        0,
        this.game.renderer.height * 0.8,
        this.game.renderer.width * percent,
        50
      );
    });

    this.load.on("complete", () => {
      this.scene.start(scenesKeys.scenes.MENU, "data to pass into next scene");
    });
  }

  create() {}
}
