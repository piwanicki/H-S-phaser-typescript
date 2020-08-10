import Phaser from "phaser";
import StatusBar from "~/statusBar/StatusBar";
import MissileContainer from "../attackMissile/MissileContainer";
import { createFloatingText } from "../scenes/UIScene/UIFunctions";
import { animsKeys } from '~/anims/animsKeys';

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  public speed!: number;
  public hp!: number;
  public hpBar!: StatusBar;
  public direction?: Direction;
  public moveEvent?: Phaser.Time.TimerEvent;
  public attack!: number;
  public level!: number;
  public fireRate!: number;
  public nextAttack!: number;
  public nextPhysicalAttack!: number;
  public missiles?: Phaser.Physics.Arcade.Group;
  public missile?: MissileContainer;
  public missileKey?: string;
  public animsKey!: string;
  public range!: number;
  public dead: boolean = false;
  public hitSound!: Phaser.Sound.BaseSound;
  public deadSound!: Phaser.Sound.BaseSound;
  public exp!: number;
  anims!: Phaser.GameObjects.Components.Animation;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    animsKey: string,
    ranged?: boolean,
    missileKey?: string,
    frame?: number | string
  ) {
    super(scene, x, y, texture, frame );

    // scene.physics.world.on(
    //   Phaser.Physics.Arcade.Events.TILE_COLLIDE,
    //   this.dealPhysicalDamage,
    //   this
    // );

    // this.moveEvent = scene.time.addEvent({
    //     //delay: 1000,
    //     // callback: () => {
    //     //
    //     //     this.direction = this.randomDirection(this.direction);
    //     // },
    //     //loop: true
    //     //}
    // })
    this.animsKey = animsKey

    this.hpBar = new StatusBar(scene, x, y, this.hp);
    scene.physics.add.existing(this);

    if (ranged) {
      this.missiles = this.scene.physics.add.group({
        classType: MissileContainer,
      });
      this.missileKey = missileKey;
      scene.physics.add.overlap(
        this.missiles,
        scene["player"].sprite,
        (player, missile) => {
          this.hitPlayerWithMissile(missile);
        }
      );
      scene.physics.add.collider(
        this.missiles,
        scene["wallsLayer"],
        (missile) => {
          this.destroyMissile(missile);
        }
      );
      scene.physics.add.collider(
        this.missiles,
        scene["stuffLayer"],
        (missile) => {
          this.destroyMissile(missile);
        }
      );
    }

    const soundConfig = {
      volume: 0.2,
    };
    this.hitSound = scene.sound.add("tentacleHit", soundConfig);
    this.deadSound = scene.sound.add("tentacleDead", soundConfig);
  }

  private hitPlayerWithMissile(missile) {
    const dmg = this.dealDamage();
    this.scene["player"].takeDamage(dmg);
    this.destroyMissile(missile);
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
    createFloatingText(this.scene, this.x - 8, this.y - 30, dmg, null, null);
    if (this.hp <= 0 && !this.dead) {
      this.dead = true;
      this.anims.play(animsKeys[this.animsKey].dead);
      this.deadSound.play();
      this.on("animationcomplete", (animation) => {
        if (animation.key === animsKeys[this.animsKey].dead) {
          this.destroy();
        }
      });
      //this.on('animationcomplete', this.destroy)
      //this.scene.stuffLayer.putTileAtWorldXY(TILES.GREEN_BLOOD, this.x, this.y)
    }
  }

  private destroyMissile = (missile) => {
    missile.destroy();
  };

  private autoRangedAttackHandler() {
    if (this.scene.time.now >= this.nextAttack) {
      const player = this.scene["player"];
      const [playerX, playerY] = [
        player.sprite.body.center.x,
        player.sprite.body.center.y,
      ];
      const distanceFromPlayer = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        playerX,
        playerY
      );
      if (
        this.scene.time.now >= this.nextAttack &&
        distanceFromPlayer <= this.range
      ) {
        this.missile = new MissileContainer(
          this.scene,
          this.x,
          this.y,
          this.missileKey!
        );
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          player.sprite.body.x + this.scene.cameras.main.scrollX,
          player.sprite.body.x + this.scene.cameras.main.scrollY
        );
        this.missiles!.add(this.missile, false);
        this.missile.angle = angle * 57.29;
        this.scene.physics.moveTo(
          this.missile,
          player.sprite.body.center.x,
          player.sprite.body.center.y,
          200
        );
        this.nextAttack = this.scene.time.now + this.fireRate;
      }
    }
  }

  private dealDamage() {
    const dmg = this.attack * this.level;
    const outDmg = Phaser.Math.Between(dmg, 1.2 * dmg);
    this.hitSound.play();
    return outDmg;
  }

  private dealPhysicalDamage() {
    if (this.scene.time.now >= this.scene.time.now + this.nextPhysicalAttack) {
      const dmg = this.attack * this.level;
      const outDmg = Phaser.Math.Between(dmg, 1.2 * dmg);
      this.nextPhysicalAttack = this.scene.time.now + this.fireRate;
      this.hitSound.play();
      return outDmg;
    }
  }

//   preUpdate(time: number, delta: number) {
//     super.preUpdate(time, delta);

//     // switch (this.direction) {
//     //     case Direction.UP: {
//     //         this.setVelocity(0, -this.speed)
//     //         break;
//     //     }
//     //     case Direction.DOWN: {
//     //         this.setVelocity(0, this.speed)
//     //         break;
//     //     }
//     //     case Direction.LEFT: {
//     //         this.setVelocity(-this.speed, 0)
//     //         break;
//     //     }
//     //     case Direction.RIGHT: {
//     //         this.setVelocity(this.speed, 0)
//     //     }
//     // }
//   }

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
