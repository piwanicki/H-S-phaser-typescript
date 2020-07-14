import Phaser from "phaser";
import PlayerCursor from "./playerCursor";

// /**
//  * A class that wraps up our 2D platforming sprite logic. It creates, animates and moves a sprite in
//  * response to WSAD/arrow keys. Call its update method from the scene's update and call its destroy
//  * method when you're done with the sprite.
//  */
export default class Player {
  constructor(scene, sprite, x, y, playerCursorSprite, map, scale = 1) {
    this.scene = scene;
    this.sprite = scene.physics.add
      .sprite(x, y, sprite, 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setScale(scale);
    this.playerCursor = new PlayerCursor(scene, playerCursorSprite);
    this.map = map;
    this.inventory = {};

    // Create the animations we need from the sprite spritesheet
    const anims = scene.anims;
    anims.create({
      key: "player-stand",
      frames: anims.generateFrameNames("player", {start: 1, end: 3}),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "player-left-walk",
      frames: anims.generateFrameNames("player", {start: 5, end: 6}),
      frameRate: 5,
      repeat: -1,
    });
    anims.create({
      key: "player-right-walk",
      frames: anims.generateFrameNames("player", {start: 7, end: 8}),
      frameRate: 5,
      repeat: -1,
    });

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

  attackHandler() {
    const pointer = this.scene.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    console.log(worldPoint);
    const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y);
    console.log(pointerTileXY);
    // const snappedWorldPoint = this.map.tileToWorldXY(
    //   pointerTileXY.x,
    //   pointerTileXY.y
    // );
    // this.graphics.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const spriteSpeed = 750;
    const anims = this.anims;
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
    if (this.scene.input.activePointer.isDown) {
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
