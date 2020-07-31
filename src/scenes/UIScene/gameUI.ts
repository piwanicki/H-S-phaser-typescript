import { scenesKeys } from '../scenesKeys';
import eventsCenter from '../../events/eventsCenter';
import StatusBar from '~/statusBar/statusBar';
import Player from '~/Player/player';

export default class GameUI extends Phaser.Scene {
    private playerHP!: number;
    private playerHPText;
    private player!: Player;

    constructor() {
        super({ key: scenesKeys.scenes.GAME_UI })
    }

    init() {

    }

    create() {

        console.log(this.cameras.main);
        const playerUIcontainer = this.add.container(180, 50);
        playerUIcontainer.add(this.add.rectangle(0, 20, 250, 50, 0x989898))
        playerUIcontainer.add([
            this.add.rectangle(0, 0, 250, 20, 0x11c10e),

            this.add.rectangle(0, 23, 250, 20, 0x2754f2),

            this.add.rectangle(0, 45, 250, 5, 0xfdff0c),
        ])

        this.physics.add.existing(playerUIcontainer);
        this.add.existing(playerUIcontainer);
        // listen to 'update-count' event and call `updateCount()`
        // when it fires
        // clean up when Scene is shutdown

        eventsCenter.on('UI_update', this.updateHpBar, this)



        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('UI_update', this.updateHpBar, this)
        })

        this.playerHPText = this.add.text(130, 42, '', { color: 'black', fontSize: 22 });

    }
    updateHpBar(player) {
        this.player = player;
        const playerHP = this.player.hp
        this.playerHPText.text = `${this.player.hp} / ${this.player.hpBar.maxValue}`;
    }
}