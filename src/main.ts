import Phaser from 'phaser';
import FirstMap from './scenes/FirstMap';
import DungeonScene from './scenes/dungeon';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: '100vw',
	height: '100vh',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y:0 },
			debug: true
		}
	},
	scene: [FirstMap,DungeonScene],
	//scene: [DungeonScene],
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH 
	},
	
}

export default new Phaser.Game(config)
