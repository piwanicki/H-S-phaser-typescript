import {scenesKeys} from "./scenesKeys";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super(scenesKeys.scenes.MENU);
  }

  init(data) {
    console.log(data);
  }

  create() {
    //this.add.image(0,0,'menuBackground').setOrigin(0);

    // scale and stretch background image
    let backgroundImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "menuBackground"
    );
    let scaleX = this.cameras.main.width / backgroundImage.width;
    let scaleY = this.cameras.main.height / backgroundImage.height;
    let scale = Math.max(scaleX, scaleY);
    backgroundImage.setScale(scale).setScrollFactor(0);

    this.add.image(
      this.game.renderer.width / 2,
      this.game.renderer.height * 0.2,
      "gameNameLogo"
    );

    this.add.text(
      this.game.renderer.width / 2.3,
      this.game.renderer.height * 0.7,
      "New Game",
      {
        fontSize: 50,
        align: "center",
        shadowColor: "black",
        fontStyle: "bold",
      }
    );
    this.add.text(
      this.game.renderer.width / 2.3,
      this.game.renderer.height * 0.85,
      "Options",
      {
        fontSize: 50,
        align: "center",
        shadowColor: "black",
        fontStyle: "bold",
      }
    );
  }
}
