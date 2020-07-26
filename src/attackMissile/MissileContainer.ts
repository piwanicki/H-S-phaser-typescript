import Phaser from 'phaser';

export default class MissileContainer extends Phaser.GameObjects.Container {
    private display?: Phaser.GameObjects.Image;

    get physicsBody() {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.display = scene.add.image(0, 0, 'arrowMissile');
        this.add(this.display);
        scene.physics.add.existing(this);
        this.display.setScale(0.8);
        this.physicsBody.setCircle(8, -8, -8);
        scene.add.existing(this);
        this.physicsBody.onOverlap = true;
    };

    

}