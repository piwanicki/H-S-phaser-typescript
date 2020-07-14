import Phaser from "phaser";
import Player from '../Player/player';
import PlayerCursor from '~/Player/playerCursor';

export default class FirstMap extends Phaser.Scene {
    private background?: Phaser.GameObjects.TileSprite;
    private trees?: Phaser.Physics.Arcade.StaticGroup;
    private stones?: Phaser.Physics.Arcade.StaticGroup;
    //private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private ground?: Phaser.Tilemaps.DynamicTilemapLayer;
    //private water?: Phaser.Tilemaps.StaticTilemapLayer;
    private paths?: Phaser.Tilemaps.StaticTilemapLayer;
    private waterEdges?: Phaser.Physics.Arcade.StaticGroup;
    private layerDebugEnabled = false as Boolean;
    player; anims; water;
    playerCursor;

    constructor() {
        super("firstMap");
    }

    preload() {
        this.load.image("tree1", "assets/images/trees/mangrove_2.png");
        this.load.image("tree2", "assets/images/trees/tree_2_lightred.png");
        this.load.image("stone", "assets/images/stone.png");
        this.load.tilemapTiledJSON('map1', 'assets/tilemaps/Level1.json');
        this.load.image('dungeonSet', 'assets/tilemaps/DungeonCrawl.png');
        this.load.spritesheet('player', 'assets/images/player/deep_elf_male.png', {
            frameWidth: 32,
            frameHeight: 32,
            margin: 0,
            spacing: 0
        });
        this.load.image('waterEdge-left', 'assets/images/waters/deep_water_wave_east.png')
        this.load.image('waterEdge-right', 'assets/images/waters/deep_water_wave_west.png')
        this.load.image('waterEdge-up', 'assets/images/waters/deep_water_wave_north.png')
        this.load.image('waterEdge-down', 'assets/images/waters/deep_water_wave_south.png')

    }

    enableDebugGraphics(layer) {
        if (this.layerDebugEnabled === false) {
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            layer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        }
        this.layerDebugEnabled = !this.layerDebugEnabled;
    }

    prepareSpriteFromTile(layer, tile, tileKey, sizeX, sizeY, offstetX, offsetY) {
        layer.removeTileAt(tile.x, tile.y);
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const waterEdge = this.waterEdges?.create(x, y, tileKey)
        waterEdge.body.setSize(sizeX, sizeY).setOffset(offstetX, offsetY);
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        const map = this.make.tilemap({ key: "map1" });
        const tilesetMap = map.addTilesetImage('dungeonSet');
        this.ground = map.createDynamicLayer("ground", tilesetMap, 0, 0);
        this.water = map.createDynamicLayer('water', tilesetMap, 0, 0);
        this.paths = map.createStaticLayer('paths', tilesetMap, 0, 0);
        // custom property from tiled 
        this.ground.setCollisionByProperty({ collide: true });
        this.water.setCollisionByProperty({ collide: true });



        // Put tile index 1 at tile grid location (20, 10) within layer
        //ground.putTileAt(1, 20, 10);

        // Put tile index 2 at world pixel location (200, 50) within layer
        // (This uses the main camera's coordinate system by default)
        //ground.putTileAtWorldXY(2, 200, 50);

        //Convert the mouse position to world position within the camera
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        //Draw tiles (only within the groundLayer)
        // if (this.input.manager.activePointer.isDown) {
        //     this.ground?.putTileAtWorldXY(353, worldPoint.x, worldPoint.y);
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
        this.waterEdges = this.physics.add.staticGroup();

        // 1217 - 1220

        this.water.forEachTile(tile => {
            if (tile.index === 1218) {
                this.prepareSpriteFromTile(this.water, tile, 'waterEdge-left', 6, 32, 26, 0);
            } else if (tile.index === 1219) {
                this.prepareSpriteFromTile(this.water, tile, 'waterEdge-up', 32, 6, 0, 0);
            }
            else if (tile.index === 1220) {
                this.prepareSpriteFromTile(this.water, tile, 'waterEdge-down', 32, 6, 0, 26);
            }
            else if (tile.index === 1221) {
                this.prepareSpriteFromTile(this.water, tile, 'waterEdge-right', 6, 32, 0, 0);
            }
        })

        // spawnPoint in Tiled
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        const ankus = 'ankus.cur';
        const axe = 'axe.cur';
        this.player = new Player(this, 'player', spawnPoint.x, spawnPoint.y, axe, map);

        this.player.sprite.setCollideWorldBounds(true);
        this.player.sprite.body.setBoundsRectangle(
            boundTop,
            boundBottom,
            boundLeft,
            boundrRight
        );

        //  generate stones
        for (let i = 1; i < 15; i++) {
            const stone = this.stones.create(
                i * 100, Phaser.Math.Between(i * 10, this.ground?.height),
                "stone"
            ) as Phaser.Physics.Arcade.Sprite;
            stone.refreshBody();
        }

        // generate trees
        for (let i = 1; i < 10; i++) {
            const tree2 = this.trees.create(i * 150, Phaser.Math.Between(i * 50, this.ground?.height - 100),
                "tree2"
            ) as Phaser.Physics.Arcade.Sprite;

            const tree1 = this.trees.create(
                i * 150, Phaser.Math.Between(i * 100, this.ground?.height - 100),
                "tree1"
            ) as Phaser.Physics.Arcade.Sprite;

            tree1.setScale(2).refreshBody();
            tree2.setScale(2).refreshBody();

        }


        // add collisions
        //this.physics.add.collider(this.trees, this.player.sprite);
        this.physics.add.collider(this.stones, this.player.sprite);
        this.physics.add.collider(this.water, this.player.sprite);
        this.physics.add.collider(this.waterEdges, this.player.sprite);

        // add keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Camera setting
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setDeadzone(175, 75)


        this.cameras.main.setBounds(0, 0, this.ground?.width, this.ground?.height);
        // zoom settings
        this.cameras.main.setZoom(2.6);

        this.add
            .text(this.scale.width * .7, 16,
                ['SlashYt demo', 'Use Arrows or WSAD to move'], {
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
        //    this.ground?.putTileAtWorldXY(400, worldPoint.x, worldPoint.y);
        //}

        if (menuKeys.E.isDown) {
            this.enableDebugGraphics(this.water);
        }


    }
}
