import { scenesKeys } from '../scenesKeys';
import eventsCenter from '../../events/eventsCenter';
import StatusBar from '~/statusBar/statusBar';
import Player from '~/Player/player';

export default class GameUI extends Phaser.Scene {
    private playerHP!: number;
    private playerHPText;
    private player!: Player;
    private playerHPBar;

    constructor() {
        super({ key: scenesKeys.scenes.GAME_UI })
    }

    init() {

    }

    create() {

        this.playerHPBar = this.add.rectangle(0, 0, 250, 20, 0x11c10e);
        const playerUIcontainer = this.add.container(180, 50);
        playerUIcontainer.add(this.add.rectangle(0, 15, 250, 55, 0x989898))
        playerUIcontainer.add([
            this.playerHPBar,
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

        const hpBar = this.playerHPBar;

        this.player = player;

        const playerHP = this.player.hp
        this.playerHPText.text = `${playerHP} / ${this.player.hpBar.maxValue}`;
        const p = playerHP / this.player.hpBar.maxValue;
        hpBar.width = 250 * p;

        if (p < 0.5 && p > 0.3) {
            hpBar.fillColor = 0xffff00;
        } else if (p < 0.3) {
            hpBar.fillColor = 0xff0000;
        } else {
            hpBar.fillColor = 0x11c10e;
        }

    }


    decrease(amount) {
        this.playerHP -= amount;
        if (this.playerHP < 0) {
            this.playerHP = 0;
        }
        if (this.playerHP === 0) {
            this.playerHPBar.destroy();
            return;
        }
        this.drawHPBar();
    }

    drawHPBar() {
        const hpBar = this.playerHPBar;
        hpBar.width = 30;
        //  BG
        // this.playerHPBar.fillStyle(0x989898);
        // this.playerHPBar.fillRect(this.x, this.y - 8, 32, 5);
        // 
        //  Health
        // this.bar.fillStyle(0x989898);
        // this.playerHPBar.fillRect(this.x, this.y - 8, 32, 5);
        // 
        // if (this.playerHP / this.player.hpBar.maxValue < 0.5 && this.playerHP / this.player.hpBar.maxValue > 0.3) {
        //   this.playerHPBar.fillStyle(0xffff00);
        // } else if (this.playerHP / this.player.hpBar.maxValue < 0.3) {
        //   this.playerHPBar.fillStyle(0xff0000);
        // } else {
        //   this.playerHPBar.fillStyle(0x11c10e);
        // }
        // 
        // const hp = (this.playerHP / this.player.hpBar.maxValue) * 32;
        // this.playerHPBar.fillRect(this.x, this.y - 8, hp, 5);
    }

    update(delta, time) {
        this.drawHPBar();
    }
}