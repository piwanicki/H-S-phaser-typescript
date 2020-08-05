import Phaser from 'phaser';

const createUglyThingAnims = (anims: Phaser.Animations.AnimationManager) => {

    // Create the animations we need from the sprite spritesheet
    anims.create({
        key: "uglyThing-anim",
        frames: anims.generateFrameNames("uglyThing", { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
    });

}

export default createUglyThingAnims;