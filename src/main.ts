import Phaser from 'phaser'

import FirstMap from './scenes/FirstMap'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y:0 }
		}
	},
	scene: [FirstMap],
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
}

export default new Phaser.Game(config)
