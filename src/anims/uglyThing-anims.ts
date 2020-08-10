import Phaser from 'phaser';
import {animsKeys} from './animsKeys';

const createUglyThingAnims = (anims: Phaser.Animations.AnimationManager) => {

    // Create the animations we need from the sprite spritesheet
    anims.create({
        key: animsKeys.UGLYTHING.move,
        frames: anims.generateFrameNames("uglyThing", { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
    });

    anims.create({
        key: animsKeys.UGLYTHING.dead,
        frames: anims.generateFrameNames("deadTentacle", { start: 0, end: 3 }),
        frameRate: 3,
    });

}

export default createUglyThingAnims;