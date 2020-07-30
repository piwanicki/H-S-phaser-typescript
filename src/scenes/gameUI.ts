import {scenesKeys} from './scenesKeys';

export default class GameUI extends Phaser.Scene {
    constructor() {
        super(scenesKeys.scenes.GAME_UI)
    }

    create() {

        const playerUIcontainer = this.add.container(0,50);
        playerUIcontainer.add(this.add.rectangle(0,20,700,50,0x989898))
        playerUIcontainer.add([
            this.add.rectangle(0,0,700,20,0x11c10e),
           this.add.rectangle(0,23,700,20,0x2754f2),   
           this.add.rectangle(0,45,700,5,0xfdff0c),   
        ])
    
        this.physics.add.existing(playerUIcontainer);
        this.add.existing(playerUIcontainer);

        console.log(this)
    }


}