import EnemyGroup from "../enemies/EnemyGroup";
import Tentacle from "../enemies/Tentacle";
import UglyThing from "../enemies/UglyThing";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  // assets is at the same level as src

  create() {
    var config = {
      key: "enemies",
      frameQuantity: 10,
      visible: true,
      active: true,
      max: 10,
      setXY: {x: this.width + 30, y: this.height - 65},
    };

    // const config = {
    //   classType: Tentacle,
    //   createCallback: (gameObj) => {
    //     const tentacleObj = gameObj;
    //     tentacleObj.body.onCollide = true;
    //   },
    // }


    this.enemies = new EnemyGroup(this.physics.world, this, config);
    const tentacle = new Tentacle(this, 500, 500, "tentacle");
    const uglyThing = new UglyThing(this, 540, 540, "uglyThing");
    this.add.existing(tentacle);
    this.enemies.add(tentacle);
    this.enemies.add(uglyThing);

    // this.enemies = this.physics.add.group({
    //   classType: Tentacle,
    //   createCallback: (gameObj) => {
    //     const tentacleObj = gameObj;
    //     tentacleObj.body.onCollide = true;
    //   },
    // });

    //   this.enemies = this.physics.add.group({
    //   classType: UglyThing,
    //   createCallback: (gameObj) => {
    //     const tentacleObj = gameObj;
    //     tentacleObj.body.onCollide = true;
    //   },
    // })

    this.enemies.get(
      46,
      82,
      "tentacle"
    );

    // this.enemies.get(
    //   50,50,
    //   "uglyThing"
    // );

    console.log(this.enemies);
  }

  update() {
    this.enemies.children.iterate(enemy => {
      //enemy.update();
    })
  }
}
