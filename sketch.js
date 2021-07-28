var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1;

var dinoImage;

var sunImage;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex 1.png","trex 2.png","trex 3.png");
  trex_collided = loadAnimation("trex 4.png");

  groundImage = loadImage("ground2.png");

  dinoImage = loadImage("hh.png");

  sunImage = loadImage("sun.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("cactus.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,190,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.08;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  sun = createSprite(580,30,400,20);
  sun.addImage(sunImage);
  sun.scale=0.08;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  dinosGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    console.log(getFrameRate());
console.log(frameCount);

    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(mousePressedOver(trex) && trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    spawndinos();

    if(obstaclesGroup.isTouching(trex) || dinosGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    dinosGroup.setLifetimeEach(-1); 

     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     dinosGroup.setVelocityXEach(0);  
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
gameState=PLAY;
gameOver.visible=false;
restart.visible=false;
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();  
dinosGroup.destroyEach();  
trex.changeAnimation("running",trex_running);
score=0;
}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(600,155,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,1));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.12;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(10,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawndinos(){
  if (frameCount % 150 === 0){
    var dino = createSprite(600,145,10,40);
    dino.velocityX = -(6 + score/100);
    
     //generate random obstacles
     var rand = Math.round(random(1,1));
     switch(rand) {
       case 1: dino.addImage(dinoImage);
     }
    
     //assign scale and lifetime to the obstacle           
     dino.scale = 0.4;
     dino.lifetime = 300;
    
    //add each obstacle to the group
     dinosGroup.add(dino);
  }
 }