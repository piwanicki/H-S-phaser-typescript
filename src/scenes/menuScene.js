import {scenesKeys} from "./scenesKeys";

export default class MenuScene extends Phaser.Scene {
  newGameBtn;
  optionsBtn;

  constructor() {
    super(scenesKeys.scenes.MENU);
  }

  create() {
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

    let music = this.sound.add("menuTheme2");
    this.sound.pauseOnBlur = false;
    //music.play();

    this.add.bitmapText(
      this.game.renderer.width / 3,
      this.game.renderer.height * 0.15,
      "doomed2",
      "Slash'Yt",
      140
    );

    this.newGameBtn = this.add.bitmapText(
      this.game.renderer.width / 2.4,
      this.game.renderer.height * 0.7,
      "doomed",
      "New Game",
      64
    );

    this.optionsBtn = this.add.bitmapText(
      this.game.renderer.width / 2.35,
      this.game.renderer.height * 0.85,
      "doomed",
      "Options",
      64
    );

    this.newGameBtn.setInteractive();
    this.optionsBtn.setInteractive();

    this.newGameBtn.on("pointerover", () => {
      hoverPointer.setVisible(true);
      hoverPointer.x = this.newGameBtn.x - this.newGameBtn.width + 270;
      hoverPointer.y = this.newGameBtn.y + 40;
    });

    this.newGameBtn.on("pointerout", () => {
      hoverPointer.setVisible(false);
    });

    this.newGameBtn.on("pointerdown", () => {
      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.launch(scenesKeys.scenes.GAME_UI);
        this.scene.start(scenesKeys.scenes.CITY);
        music.pause();
      });
    });

    this.optionsBtn.on("pointerover", () => {
      hoverPointer.setVisible(true);
      hoverPointer.x = this.optionsBtn.x - this.optionsBtn.width + 230;
      hoverPointer.y = this.optionsBtn.y + 40;
    });

    this.optionsBtn.on("pointerout", () => {
      hoverPointer.setVisible(false);
    });

    let hoverPointer = this.add.image(
      this.game.renderer.width / 2.3,
      this.game.renderer.height * 0.85,
      "menuHoverPointer"
    );

    hoverPointer.setScale(2);
    hoverPointer.setVisible(false);
  }
}
