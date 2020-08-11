import Phaser from "phaser";
import Player from '../Player/Player';
import TILES from './tileMapping';
import createPlayerAnims from '../anims/player-anims';
import { scenesKeys } from './scenesKeys';



export default class FirstMap extends Phaser.Scene {
    private background?: Phaser.GameObjects.TileSprite;
    private trees?: Phaser.Physics.Arcade.StaticGroup;
    private stones?: Phaser.Physics.Arcade.StaticGroup;
    //private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private ground?: Phaser.Tilemaps.DynamicTilemapLayer;
    private paths?: Phaser.Tilemaps.DynamicTilemapLayer;
    //private water?: Phaser.Tilemaps.StaticTilemapLayer;
    private waterEdges?: Phaser.Physics.Arcade.StaticGroup;
    private layerDebugEnabled = false as Boolean;
    player; anims; water; enters;
    playerCursor; playerInDungeon;
    statusBar;

    constructor() {
        super(scenesKeys.scenes.CITY);
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
        this.playerInDungeon = false;
        createPlayerAnims(this.anims);


        let music = this.sound.add("cityTheme");
        this.sound.pauseOnBlur = false;
        //music.play();

        this.scene.run(scenesKeys.scenes.GAME_UI)

        const map = this.make.tilemap({ key: "map1" });
        const tilesetMap = map.addTilesetImage('dungeonSet', 'dungeonSet', 32, 32, 1, 2);
        this.ground = map.createDynamicLayer("ground", tilesetMap, 0, 0);
        this.water = map.createDynamicLayer('water', tilesetMap, 0, 0);
        this.paths = map.createDynamicLayer('paths', tilesetMap, 0, 0);
        this.enters = map.createStaticLayer('enters', tilesetMap, 0, 0);

        // custom property from tiled 
        this.ground.setCollisionByProperty({ collide: true });
        this.water.setCollisionByProperty({ collide: true });
        this.paths.setCollisionByProperty({ collide: true });

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
        this.player = new Player(this, 'player', spawnPoint.x, spawnPoint.y);

        this.player.sprite.setCollideWorldBounds(true);
        this.player.sprite.body.setBoundsRectangle(
            boundTop,
            boundBottom,
            boundLeft,
            boundrRight
        );

        this.player.create();

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
        this.physics.add.collider(this.trees, this.player.sprite);
        this.physics.add.collider(this.stones, this.player.sprite);
        this.physics.add.collider(this.water, this.player.sprite);
        this.physics.add.collider(this.waterEdges, this.player.sprite);
        this.physics.add.collider(this.paths, this.player.sprite);
        this.physics.add.collider(this.enters, this.player.sprite);

        // add keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Camera setting
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        camera.setDeadzone(175, 75)


        camera.setBounds(0, 0, this.ground?.width, this.ground?.height);
        // zoom settings
        camera.setZoom(2);

        const text = this.add
            .text(0, 16,
                ['SlashYt demo', 'Use Arrows or WSAD to move'], {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff",
                align: "center",
            })
            .setScrollFactor(0);

        // add tileIndex callback
        this.enters.setTileIndexCallback(TILES.DUNG_ENTER, () => {
            console.log(`dung enter`);
            this.enters.setTileIndexCallback(TILES.DUNG_ENTER, null);
            this.player.freeze();
            camera.fade(250, 0, 0, 0);
            camera.once('camerafadeoutcomplete', () => {
                this.scene.start(scenesKeys.scenes.DUNGEON, this.player);
                //this.player.destroy();
                this.playerInDungeon = true;
                music.pause();
            });
        })
        // add tileIndex callback
        this.enters.setTileIndexCallback(TILES.DUNG_ENTER2, () => {
            console.log(`dung enter2`);
            this.enters.setTileIndexCallback(TILES.DUNG_ENTER, null);
            this.player.freeze();
            camera.fade(250, 0, 0, 0);
            camera.once('camerafadeoutcomplete', () => {
                this.scene.start(scenesKeys.scenes.DUNGEON, this.player);
                //this.player.destroy();
                this.playerInDungeon = true;
                music.pause();
            });
        })
    }

    update(time, delta) {
        if (this.playerInDungeon) return;

        this.player.update();
        const menuKeys = this.input.keyboard.addKeys({
            E: 'E',
        });
        // Draw tiles (only within the groundLayer)
        //if (this.input.manager.activePointer.isDown) {
        //    this.ground?.putTileAtWorldXY(400, worldPoint.x, worldPoint.y);
        //}
        // if (menuKeys.E.isDown) {
        //     this.enableDebugGraphics(this.water);
        // }
    }
}
