import Phaser from 'phaser';

const createTentacleAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "tentacle-anim",
        frames: anims.generateFrameNames("tentacle", { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1,
    });
}

export default createTentacleAnims;