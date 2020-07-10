import Phaser from 'phaser'

export default class FirstMap extends Phaser.Scene {

    private background?: Phaser.GameObjects.TileSprite;
    private trees?: Phaser.Physics.Arcade.StaticGroup;
    private stones?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('first-map')
    }


    preload() {
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('tree', 'assets/images/tree.png');
        this.load.image('stone', 'assets/images/stone.png');
        this.load.image('hero', 'assets/images/hero.png')
        this.load.image('hero_died', 'assets/images/hero_died.png')
        this.load.tilemapTiledJSON('map1', 'assets/Map1.json');
        this.load.image('grassPiskel','assets/grassPiskel.png');
     
    }

    create() {


        const width = this.scale.width;
        const height = this.scale.height;

        
        const map = this.make.tilemap({ key: 'map1'})
        const tilesetMap = map.addTilesetImage('ground','grassPiskel');
        const ground = map.createStaticLayer('ground',tilesetMap,0,0)
       // const trees = map.createStaticLayer('trees',tilesetMap,0,0)

        this.trees = this.physics.add.staticGroup();
        this.stones = this.physics.add.staticGroup();

        //this.physics.world.setBounds(0,0,width*1.5,height*1.5);

        this.player = this.physics.add.sprite(width * .5, height * .5, 'hero').setScale(3);

        // block player to move out from background field
        this.player.setCollideWorldBounds(true);



        // generate stones
       //for (let i = 1; i < 6; i++) {
       //    const stone = this.stones.create(Phaser.Math.Between(i * (width * .1), i * width * .15), Phaser.Math.Between(height * .1, height), 'stone') as Phaser.Physics.Arcade.Sprite;
       //    stone.setScale(2).refreshBody();
       //}

       //// generate trees
       //for (let i = 1; i < 10; i++) {
       //    const tree = this.trees.create(Phaser.Math.Between(i * (width * .1), i * width * .15), Phaser.Math.Between(height * .1, height), 'tree') as Phaser.Physics.Arcade.Sprite;
       //    tree.setScale(3).refreshBody();
       //}

        // add collisions
        this.physics.add.collider(this.trees, this.player)
        this.physics.add.collider(this.stones, this.player)

        // add keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Camera setting
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(this.scale.width, this.scale.height);

    }

    update() {
        //this.background?.tilePositionX? = 0.5;

        //moving 
        if (this.cursors?.left?.isDown) {
            this.player?.setVelocityX(-250)
        } else if (this.cursors?.right?.isDown) {
            this.player?.setVelocityX(250)
        } else if (this.cursors?.up?.isDown) {
            this.player?.setVelocityY(-250)
        } else if (this.cursors?.down?.isDown) {
            this.player?.setVelocityY(250)
        } else {
            this.player?.setVelocity(0);
        }

    }
}
