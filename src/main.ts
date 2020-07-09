import Phaser from 'phaser'

import FirstMap from './scenes/FirstMap'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: '100vw',
	height: '100vh',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y:0 }
		}
	},
	scene: [FirstMap]
}

export default new Phaser.Game(config)
