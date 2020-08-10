import Phaser from "phaser";
import { animsKeys } from "./animsKeys";

const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Create the animations we need from the sprite spritesheet
  anims.create({
    key: animsKeys.PLAYER.stand,
    frames: anims.generateFrameNames("player", { start: 0, end: 19 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: animsKeys.PLAYER.move,
    frames: anims.generateFrameNames("player", { start: 20, end: 29 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: animsKeys.PLAYER.attack,
    frames: anims.generateFrameNames("player", { start: 30, end: 39 }),
    frameRate: 30,
  });

  anims.create({
    key: animsKeys.PLAYER.dead,
    frames: anims.generateFrameNames("player", { start: 40, end: 49 }),
    frameRate: 10,
  });
};

export default createPlayerAnims;
