var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var bg
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  bg=loadImage("bg.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight-200);
  //Create trex
  trex = createSprite(displayHeight/2+100,displayHeight-350,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale=displayWidth/1600;
  //Create ground
  ground = createSprite(200,displayHeight-250,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  //Create end stuff
  gameOver = createSprite(displayWidth/2-250,((displayHeight-150)/2)-100);
  gameOver.addImage(gameOverImg);
  restart = createSprite(displayWidth/2-250,gameOver.y+50);
  restart.addImage(restartImg);
  gameOver.scale = displayWidth/1500;
  restart.scale = displayWidth/2000;
  //Create invisible ground
  invisibleGround = createSprite(displayWidth/2,displayHeight-240,windowWidth,10);
  invisibleGround.visible = false;
  //Create obstacle and cloud groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  //Collider for trex
  trex.setCollider("circle",0,0,trex.width/2);
  //Set score
  score = 0;  
}
//END FUNCTION SETUP
function draw() {
  textSize(24);
  fill("blue");
  text("Score: "+ score, displayWidth-200,50);
background(bg);
  //Display score
  camera.position.x=trex.x;
 // console.log(camera.position.x);
  //trex.debug=true;
  if(gameState === PLAY){
    //Not make end stuff visible during play
    gameOver.visible = false;
    restart.visible = false;
    //Set ground velocity
    ground.velocityX = -(6 + score/100);
    //Score system
    score = score + Math.round(getFrameRate()/60);
    //Score checkpoint
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }//Reset ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }//Trex jump function
    if(keyDown("space")&& trex.y>=invisibleGround.y-60.2){
        trex.velocityY = -(displayHeight/50);
        jumpSound.play();
    }
    //console.log(displayHeight);
    //Trex gravity function
    trex.velocityY = trex.velocityY + 0.8
    //Create clouds and obstacles
    spawnClouds();
    spawnObstacles();
    //Check if game ended
    if(obstaclesGroup.isTouching(trex)){
      jumpSound.play();
      gameState = END;
      dieSound.play()
    }
  //Game ended
  }else if (gameState === END) {
      //Show end items
      gameOver.visible = true;
      restart.visible = true;
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
      ground.velocityX = 0;
      trex.velocityY = 0
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);    
  }//Stop trex from falling down

  trex.collide(invisibleGround);
  //Reset game
  if(mousePressedOver(restart)) {
      reset();
  }
  drawSprites();

}//END FUNCTION DRAW
function reset(){
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  gameState = PLAY;
  trex.changeAnimation("running", trex_running);
}
function spawnObstacles(){
 if (frameCount % 75 === 0){
   var obstacle = createSprite(displayWidth+100,displayHeight-275,10,40);
   obstacle.velocityX = -(6 + score/100);
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale=displayWidth/1900;
    obstacle.lifetime = 300;
    //obstacle.debug=true;
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth+100,random(0,displayWidth/500),40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = displayWidth/1500;
    cloud.velocityX = -(6 + score/100);

    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

