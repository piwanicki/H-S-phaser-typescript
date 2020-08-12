import Phaser from "phaser";
import PlayerCursor from "./PlayerCursor";
import StatusBar from "../statusBar/StatusBar";
import MissileContainer from "../attackMissile/MissileContainer";
import {createFloatingText} from "../scenes/UIScene/UIFunctions";
import eventsCenter from "../events/eventsCenter";
import {animsKeys} from "~/anims/animsKeys";

// /**
//  * A class that wraps up our 2D platforming sprite logic. It creates, animates and moves a sprite in
//  * response to WSAD/arrow keys. Call its update method from the scene's update and call its destroy
//  * method when you're done with the sprite.
//  */
export default class Player {
  nextAttack = 0;
  hitTintDuration = 0;
  missile;
  missiles;
  fireRate = 300;
  attack = 12;
  strength = 3;
  damageTime = 300;
  dead = false;
  level = 1;
  exp = 90;
  nextLevelExp = 100 * (this.level * Math.pow(this.level, 2));

  constructor(scene, x, y, playerCursorSprite, scale = 1) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.playerCursorSprite = playerCursorSprite;
    this.inventory = {};
    this.hp = 200;
    this.maxHp = this.hp;
    this.mana = 100;
    this.maxMana = this.mana;
    this.playerCursor = new PlayerCursor(this.scene, this.playerCursorSprite);

