import Phaser from "phaser";

// /**
//  * A class that wraps up our 2D platforming sprite logic. It creates, animates and moves a sprite in
//  * response to WSAD/arrow keys. Call its update method from the scene's update and call its destroy
//  * method when you're done with the sprite.
//  */
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create the animations we need from the sprite spritesheet
    //const anims = scene.anims;
    //anims.create({
    //    key: "misa-left-walk",
    //    frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
    //    frameRate: 10,
    //    repeat: -1
    //});
    //anims.create({
    //    key: "misa-right-walk",
    //    frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
    //    frameRate: 10,
    //    repeat: -1
    //});
    //anims.create({
    //    key: "misa-front-walk",
    //    frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
    //    frameRate: 10,
    //    repeat: -1
    //});
    //anims.create({
    //    key: "misa-back-walk",
    //    frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
    //    frameRate: 10,
    //    repeat: -1
    //});

    //     // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setScale(2);

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
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const spriteSpeed = 750;

    //     // Apply horizontal acceleration when left/a or right/d are applied
    // if (keys.left.isDown || keys.a.isDown) {
    //   sprite.setAccelerationX(-acceleration);
    //   // No need to have a separate set of graphics for running to the left & to the right. Instead
    //   // we can just mirror the sprite.
    //   sprite.setFlipX(true);
    // } else if (keys.right.isDown || keys.d.isDown) {
    //   sprite.setAccelerationX(acceleration);
    //   sprite.setFlipX(false);
    // } else {
    //   sprite.setAccelerationX(0);
    // }

    // Horizontal movement
    if (keys.left.isDown) {
      sprite.setAccelerationX(-spriteSpeed);
    } else if (keys.right.isDown) {
      sprite.setAccelerationX(spriteSpeed);
    }

    // Vertical movement
    else if (keys.up.isDown) {
      sprite.setAccelerationY(-spriteSpeed);
    } else if (keys.down.isDown) {
      sprite.setAccelerationY(spriteSpeed);
    }

    // additional movement
    else if (keys.W.isDown && keys.A.isDown) {
      sprite.setAccelerationY(-spriteSpeed);
      sprite.setAccelerationX(-spriteSpeed);
    } else if (keys.W.isDown && keys.D.isDown) {
      sprite.setAccelerationY(-spriteSpeed);
      sprite.setAccelerationX(spriteSpeed);
    } else if (keys.D.isDown && keys.S.isDown) {
      sprite.setAccelerationX(spriteSpeed);
      sprite.setAccelerationY(spriteSpeed);
    } else if (keys.A.isDown && keys.S.isDown) {
      sprite.setAccelerationX(-spriteSpeed);
      sprite.setAccelerationY(spriteSpeed);
    } else if (keys.W.isDown) {
      sprite.setAccelerationY(-spriteSpeed);
    } else if (keys.S.isDown) {
      sprite.setAccelerationY(spriteSpeed);
    } else if (keys.A.isDown) {
      sprite.setAccelerationX(-spriteSpeed);
    } else if (keys.D.isDown) {
      sprite.setAccelerationX(spriteSpeed);
    } else {
      sprite.setAccelerationX(0);
      sprite.setAccelerationY(0);
    }
    sprite.body.velocity.normalize().scale(spriteSpeed);

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
