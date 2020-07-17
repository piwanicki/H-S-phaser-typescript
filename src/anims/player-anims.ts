import Phaser from 'phaser';

const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {

    // Create the animations we need from the sprite spritesheet
    anims.create({
      key: "player-stand",
      frames: anims.generateFrameNames("player", {start: 1, end: 3}),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "player-left-walk",
      frames: anims.generateFrameNames("player", {start: 5, end: 6}),
      frameRate: 5,
      repeat: -1,
    });
    anims.create({
      key: "player-right-walk",
      frames: anims.generateFrameNames("player", {start: 7, end: 8}),
      frameRate: 5,
      repeat: -1,
    });

}

export default createPlayerAnims;