    this.hitSound = scene.sound.add("playerHit");
    this.deadSound = scene.sound.add("playerDead");
    this.initPlayer(scene);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  initPlayer = (scene) => {
    this.scene = scene;
    this.sprite = scene.physics.add
      .sprite(this.x, this.y, "player", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400);

    this.missiles = scene.physics.add.group();
    this.hpBar = new StatusBar(
      this.scene,
      this.sprite.x,
      this.sprite.y,
      this.hp
    );
    this.sprite.body.moves = true;
    // Track the arrow keys & WASD
    const {LEFT, RIGHT, UP, DOWN, W, S, A, D} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      W: W,
      A: A,
      D: D,
      S: S,
    });
    eventsCenter.emit("UI_update", this);
  };

  create() {
    this.missiles = this.scene.physics.add.group({
      classType: MissileContainer,
    });

    this.scene.physics.add.overlap(
      this.missiles,
      this.scene.trees,
      this.hitWithMissile
    );

    this.sprite.body.moves = true;
    eventsCenter.emit("UI_update", this);
  }

  attackHandler = () => {
    const scene = this.scene;
    const pointer = scene.input.mousePointer;
    const worldPoint = pointer.positionToCamera(scene.cameras.main);

    this.nextAttack = scene.time.now + this.fireRate;
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      pointer.x + this.scene.cameras.main.scrollX,
      pointer.y + this.scene.cameras.main.scrollY
    );

    this.missile = new MissileContainer(
      this.scene,
      this.sprite.x,
      this.sprite.y,
      "arrowMissile"
    );
    this.missiles.add(this.missile, false);
    this.missile.angle = angle * 57.29;
    scene.physics.moveTo(this.missile, worldPoint.x, worldPoint.y, 400);
  };

  hitWithMissile = (missile) => {
    missile.destroy();
  };

  damageEnemy = (missile) => {
    // target
    const dmg = Phaser.Math.Between(
      this.attack * this.strength,
      this.attack * this.strength * 1.2
    );
    this.hitWithMissile(missile);
    this.hitSound.setVolume(0.2);
    this.hitSound.play();
    return dmg;
  };

  takeDamage = (dmg) => {
    if (!dmg) return;
    createFloatingText(
      this.scene,
      this.sprite.body.x + 8,
      this.sprite.body.center.y - 30,
      dmg,
      0xffffff
    );
    this.hp -= dmg;
    this.hpBar.decrease(dmg);
    eventsCenter.emit("UI_update", this);
    if (this.hp <= 0 && !this.dead) {
      this.dead = true;
      this.deadSound.play();
      this.sprite.anims.play(animsKeys.PLAYER.dead, true);
      this.destroy();
      return;
    }
    this.sprite.setTint(0xc70404);
    const body = this.sprite.body;

    // push back after took dmg
    //this.scene.physics.moveTo(this.sprite, dir.x, dir.y, 500);
    this.hitTintDuration = this.scene.time.now + this.damageTime;
  };

  freeze() {
    this.sprite.body.moves = false;
  }

  updatePlayerExp = (exp) => {
    this.exp += exp;
    if (this.exp >= this.nextLevelExp) {
      this.level++;
      this.nextLevelExp = 100 * Math.pow(this.level, 2);
      this.attack += 2;
      this.maxHp += 20;
      this.hp = this.maxHp;
      this.hpBar.value = this.hp;
      this.hpBar.maxValue = this.maxHp;
      this.maxMana += 10;
      this.mana = this.maxMana;
      createFloatingText(
        this.scene,
        this.sprite.body.x - 16,
        this.sprite.body.center.y - 30,
        `Level UP!`,
        0xffa500
      );
    }
    eventsCenter.emit("UI_update", this);
  };

  update() {
    const keys = this.keys;
    const sprite = this.sprite;

    if (this.dead) {
      return;
    }

    const spriteSpeed = 750;
    const scene = this.scene;

    //reset TinCollor
    if (this.scene.time.now > this.hitTintDuration) {
      sprite.setTint(0xffffff);
    }

    if (
      scene.input.activePointer.isDown &&
      scene.time.now > this.nextAttack &&
      !this.dead
    ) {
      sprite.anims.play(animsKeys.PLAYER.attack, true);
      this.attackHandler();
    }

    // stop movement
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    // Horizontal movement
    if (keys.left.isDown) {
      sprite.setVelocityX(-spriteSpeed);
      sprite.setFlipX(true);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.right.isDown) {
      sprite.setVelocityX(spriteSpeed);
      sprite.anims.play(animsKeys.PLAYER.move, true);
      sprite.setFlipX(false);
    }
    // Vertical movement
    else if (keys.up.isDown) {
      sprite.setVelocityY(-spriteSpeed);
    } else if (keys.down.isDown) {
      sprite.setVelocityY(spriteSpeed);
    }
    // additional movement
    else if (keys.W.isDown && keys.A.isDown) {
      sprite.setVelocityY(-spriteSpeed);
      sprite.setVelocityX(-spriteSpeed);
      sprite.setFlipX(true);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.W.isDown && keys.D.isDown) {
      sprite.setVelocityY(-spriteSpeed);
      sprite.setVelocityX(spriteSpeed);
      sprite.setFlipX(false);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.D.isDown && keys.S.isDown) {
      sprite.setVelocityX(spriteSpeed);
      sprite.setVelocityY(spriteSpeed);
      sprite.setFlipX(false);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.A.isDown && keys.S.isDown) {
      sprite.setVelocityX(-spriteSpeed);
      sprite.setVelocityY(spriteSpeed);
      sprite.setFlipX(true);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.W.isDown) {
      sprite.setVelocityY(-spriteSpeed);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.S.isDown) {
      sprite.setVelocityY(spriteSpeed);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.A.isDown) {
      sprite.setVelocityX(-spriteSpeed);
      sprite.setFlipX(true);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (keys.D.isDown) {
      sprite.setVelocityX(spriteSpeed);
      sprite.setFlipX(false);
      sprite.anims.play(animsKeys.PLAYER.move, true);
    } else if (!scene.input.activePointer.isDown) {
      sprite.anims.play(animsKeys.PLAYER.stand, true);
    }

    sprite.body.velocity.normalize().scale(spriteSpeed);
    this.hpBar.x = sprite.body.position.x;
    this.hpBar.y = sprite.body.position.y;
    this.hpBar.update();

    //     // Update the animation/texture based on the state of the sprite
    //     if (onGround) {
    //       if (sprite.body.velocity.x !== 0) sprite.anims.play("sprite-run", true);
    //       else sprite.anims.play("sprite-idle", true);
    //     } else {
    //       sprite.anims.stop();
    //       sprite.setTexture("sprite", 10);
    //     }
  }

  destroy() {
    this.freeze();
  }
}
