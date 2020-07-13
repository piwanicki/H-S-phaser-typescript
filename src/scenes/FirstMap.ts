import Phaser from "phaser";
import Player from '../Player/player';

export default class FirstMap extends Phaser.Scene {
    private background?: Phaser.GameObjects.TileSprite;
    private trees?: Phaser.Physics.Arcade.StaticGroup;
    private stones?: Phaser.Physics.Arcade.StaticGroup;
    //private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    player; anims; ground;

    constructor() {
        super("first-map");
    }

    preload() {
        this.load.image("tree1", "assets/images/trees/mangrove_2.png");
        this.load.image("tree2", "assets/images/trees/tree_2_lightred.png");
        this.load.image("stone", "assets/images/stone.png");
        this.load.tilemapTiledJSON('map1', 'assets/tilemaps/Level1.json');
        this.load.image('dungeonSet', 'assets/tilemaps/DungeonCrawl.png');
        this.load.image('player', 'assets/images/player/deep_elf_male.png')
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        const map = this.make.tilemap({ key: "map1" });
        const tilesetMap = map.addTilesetImage('dungeonSet');
        this.ground = map.createDynamicLayer("ground", tilesetMap, 0, 0);

        // custom property from tiled 
        //ground.setCollisionByProperty({ collides: true });

        //const debugGraphics = this.add.graphics().setAlpha(0.75);
        //ground.renderDebug(debugGraphics, {
        //    tileColor: null, // Color of non-colliding tiles
        //    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });

        // Put tile index 1 at tile grid location (20, 10) within layer
        //ground.putTileAt(1, 20, 10);

        // Put tile index 2 at world pixel location (200, 50) within layer
        // (This uses the main camera's coordinate system by default)
        //ground.putTileAtWorldXY(2, 200, 50);

        //Convert the mouse position to world position within the camera
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        //Draw tiles (only within the groundLayer)
        // if (this.input.manager.activePointer.isDown) {
        //     this.ground.putTileAtWorldXY(353, worldPoint.x, worldPoint.y);
        // }

        this.physics.world.setBounds(0, 0, this.ground.width, this.ground.height);

        const boundTop = this.physics.world.bounds.top;
        const boundBottom = this.physics.world.bounds.bottom;
        const boundLeft = this.physics.world.bounds.left;
        const boundrRight = this.physics.world.bounds.right;

        // trees layer
        //const trees = map.createStaticLayer('trees', tilesetMap, 0, 0)
        //trees.setCollision(644);

        this.trees = this.physics.add.staticGroup();
        this.stones = this.physics.add.staticGroup();

        // spawnPoint in Tiled
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        //this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        //this.player = this.physics.add.sprite(ground.width * 0.5, ground.height * 0.5, "player").setScale(2);

       //this.player.sprite.setCollideWorldBounds(true);
       //this.player.sprite.body.setBoundsRectangle(
       //    boundTop,
       //    boundBottom,
       //    boundLeft,
       //    boundrRight
       //);

        //  generate stones
        for (let i = 1; i < 10; i++) {
            const stone = this.stones.create(
                i * 150, Phaser.Math.Between(i * 100, this.ground.height - 100),
                "stone"
            ) as Phaser.Physics.Arcade.Sprite;
            stone.setScale(2).refreshBody();
        }

        // generate trees
        for (let i = 1; i < 10; i++) {
            const tree1 = this.trees.create(
                i * 150, Phaser.Math.Between(i * 100, this.ground.height - 100),
                "tree1"
            ) as Phaser.Physics.Arcade.Sprite;

            tree1.setScale(3).refreshBody();

            const tree2 = this.trees.create(Phaser.Math.Between(i * 70, this.ground.width), Phaser.Math.Between(i * 50, this.ground.height - 100),
                "tree2"
            ) as Phaser.Physics.Arcade.Sprite;

            tree2.setScale(3).refreshBody();

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

        this.cameras.main.setBounds(0, 0, this.ground.width, this.ground.height);
        // zoom settings
        // this.cameras.main.setZoom(2);

        this.add
            .text(this.scale.width * .8, 16,
                ['Slashyt demo', 'Use Arrows or WSAD to move'], {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff",
                align: "center",

            })
            .setScrollFactor(0);
    }

    update(time, delta) {

        this.player.update();

        const menuKeys = this.input.keyboard.addKeys({
            E: 'E',
        });

        // Convert the mouse position to world position within the camera
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        // Draw tiles (only within the groundLayer)
        //if (this.input.manager.activePointer.isDown) {
        //    this.ground.putTileAtWorldXY(400, worldPoint.x, worldPoint.y);
        //}

        if (menuKeys['E'].isDown) {
            console.log(`switch debug`)
        }

        // // Horizontal movement
        // if (this.cursors?.left?.isDown) {
        //     this.player?.setVelocityX(-playerSpeed);
        // } else if (this.cursors?.right?.isDown) {
        //     this.player?.setVelocityX(playerSpeed);
        // }

        // // Vertical movement
        // else if (this.cursors?.up?.isDown) {
        //     this.player?.setVelocityY(-playerSpeed);
        // } else if (this.cursors?.down?.isDown) {
        //     this.player?.setVelocityY(playerSpeed);
        // }

        // // additional movement
        // else if (keys['W'].isDown && keys['A'].isDown) {
        //     this.player.setVelocityY(-playerSpeed);
        //     this.player.setVelocityX(-playerSpeed);
        // }
        // else if (keys['W'].isDown && keys['D'].isDown) {
        //     this.player.setVelocityY(-playerSpeed);
        //     this.player.setVelocityX(playerSpeed);

        // } else if (keys['D'].isDown && keys['S'].isDown) {
        //     this.player.setVelocityX(playerSpeed);
        //     this.player.setVelocityY(playerSpeed);
        // } else if (keys['A'].isDown && keys['S'].isDown) {
        //     this.player.setVelocityX(-playerSpeed);
        //     this.player.setVelocityY(playerSpeed);
        // } else if (keys['W'].isDown) {
        //     this.player.setVelocityY(-playerSpeed);
        // } else if (keys['S'].isDown) {
        //     this.player.setVelocityY(playerSpeed);
        // } else if (keys['A'].isDown) {
        //     this.player.setVelocityX(-playerSpeed);
        // } else if (keys['D'].isDown) {
        //     this.player?.setVelocityX(playerSpeed);
        // }
        // else {
        //     this.player?.setVelocityX(0);
        //     this.player?.setVelocityY(0);
        // }
        // this.player.body.velocity.normalize().scale(playerSpeed);

    }
}
