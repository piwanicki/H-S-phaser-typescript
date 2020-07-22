import Phaser from "phaser";
import PlayerCursor from "./playerCursor";
import StatusBar from "../statusBar/statusBar";
import Missile from "../attackMissile/missile";

// /**
//  * A class that wraps up our 2D platforming sprite logic. It creates, animates and moves a sprite in
//  * response to WSAD/arrow keys. Call its update method from the scene's update and call its destroy
//  * method when you're done with the sprite.
//  */
export default class Player {
  nextAttack = 0;
  missiles;
  fireRate = 1000;

  constructor(scene, sprite, x, y, playerCursorSprite, map, scale = 1) {
    this.scene = scene;
    this.sprite = scene.physics.add
      .sprite(x, y, sprite, 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setScale(scale);
    this.playerCursor = new PlayerCursor(scene, playerCursorSprite);
    this.missile = new Missile(scene, x, y, "arrowMissile");
    this.missiles = scene.physics.add.group();
    this.map = map;
    this.inventory = {};
    this.hp = 300;
    this.hpBar = new StatusBar(scene, x, y, this.hp);
    // Track the arrow keys & WASD
    const {
      LEFT,
      RIGHT,
      UP,
      DOWN,
      W,
      S,
      A,
      D,
    } = Phaser.Input.Keyboard.KeyCodes;
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
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  preload() {}

  create() {
    // this.missiles = scene.physics.add.group();
    this.scene.physics.add.overlap(
      this.missiles,
      this.scene.trees,
      this.hitWithMissile
    );
  }

  attackHandler = () => {
    const scene = this.scene;
    const pointer = scene.input.activePointer;
    const worldPoint = pointer.positionToCamera(scene.cameras.main);
    const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y);
    const snappedWorldPoint = this.map.tileToWorldXY(
      pointerTileXY.x,
      pointerTileXY.y
    );
  };

  hitWithMissile = (missile) => {
    console.log(`missile overlap`);
    missile.destroy();
  };

  damaged() {
    if (this.hpBar.decrease(amount)) {
      this.alive = false;
    }
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const spriteSpeed = 750;
    const scene = this.scene;

    // this.hpBar.draw();

    //const anims = this.anims;
    //this.playerCursor.update();

    //     // Apply horizontal acceleration when left/a or right/d are applied
    // if (keys.left.isDown || keys.a.isDown) {
    //   sprite.setVelocityX(-acceleration);
    //   // No need to have a separate set of graphics for running to the left & to the right. Instead
    //   // we can just mirror the sprite.
    //   sprite.setFlipX(true);
    // } else if (keys.right.isDown || keys.d.isDown) {
    //   sprite.setVelocityX(acceleration);
    //   sprite.setFlipX(false);
    // } else {
    //   sprite.setVelocityX(0);
    // }
    if (scene.input.activePointer.isDown) {
      this.attackHandler();
    }

    // Horizontal movement
    if (keys.left.isDown) {
      sprite.setVelocityX(-spriteSpeed);
      sprite.anims.play("player-left-walk", true);
    } else if (keys.right.isDown) {
      sprite.setVelocityX(spriteSpeed);
      sprite.anims.play("player-right-walk", true);
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
      sprite.anims.play("player-left-walk", true);
    } else if (keys.W.isDown && keys.D.isDown) {
      sprite.setVelocityY(-spriteSpeed);
      sprite.setVelocityX(spriteSpeed);
      sprite.anims.play("player-right-walk", true);
    } else if (keys.D.isDown && keys.S.isDown) {
      sprite.setVelocityX(spriteSpeed);
      sprite.setVelocityY(spriteSpeed);
      sprite.anims.play("player-right-walk", true);
    } else if (keys.A.isDown && keys.S.isDown) {
      sprite.setVelocityX(-spriteSpeed);
      sprite.setVelocityY(spriteSpeed);
      sprite.anims.play("player-left-walk", true);
    } else if (keys.W.isDown) {
      sprite.setVelocityY(-spriteSpeed);
    } else if (keys.S.isDown) {
      sprite.setVelocityY(spriteSpeed);
    } else if (keys.A.isDown) {
      sprite.setVelocityX(-spriteSpeed);
      sprite.anims.play("player-left-walk", true);
    } else if (keys.D.isDown) {
      sprite.setVelocityX(spriteSpeed);
      sprite.anims.play("player-right-walk", true);
    } else {
      sprite.setVelocityX(0);
      sprite.setVelocityY(0);
      sprite.anims.play("player-stand", true);
    }
    sprite.body.velocity.normalize().scale(spriteSpeed);
    this.hpBar.x = sprite.body.position.x;
    this.hpBar.y = sprite.body.position.y;

    this.hpBar.update();

    if (scene.input.mousePointer.isDown && scene.time.now > this.nextAttack) {
      this.nextAttack = scene.time.now + this.fireRate;
      const pointer = scene.input.activePointer;
      const worldPoint = pointer.positionToCamera(scene.cameras.main);
      // const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y);
      // const snappedWorldPoint = this.map.tileToWorldXY(
      //   pointerTileXY.x,
      //   pointerTileXY.y
      // );

      const missile = this.missiles
        .create(
          sprite.body.center.x + 16,
          sprite.body.center.y + 16,
          this.missile.sprite
        )
        .setScale(0.6)
        .setVisible(true);
      const angle = Phaser.Math.Angle.BetweenPointsY(
        worldPoint,
        missile.body.center
      );
      scene.physics.moveTo(missile, worldPoint.x, worldPoint.y, 400);
      missile.setRotation(angle * -1);
    }

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
    this.sprite.destroy();
  }
}
