import Phaser from "phaser";
import StatusBar from "~/statusBar/StatusBar";
import { createFloatingText } from "../../scenes/UIScene/UIFunctions";
import { animsKeys } from "~/anims/animsKeys";
import Enemy from "../Enemy";

/*
enum Direction {
    UP, DOWN, LEFT, RIGHT
}


export default class UglyThing extends Phaser.Physics.Arcade.Sprite {

    //private speed = 100;
    private hp = 350;
    private direction = Direction.UP;
    private moveEvent?: Phaser.Time.TimerEvent;
    private hpBar: StatusBar;
    private attack = 30;
    private level = 1;
    private fireRate = 800;
    private nextPhysicalAttack = 0;
    // private missiles;
    // private missile;
    private autoAttack;
    private range = 20;
    private dead = false;
    private hitSound;
    private deadSound;
    private exp = this.level * 30;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string) {
        super(scene, x, y, texture, frame);
        this.anims.play(animsKeys.UGLYTHING.move);
        //scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_OVERLAP, this.dealPhysicalDamage, this)

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
        scene.physics.add.collider(gameObject, scene.wallsLayer)
        scene.physics.add.collider(gameObject, scene.stuffLayer)

        this.hitSound = scene.sound.add('tentacleHit');
        this.deadSound = scene.sound.add('tentacleDead');
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
        createFloatingText(this.scene, this.x - 8, this.y - 30, dmg, 0xFFFFFF, null);
        if (this.hp <= 0 && !this.dead) {
            this.dead = true;
            this.anims.play(animsKeys.UGLYTHING.dead);
            this.deadSound.play();
            this.on('animationcomplete', (animation) => {
                if (animation.key === animsKeys.UGLYTHING.dead) {
                    this.scene['player'].updatePlayerExp(this.exp);
                    this.destroy();
                }
            });
            //this.on('animationcomplete', this.destroy)
            //this.scene.stuffLayer.putTileAtWorldXY(TILES.GREEN_BLOOD, this.x, this.y)
        }
    }

    private dealPhysicalDamage() {
        const player = this.scene.player;
        const [playerX, playerY] = [player.sprite.body.center.x, player.sprite.body.center.y];
        const distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY)

        if (this.scene.time.now >= this.nextPhysicalAttack && distanceFromPlayer <= this.range && !player.dead) {
            this.nextPhysicalAttack = this.scene.time.now + this.fireRate;
            const dmg = this.attack * this.level;
            const outDmg = Phaser.Math.Between(dmg, 1.2 * dmg)
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
        const player = this.scene['player'];
        if (this.dead || player.dead) {
            this.body.moves = false;
            return
        };
        this.scene.physics.moveTo(this, player.sprite.body.center.x, player.sprite.body.center.y, 100);
        this.hpBar.x = this.body.position.x;
        this.hpBar.y = this.body.position.y;
        this.hpBar.update(time, delta);
    }

    destroy(fromScene?: boolean) {
        //this.moveEvent.destroy();
        super.destroy(fromScene);
    }

}
*/

export default class UglyThing extends Enemy {
  constructor(scene, x, y, texture, anims) {
    super(scene, x, y, texture, anims);

    this.speed = 100;
    this.hp = 350;
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
  }

  update(time: number, delta: number) {
    const player = this.scene["player"];
    if (this.dead || player.dead) {
      this.body['moves'] = false;
      return;
    }
    this.scene.physics.moveTo(
      this,
      player.sprite.body.center.x,
      player.sprite.body.center.y,
      100
    );
    this.hpBar.x = this.body.position.x;
    this.hpBar.y = this.body.position.y;
    this.hpBar.update(time, delta);
    console.log(this)
  }

  destroy(fromScene?: boolean) {
    //this.moveEvent.destroy();
    super.destroy(fromScene);
  }
}
