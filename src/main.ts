import Phaser from 'phaser';
import FirstCamp from './scenes/FirstCamp';
import DungeonScene from './scenes/Dungeon';
import { LoadingScene } from './scenes/LoadingScene';
import MenuScene from './scenes/MenuScene';
import GameUI from './scenes/UIScene/gameUI';

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
	scene: [LoadingScene, MenuScene, FirstCamp, DungeonScene, GameUI],
	//scene: [LoadingScene,DungeonScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	pixelArt: true,
	roundPixels: true,
}

export default new Phaser.Game(config)
