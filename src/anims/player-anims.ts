import Phaser from 'phaser';

const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {

  // Create the animations we need from the sprite spritesheet
  anims.create({
    key: "player-stand",
    frames: anims.generateFrameNames("player", { start: 0, end: 19 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "player-walk",
    frames: anims.generateFrameNames("player", { start: 20, end: 29 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "player-attack",
    frames: anims.generateFrameNames("player", { start: 30, end: 39 }),
    frameRate: 30,
  });

  anims.create({
    key: "player-dead",
    frames: anims.generateFrameNames("player", { start: 40, end: 49 }),
    frameRate: 10,
  });

}

export default createPlayerAnims;