import { scenesKeys } from '../scenesKeys';
import eventsCenter from '../../events/eventsCenter';
import Player from '~/Player/Player';

export default class GameUI extends Phaser.Scene {
    private playerHP!: number;
    private playerHPText;
    private player!: Player;
    private playerHPBar;
    private playerMANABar;
    private playerMANAText;
    private playerExpBar;

    constructor() {
        super({ key: scenesKeys.scenes.GAME_UI })
    }

    create() {

        this.playerHPBar = this.add.rectangle(0, 0, 250, 20, 0x11c10e);
        this.playerMANABar = this.add.rectangle(0, 23, 250, 20, 0x2754f2);
        this.playerExpBar = this.add.rectangle(0, 45, 250, 5, 0xfdff0c);
        const playerUIcontainer = this.add.container(180, 50);
        playerUIcontainer.add(this.add.rectangle(0, 15, 250, 55, 0x989898))
        playerUIcontainer.add([
            this.playerHPBar,
            this.playerMANABar,
            this.playerExpBar
        ])

        this.physics.add.existing(playerUIcontainer);
        this.add.existing(playerUIcontainer);
        // listen to 'update-count' event and call `updateCount()`
        // when it fires
        // clean up when Scene is shutdown

        eventsCenter.on('UI_update', this.updatePlayersResources, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('UI_update', this.updatePlayersResources, this)
        })

        this.playerHPText = this.add.text(130, 42, '', { color: 'black', fontSize: 22 });
        this.playerMANAText = this.add.text(135, 64, '', { color: 'black', fontSize: 20 });
    }

    updatePlayersResources = (player) => {
        this.player = player;
        this.updateHpBar();
        this.updateManaBar();
        this.updateExpBar();
    }

    updateExpBar() {
        const playerExp = this.player.exp;
        const playerNextLvlExp = this.player.nextLevelExp;
        const expBar = this.playerExpBar;
        let p = playerExp / playerNextLvlExp;
        expBar.width = 250 * p;
    }


    updateHpBar() {
        const hpBar = this.playerHPBar;
        const playerHP = this.player.hp
        let p;
        if (playerHP > 0) {
            this.playerHPText.text = `${playerHP} / ${this.player.hpBar.maxValue}`;
            p = playerHP / this.player.hpBar.maxValue;
        } else {
            this.playerHPText.text = `0 / ${this.player.hpBar.maxValue}`
            p = 0;
        }
        hpBar.width = 250 * p;
        if (p < 0.5 && p > 0.3) {
            hpBar.fillColor = 0xffff00;
        } else if (p < 0.3) {
            hpBar.fillColor = 0xff0000;
        } else {
            hpBar.fillColor = 0x11c10e;
        }
    }

    updateManaBar() {
        const manaBar = this.playerMANABar;
        const playerMANA = this.player.mana
        let p;
        if (playerMANA > 0) {
            this.playerMANAText.text = `${playerMANA} / ${this.player.mana}`;
            p = playerMANA / this.player.mana;
        } else {
            this.playerMANAText.text = `0 / ${this.player.mana}`
            p = 0;
        }
        manaBar.width = 250 * p;
    }

    update(delta, time) {

    }
}