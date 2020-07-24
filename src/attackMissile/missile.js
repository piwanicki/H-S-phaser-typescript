export default class Missile extends Phaser.GameObjects.Image {
  constructor(scene, sprite) {
    super(scene);
    this.sprite = sprite;
    this.visible = false;
  }
}

// export default class Missile extends Phaser.GameObjects.Container {
//   constructor(scene, x, y, sprite) {
//     super(scene, x, y);
//     this.image = scene.add.image(x, y, sprite);
//     this.visible = false;
//     this.add(this.image);

//     scene.physics.add.existing(this);

//     const radius = this.image.height * 0.5;
//     this.body.setCircle(radius);
//     this.image.x += radius;
//     this.image.y += radius;

//     this.speed = 100;
//   }

//   setTrackMouse(enabled) {
//     this.trackMose = true;
//   }

//   update() {
//     const target = this.scene.input.activePointer.position;

//     const targetAngle = Phaser.Math.Angle.Between(
//       this.x,
//       this.y,
//       target.x,
//       target.y
//     );

//     // clamp to -PI to PI for smarter turning
//     let diff = Phaser.Math.Angle.Wrap(targetAngle - this.image.rotation);

//     // set to targetAngle if less than turnDegreesPerFrame
//     if (Math.abs(diff) < Phaser.Math.DegToRad(this.turnDegreesPerFrame)) {
//       this.image.rotation = targetAngle;
//     } else {
//       let angle = this.image.angle;
//       if (diff > 0) {
//         // turn clockwise
//         angle += this.turnDegreesPerFrame;
//       } else {
//         // turn counter-clockwise
//         angle -= this.turnDegreesPerFrame;
//       }
//       this.image.setAngle(angle);
//     }
//   }
// }

// Phaser.GameObjects.GameObjectFactory.register('missile', function (x, y, texture) {
//   const missile = new Missile(this.scene, x, y, texture)

//   this.displayList.add(missile)

//     this.scene.physics.world.enableBody(missile, Phaser.Physics.Arcade.DYNAMIC_BODY)

//   return missile
// })
