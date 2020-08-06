import Phaser from 'phaser';
import StatusBar from '~/statusBar/StatusBar';
import MissileContainer from '../attackMissile/MissileContainer';
import { createFloatingText } from '../scenes/UIScene/UIFunctions';

enum Direction {
    UP, DOWN, LEFT, RIGHT
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    private speed;
    private hp;
    private direction;
    private moveEvent?: Phaser.Time.TimerEvent;
    private hpBar: StatusBar;
    private attack;
    private level;
    private fireRate;
    private nextAttack;
    private nextPhysicalAttack;
    private missiles;
    private missile;
    private autoAttack;
    private range;
    private dead = false;
    private hitSound;
    private deadSound;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string) {
        super(scene, x, y, texture, frame);
        //this.anims.play('tentacle-anim');
        //scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.dealPhysicalDamage, this)

        // this.moveEvent = scene.time.addEvent({
        //     //delay: 1000,
        //     // callback: () => {
        //     //     
        //     //     this.direction = this.randomDirection(this.direction);
        //     // },
        //     //loop: true
        //     //}
        // })

        //this.hpBar = new StatusBar(scene, x, y, this.hp)
        const gameObject = scene.physics.add.existing(this);
        //gameObject.body.moves = false;

        this.missiles = this.scene.physics.add.group({
            classType: MissileContainer,
        });

        // scene.physics.add.overlap(this.missiles, scene.player.sprite, (player, missile) => {
        //     this.missileTileCollisionHandler(missile, player)
        // });
        // scene.physics.add.collider(this.missiles, scene.wallsLayer, (missile) => {
        //     this.hitWithMissile(missile);
        // })
        // scene.physics.add.collider(this.missiles, scene.stuffLayer, (missile) => {
        //     this.hitWithMissile(missile);
        // })

        this.hitSound = scene.sound.add('tentacleHit');
        this.deadSound = scene.sound.add('tentacleDead');
    }
    private missileTileCollisionHandler(missile) {
        const dmg = this.dealDamage();
        this.scene.player.takeDamage(dmg);
        this.hitWithMissile(missile);
        return;
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
        createFloatingText(this.x - 8, this.y - 30, dmg, null, null);
        if (this.hp <= 0 && !this.dead) {
            this.dead = true;
            this.anims.play('deadTentacle');
            this.deadSound.play();
            this.on('animationcomplete', (animation) => {
                if (animation.key === 'deadTentacle') {
                    this.destroy();
                }
            });
            //this.on('animationcomplete', this.destroy)
            //this.scene.stuffLayer.putTileAtWorldXY(TILES.GREEN_BLOOD, this.x, this.y)


        }
    }

    private hitWithMissile = (missile) => {
        missile.destroy();
    };

    // private createFloatingText(x, y, message, tint, font) {
    //     //let animation = this.scene.add.bitmapText(x, y, font, message).setTint(tint);
    //     let animation = this.scene.add.text(x, y, message, { fontSize: 12 })
    //     let tween = this.scene.add.tween({
    //         targets: animation,
    //         duration: 750,
    //         ease: "Exponential.In",
    //         y: y - 30,
    //         onComplete: () => {
    //             animation.destroy();
    //         },
    //         callbackScope: this,
    //     });
    // }

    private autoAttackHandler() {
        if (this.scene.time.now >= this.nextAttack) {

            const player = this.scene.player;
            const [playerX, playerY] = [player.sprite.body.center.x, player.sprite.body.center.y];
            const distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY)
            if (this.scene.time.now >= this.nextAttack && distanceFromPlayer <= this.range) {

                this.missile = new MissileContainer(
                    this.scene,
                    this.x,
                    this.y,
                    "tentacleMissile"
                );
                const angle = Phaser.Math.Angle.Between(
                    this.x,
                    this.y,
                    player.sprite.body.x + this.scene.cameras.main.scrollX,
                    player.sprite.body.x + this.scene.cameras.main.scrollY
                );
                this.missiles.add(this.missile, false);
                this.missile.angle = angle * 57.29;
                this.scene.physics.moveTo(this.missile, player.sprite.body.center.x, player.sprite.body.center.y, 200);
                this.nextAttack = this.scene.time.now + this.fireRate;
            }
        }
    }

    private dealDamage() {
        const dmg = this.attack * this.level;
        const outDmg = Phaser.Math.Between(dmg, 1.2 * dmg)
        this.hitSound.setVolume(.2);
        this.hitSound.play();
        return outDmg;
    }

    private dealPhysicalDamage() {
        if (this.scene.time.now >= this.scene.time.now + this.nextPhysicalAttack) {
            const dmg = this.attack * this.level;
            const outDmg = Phaser.Math.Between(dmg, 1.2 * dmg)
            this.nextPhysicalAttack = this.scene.time.now + this.fireRate;
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
        if (this.dead) return;
        this.hpBar.x = this.body.position.x;
        this.hpBar.y = this.body.position.y;
        this.hpBar.update(time, delta);
    }

    destroy(fromScene?: boolean) {
        //this.moveEvent.destroy();
        super.destroy(fromScene);
    }

}