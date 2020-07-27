import Phaser from 'phaser';
import StatusBar from '~/statusBar/statusBar';

enum Direction {
    UP, DOWN, LEFT, RIGHT
}


export default class Tentacle extends Phaser.Physics.Arcade.Sprite {

    //private speed = 100;
    private hp = 200;
    private direction = Direction.UP;
    private moveEvent?: Phaser.Time.TimerEvent;
    private hpBar: StatusBar;
    private attack = 20;
    private level = 1;
    private fireRate = 1000;
    private nextAttack = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string) {
        super(scene, x, y, texture, frame);
        this.anims.play('tentacle-anim');
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.dealDamage, this)
        this.moveEvent = scene.time.addEvent({
            //delay: 1000,
            // callback: () => {

            //     
            //     this.direction = this.randomDirection(this.direction);
            // },
            //loop: true
            //}
        })
        this.hpBar = new StatusBar(scene, x, y, this.hp)
        const gameObject = scene.physics.add.existing(this);
        gameObject.body.moves = false;
    }

    // private tileCollisionHandler(gameObj: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    //     if (gameObj !== this) return;
    //     this.direction = this.randomDirection(this.direction);
    // }

    // private randomDirection(exclude: Direction) {
    //     let newDirection = Phaser.Math.Between(0, 3);
    //     while (newDirection === exclude) {
    //         newDirection = Phaser.Math.Between(0, 3);
    //     }
    //     return newDirection;
    // }

    private takeDamage(dmg: number) {
        this.hp -= dmg;
        this.hpBar.decrease(dmg);
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    private dealDamage() {
        if(this.scene.time.now >= this.nextAttack) {
            const dmg = this.attack * this.level;
            const outDmg = Phaser.Math.Between(dmg, 1.2 * dmg)
            this.nextAttack = this.scene.time.now + this.fireRate;
            return outDmg;
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        // switch (this.direction) {
        //     case Direction.UP: {
        //         this.setVelocity(0, -this.speed)
        //         break;
        //     }
        //     case Direction.DOWN: {
        //         this.setVelocity(0, this.speed)
        //         break;
        //     }
        //     case Direction.LEFT: {
        //         this.setVelocity(-this.speed, 0)
        //         break;
        //     }
        //     case Direction.RIGHT: {
        //         this.setVelocity(this.speed, 0)
        //     }
        // }
    }

    update(time: number, delta: number) {
        this.hpBar.x = this.body.position.x;
        this.hpBar.y = this.body.position.y;
        this.hpBar.update(time, delta);
    }

    destroy(fromScene?: boolean) {
        //this.moveEvent.destroy();
        super.destroy(fromScene);
    }

}