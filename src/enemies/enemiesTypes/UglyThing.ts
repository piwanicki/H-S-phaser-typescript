import StatusBar from "~/statusBar/StatusBar";
import { animsKeys } from "~/anims/animsKeys";
import Enemy from "../Enemy";

export default class UglyThing extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.speed = 100;
        this.hp = 350;
        this.hpBar = new StatusBar(scene, x, y, this.hp);
        this.attack = 30;
        this.level = 1;
        this.fireRate = 800;
        this.nextPhysicalAttack = 0;
        this.missiles;
        this.missile;
        this.range = 20;
        this.dead = false;
        this.hitSound;
        this.deadSound;
        this.exp = this.level * 30;
        this.animsKey = animsKeys.UGLYTHING;
        this.anims.play(this.animsKey['move']);
    }

    update(time: number, delta: number) {
        const player = this.scene['player'];
        if (this.dead || player.dead) {
            this.body['moves'] = false;
            return;
        }
        Enemy.prototype.dealPhysicalDamage.call(this);
        this.scene.physics.moveTo(
            this,
            player.sprite.body.center.x,
            player.sprite.body.center.y,
            this.speed
        );

        this.hpBar.x = this.body.position.x;
        this.hpBar.y = this.body.position.y;
        this.hpBar.update(time, delta);
    }
}
