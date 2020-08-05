import Phaser from 'phaser';

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
    constructor(world,scene,config){
        super(world,scene,config)
    }
}