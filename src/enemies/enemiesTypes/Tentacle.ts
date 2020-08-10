import Phaser from 'phaser';
import StatusBar from '~/statusBar/StatusBar';
import MissileContainer from '../../attackMissile/MissileContainer';
import TILES from '../../scenes/tileMapping';
import {createFloatingText} from '../../scenes/UIScene/UIFunctions';
import { animsKeys } from '~/anims/animsKeys';

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
    private nextPhysicalAttack = 0;
    private missiles;
    private missile;
    private autoAttack;
    private range = 300;
    private dead = false;
    private hitSound;
    private deadSound;
    private exp = this.level * 20;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string) {
        super(scene, x, y, texture, frame);
        this.anims.play(animsKeys.TENTACLE.move);
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.dealPhysicalDamage, this)

        // this.moveEvent = scene.time.addEvent({
        //     //delay: 1000,
        //     // callback: () => {
        //     //     
        //     //     this.direction = this.randomDirection(this.direction);
        //     // },
        //     //loop: true
        //     //}
        // })

        this.hpBar = new StatusBar(scene, x, y, this.hp)
        const gameObject = scene.physics.add.existing(this);
        gameObject.body.moves = false;

        this.missiles = this.scene.physics.add.group({
            classType: MissileContainer,
        });

        scene.physics.add.overlap(this.missiles, scene.player.sprite, (player, missile) => {
            this.missileTileCollisionHandler(missile, player)
        });
        scene.physics.add.collider(this.missiles, scene.wallsLayer, (missile) => {
            this.hitWithMissile(missile);
        })
        scene.physics.add.collider(this.missiles, scene.stuffLayer, (missile) => {
            this.hitWithMissile(missile);
        })

        this.hitSound = scene.sound.add('tentacleHit');
        this.deadSound = scene.sound.add('tentacleDead');
    }
    private missileTileCollisionHandler(missile) {
        const dmg = this.dealDamage();
        this.scene['player'].takeDamage(dmg);
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
        createFloatingText(this.scene,this.x - 8, this.y - 30, dmg, 0xFFFFFF, null);
        if (this.hp <= 0 && !this.dead) {
            this.dead = true;
            this.anims.play(animsKeys.TENTACLE.dead);
            this.deadSound.play();
            this.on('animationcomplete', (animation) => {
                if (animation.key === animsKeys.TENTACLE.dead) {
                    this.scene['player'].updatePlayerExp(this.exp);
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
        if (!this.scene['player'].dead) this.autoAttackHandler();
    }

    destroy(fromScene?: boolean) {
        //this.moveEvent.destroy();
        super.destroy(fromScene);
    }

}