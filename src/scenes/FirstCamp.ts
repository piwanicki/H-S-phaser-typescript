import Phaser from "phaser";
import Player from '../Player/Player';
import TILES from './tileMapping';
import createPlayerAnims from '../anims/player-anims';
import { scenesKeys } from './scenesKeys';
import eventsCenter from '../events/eventsCenter'
import TILE_MAPPING from './tileMapping';

export default class FirstCamp extends Phaser.Scene {

    private player!: Player;
    private ground!: Phaser.Tilemaps.DynamicTilemapLayer;
    private background!: Phaser.Tilemaps.DynamicTilemapLayer;
    private grass!: Phaser.Tilemaps.DynamicTilemapLayer;
    private grass2!: Phaser.Tilemaps.DynamicTilemapLayer;
    private stones!: Phaser.Tilemaps.DynamicTilemapLayer;
    private stones2!: Phaser.Tilemaps.DynamicTilemapLayer;
    private trees!: Phaser.Tilemaps.DynamicTilemapLayer;
    private paths!: Phaser.Tilemaps.DynamicTilemapLayer;
    private water!: Phaser.Tilemaps.DynamicTilemapLayer;
    private stuff!: Phaser.Tilemaps.DynamicTilemapLayer;
    private enters!: Phaser.Tilemaps.StaticTilemapLayer;
    private graveyard!: Phaser.Tilemaps.DynamicTilemapLayer;
    private mountains!: Phaser.Tilemaps.DynamicTilemapLayer;
    private mountains2!: Phaser.Tilemaps.DynamicTilemapLayer;
    private waterEdges?: Phaser.Physics.Arcade.StaticGroup;
    private initData?: Object;
    private wakeData?: Object;
    anims;
    playerCursor; playerInDungeon;

    constructor() {
        super(scenesKeys.scenes.CAMP_1);
    }

    init(initData) {
        if (Object.keys(initData).length > 0) {
            this.initData = initData;
        }
    }

    onWake(sys, data) {
        this.wakeData = data;
    }

    create() {

        this.events.on('wake', this.onWake, this);
        this.playerInDungeon = false;
        createPlayerAnims(this.anims);

        let music = this.sound.add("cityTheme");
        this.sound.pauseOnBlur = false;
        music.play();

        const map = this.make.tilemap({ key: "camp1" });
        const forestTileset = map.addTilesetImage('forest', 'forest', 32, 32, 1, 2);
        const mountainTileset = map.addTilesetImage('mountain', 'mountain', 32, 32, 0, 0);
        const graveyardTileset = map.addTilesetImage('grave', 'graveyard', 32, 32, 0, 0);
        const crawlTileset = map.addTilesetImage('crawl', 'dungeonSet', 32, 32, 1, 2);

        this.background = map.createDynamicLayer('background', mountainTileset, 0, 0);
        this.ground = map.createDynamicLayer("ground", forestTileset, 0, 0);
        this.mountains = map.createDynamicLayer("mountains", forestTileset, 0, 0);
        this.mountains2 = map.createDynamicLayer("mountains2", mountainTileset, 0, 0);
        this.grass = map.createDynamicLayer('grass', mountainTileset, 0, 0);
        this.grass2 = map.createDynamicLayer('grass2', forestTileset, 0, 0);
        this.stuff = map.createDynamicLayer("stuff", graveyardTileset, 0, 0);
        this.enters = map.createStaticLayer('enters', crawlTileset, 0, 0);
        this.graveyard = map.createDynamicLayer('graveyard', graveyardTileset, 0, 0);
        //this.water = map.createDynamicLayer('water', forestTileset, 0, 0);

        const boundTop = this.physics.world.bounds.top;
        const boundBottom = this.physics.world.bounds.bottom;
        const boundLeft = this.physics.world.bounds.left;
        const boundrRight = this.physics.world.bounds.right;

        // spawnPoint in Tiled
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        if (this.wakeData !== undefined) {
            this.player = this.wakeData!['PLAYER']
            this.player.initPlayer(this);
        } else {
            this.player = new Player(this, spawnPoint['x'], spawnPoint['y']);
            this.player.sprite.setCollideWorldBounds(true);
            this.player.sprite.body.setBoundsRectangle(
                boundTop,
                boundBottom,
                boundLeft,
                boundrRight
            );
            this.player.create();
        }

        // hide player below stones/trees  ->  z-index
        this.stones = map.createDynamicLayer('stones', mountainTileset, 0, 0);
        this.stones2 = map.createDynamicLayer('stones2', forestTileset, 0, 0);
        this.trees = map.createDynamicLayer('trees', mountainTileset, 0, 0);


        // custom property from tiled 
        this.ground.setCollisionByProperty({ collide: true });
        this.mountains.setCollisionByProperty({ collide: true });
        this.mountains2.setCollisionByProperty({ collide: true });
        this.grass2.setCollisionByProperty({ collide: true });
        this.stones.setCollisionByProperty({ collide: true });
        this.stones2.setCollisionByProperty({ collide: true });
        this.trees.setCollisionByProperty({ collide: true });
        this.stuff.setCollisionByProperty({ collide: true });
        this.graveyard.setCollisionByProperty({ collide: true });
        this.enters.setCollisionByProperty({ collide: true });

        // add collisions
        this.physics.add.collider(this.ground, this.player.sprite);
        this.physics.add.collider(this.mountains, this.player.sprite);
        this.physics.add.collider(this.mountains2, this.player.sprite);
        this.physics.add.collider(this.stones, this.player.sprite);
        this.physics.add.collider(this.stones2, this.player.sprite);
        this.physics.add.collider(this.trees, this.player.sprite);
        this.physics.add.collider(this.stuff, this.player.sprite);
        this.physics.add.collider(this.enters, this.player.sprite);
        this.physics.add.collider(this.graveyard, this.player.sprite);

        this.physics.add.collider(
            this.player.missiles,
            this.trees,
            this.player.hitWithMissile
        )

        this.physics.add.collider(
            this.player.missiles,
            this.stones,
            this.player.hitWithMissile
        )

        this.physics.add.collider(
            this.player.missiles,
            this.mountains,
            this.player.hitWithMissile
        )

        this.physics.add.collider(
            this.player.missiles,
            this.mountains2,
            this.player.hitWithMissile
        )

        this.physics.world.setBounds(0, 0, this.ground.width, this.ground.height);

        // Camera setting
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        camera.setDeadzone(175, 75)

        camera.setBounds(0, 0, this.ground.width, this.ground.height);
        // zoom settings
        camera.setZoom(1.75);

        // // add tileIndex callback
        this.enters.setTileIndexCallback(TILES.DUNG_ENTER, () => {
            this.enters.setTileIndexCallback(TILES.DUNG_ENTER, null!, this);
            this.player.freeze();
            camera.fade(250, 0, 0, 0);
            camera.once('camerafadeoutcomplete', () => {
                if (this.scene.isSleeping(scenesKeys.scenes.DUNGEON)) {
                    this.scene.wake(scenesKeys.scenes.DUNGEON, { PLAYER: this.player });
                } else {
                    this.scene.launch(scenesKeys.scenes.DUNGEON, { PLAYER: this.player });
                }
                this.scene.switch(scenesKeys.scenes.DUNGEON);
                this.playerInDungeon = true;
                music.pause();
            });
        }, this)
    }

    update(time, delta) {
        if (this.playerInDungeon) return;
        this.player.update();
    }
}
