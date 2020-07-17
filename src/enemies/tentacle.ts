import Phaser, { UP } from 'phaser';

enum Direction {
    UP, DOWN, LEFT, RIGHT
}


export default class Tentacle extends Phaser.Physics.Arcade.Sprite {

    private speed = 100;
    private hp = 200;
    private direction = Direction.UP;
    private moveEvent: Phaser.Time.TimerEvent;


    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string) {
        super(scene, x, y, texture, frame);
        this.anims.play('tentacle-anim');
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.tileCollisionHandler, this)
        this.moveEvent = scene.time.addEvent({
            delay: 1500,
            callback: () => {
                this.direction = this.randomDirection(this.direction);
            },
            loop: true
        })
    }

    private tileCollisionHandler(gameObj: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        if (gameObj !== this) return;
        this.direction = this.randomDirection(this.direction);
    }

    private randomDirection(exclude: Direction) {
        const newDirection = Phaser.Math.Between(0, 3);
        return newDirection;
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        switch (this.direction) {
            case Direction.UP: {
                this.setVelocity(0, -this.speed)
                break;
            }
            case Direction.DOWN: {
                this.setVelocity(0, this.speed)
                break;
            }
            case Direction.LEFT: {
                this.setVelocity(-this.speed, 0)
                break;
            }
            case Direction.RIGHT: {
                this.setVelocity(this.speed, 0)
            }
        }
    }

    destroy(fromScene?: boolean) {
        this.moveEvent.destroy();
        super.destroy(fromScene);
    }

}