import Phaser from 'phaser';
import StatusBar from '~/statusBar/StatusBar';
import Enemy from '../Enemy';
import { animsKeys } from '~/anims/animsKeys';


export default class Tentacle extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, true, 'tentacleMissile');

        this.speed = 0;
        this.hp = 200;
        // this.direction = Direction.UP;
        // this.moveEvent ?: Phaser.Time.TimerEvent;
        this.hpBar = new StatusBar(scene, x, y, this.hp);
        this.attack = 20;
        this.level = 1;
        this.fireRate = 1000;
        this.nextAttack = 0;
        this.nextPhysicalAttack = 0;
        this.range = 300;
        this.dead = false;
        this.hitSound;
        this.deadSound;
        this.exp = this.level * 20;
        this.animsKey = animsKeys.TENTACLE;
        this.anims.play(this.animsKey['move']);

        // this.moveEvent = scene.time.addEvent({
        //     //delay: 1000,
        //     // callback: () => {
        //     //     
        //     //     this.direction = this.randomDirection(this.direction);
        //     // },
        //     //loop: true
        //     //}
        // })

        this.hitSound = scene.sound.add('tentacleHit');
        this.deadSound = scene.sound.add('tentacleDead');
    }


    update(time: number, delta: number) {
        Enemy.prototype.autoRangedAttackHandler.call(this);
        this.hpBar.x = this.body.position.x;
        this.hpBar.y = this.body.position.y;
        this.hpBar.update(time, delta);
    }
}