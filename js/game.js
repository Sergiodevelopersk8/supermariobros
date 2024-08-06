/*global phaser */
import {createAnimations}  from "./animations.js"
import { initAudio, playAudio } from "./audio.js"
import { checkControls } from "./controls.js"
const config = {
  autoFocus:false,
    type:Phaser.AUTO,
    width:256,
    height:244,
    backgroundColor:'#049cd8',
    parent:'game',
    physics: {
      default:'arcade',
      arcade:{
        gravity:{y:300},
        debug:false
      }
    },
    scene:{
        preload,//se ejecuta para precargar recursos
        create, //se ejecuta cuando el juego comienza
        update //se ejecuta cada frame
    }
}

new Phaser.Game(config)

function preload(){
this.load.image(
    'cloud1',
    '../assets/scenery/overworld/cloud1.png'
)

this.load.spritesheet(
    'mario',
    '../assets/entities/mario.png',
    {frameWidth:18, frameHeight:16}

)




this.load.image(
    'floorbricks',
   '../assets/scenery/overworld/floorbricks.png'

)

this.load.spritesheet(
  'goomba',
  '../assets/entities/overworld/goomba.png',
  {frameWidth:16, frameHeight:16}
)

initAudio(this)

}

function create(){
    //iamge(x,y,id-del-asset)
this.add.image(100,50,'cloud1')
.setOrigin(0,0)
.setScale(0.15)

this.floor = this.physics.add.staticGroup()

this.floor
.create(0, config.height - 16, 'floorbricks')
.setOrigin(0,0.5)
.refreshBody()


this.floor
.create(150, config.height - 16,'floorbricks')
.setOrigin(0,0.5)
.refreshBody()



/* this.mario =  this.add.sprite(50,210,'mario').setOrigin(0,1)*/
this.mario =  this.physics.add.sprite(50,210,'mario')
 .setOrigin(0,1)
 .setCollideWorldBounds(true)
.setGravityY(300)

this.enemy = this.physics.add.sprite(120,config.height-30, 'goomba')
.setOrigin(0,1)
.setGravityY(300)
.setVelocityX(-50)


this.physics.world.setBounds(0, 0, 2000, config.height)
this.physics.add.collider(this.mario,this.floor)
this.physics.add.collider(this.enemy,this.floor)
this.physics.add.collider(this.mario,this.enemy, onHitEnemy, null, this)

this.cameras.main.setBounds(0,0,2000, config.height)
this.cameras.main.startFollow(this.mario)


createAnimations(this)


this.enemy.anims.play('goomba-walk',true)

//metodo de visualizar las teclas para ponerlos en el update
this.keys = this.input.keyboard.createCursorKeys()

}


function onHitEnemy(mario, enemy){
if(mario.body.touching.down && enemy.body.touching.up){
  enemy.anims.play('goomba-hurt',true)
enemy.setVelocityX(0)
mario.setVelocityY(-200)
playAudio('goomba-stomp',this)
setTimeout(()=>{
  enemy.destroy();

},300)


} else{
  //muere mario
}
}



function update(){

checkControls(this);

const {mario,sound, scene} = this;


//checa si mario muere
if(mario.y >= config.height){
  mario.isDead = true
  mario.anims.play('mario-dead', true);
  mario.setCollideWorldBounds(false)
 
   playAudio('gameover', this, {volume: 0.2})

 



  setTimeout(()=>{
    mario.setVelocityY(-350)
  },100)

  setTimeout(()=>{
    scene.restart()
  },2000)


}


}