import Phaser from 'phaser';
import {animsKeys} from './animsKeys';

const createTentacleAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: animsKeys.TENTACLE.move,
        frames: anims.generateFrameNames("tentacle", { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1,
    });

    anims.create({
        key: animsKeys.TENTACLE.dead,
        frames: anims.generateFrameNames("deadTentacle", { start: 0, end: 3 }),
        frameRate: 3,
    });
}

export default createTentacleAnims;