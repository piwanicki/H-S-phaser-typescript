import Phaser from 'phaser';
import FirstMap from './scenes/FirstMap';
import DungeonScene from './scenes/dungeon';
import { LoadingScene } from './scenes/loadingScene';
import MenuScene from './scenes/menuScene';

const config: Phaser.Types.Core.GameConfig = {
	//const config = {
	type: Phaser.AUTO,
	width: '100vw',
	height: '100vh',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	//scene: [LoadingScene, DungeonScene],
	//scene: [FirstMap, DungeonScene],
	scene: [LoadingScene, MenuScene, FirstMap, DungeonScene],
	//scene: [DungeonScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	pixelArt: true,
	roundPixels: true,
}

export default new Phaser.Game(config)
