import Phaser from "phaser";

export default class FirstMap extends Phaser.Scene {
  private background?: Phaser.GameObjects.TileSprite;
  private trees?: Phaser.Physics.Arcade.StaticGroup;
  private stones?: Phaser.Physics.Arcade.StaticGroup;
  //private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  player;

  constructor() {
    super("first-map");
  }

  preload() {
    this.load.image("ground", "assets/images/ground.png");
    this.load.image("tree", "assets/images/tree.png");
    this.load.image("stone", "assets/images/stone.png");
    this.load.image("hero", "assets/images/hero.png");
    this.load.image("hero_died", "assets/images/hero_died.png");
    this.load.tilemapTiledJSON("map1", "assets/tilemaps/Map.json");
    this.load.image("grassPiskel", "assets/tilemaps/grassPiskel.png");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const map = this.make.tilemap({ key: "map1" });
    const tilesetMap = map.addTilesetImage("grassPiskel", "grassPiskel");
    const ground = map.createStaticLayer("grass", tilesetMap, 0, 0);
    ground.setCollision(1);

    this.physics.world.setBounds(0, 0, ground.width, ground.height);

    const boundTop = this.physics.world.bounds.top;
    const boundBottom = this.physics.world.bounds.bottom;
    const boundLeft = this.physics.world.bounds.left;
    const boundrRight = this.physics.world.bounds.right;

    // const trees = map.createStaticLayer('trees',tilesetMap,0,0)

    this.trees = this.physics.add.staticGroup();
    this.stones = this.physics.add.staticGroup();

    this.player = this.physics.add
      .sprite(ground.width * 0.5, ground.height * 0.5, "hero")
      .setScale(3);

    this.player.setCollideWorldBounds(true);
    this.player.body.setBoundsRectangle(
      boundTop,
      boundBottom,
      boundLeft,
      boundrRight
    );

    //  generate stones
    for (let i = 1; i < 30; i++) {
      const stone = this.stones.create(
        Phaser.Math.Between(i * (width * 0.3), i * width * 0.35),
        Phaser.Math.Between(height * 0.5, height),
        "stone"
      ) as Phaser.Physics.Arcade.Sprite;
      stone.setScale(2).refreshBody();
    }

    // generate trees
    for (let i = 1; i < 30; i++) {
      const tree = this.trees.create(
        Phaser.Math.Between(i * (width * 0.3), i * width * 0.35),
        Phaser.Math.Between(height * 0.5, height),
        "tree"
      ) as Phaser.Physics.Arcade.Sprite;
      tree.setScale(3).refreshBody();
    }

    // add collisions
    this.physics.add.collider(this.trees, this.player);
    this.physics.add.collider(this.stones, this.player);

    // add keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera setting
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(
      this.scale.width * 0.3,
      this.scale.height * 0.3
    );
  }

  update() {
    //moving
    if (this.cursors?.left?.isDown) {
      this.player?.setVelocityX(-750);
      this.player?.setVelocityY(0);
    } else if (this.cursors?.right?.isDown) {
      this.player?.setVelocityX(750);
      this.player?.setVelocityY(0);
    } else if (this.cursors?.up?.isDown) {
      this.player?.setVelocityY(-750);
      this.player?.setVelocityX(0);
    } else if (this.cursors?.down?.isDown) {
      this.player?.setVelocityY(750);
      this.player?.setVelocityX(0);
    } else {
      this.player?.setVelocity(0);
    }
  }
}
