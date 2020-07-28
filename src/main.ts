import Phaser from 'phaser';
import FirstMap from './scenes/FirstMap';
import DungeonScene from './scenes/dungeon';

const config: Phaser.Types.Core.GameConfig = {
	//const config = {
	type: Phaser.AUTO,
	width: '100vw',
	height: '100vh',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	//scene: [FirstMap],
	scene: [FirstMap, DungeonScene],
	//scene: [DungeonScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	pixelArt: true,
	roundPixels: true,
}

export default new Phaser.Game(config)
