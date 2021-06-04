var END =0;
var PLAY =1;
var gameState = PLAY;

var player, player_running;
var ground, invisibleGround, backgroundImage;

var bananaGroup, bananaImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3,road;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;



function preload(){
  player_running = loadAnimation("Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  backgroundImage = loadImage("jungle.jpg");
  bananaImage = loadImage ("banana.png");
  obstacle1= loadImage("stone1.png");
  obstacle2= loadImage("stone2.png");
  obstacle3= loadImage("stone3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(800,400);  
  player = createSprite(100,385,20,50);
  player.addAnimation("Running",player_running);
  player.scale = 0.1;
  
  ground = createSprite(400,390,800,10);
  ground.x=ground.width/2;
  ground.visible=false;

  road = createSprite(400,392,800,10);

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(395,150);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;

  gameOver.visible = false;
  restart.visible = false;

  bananaGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() { 
  background(backgroundImage);
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
//text("life: "+ life , 500,60);
drawSprites();
if (gameState===PLAY){
   if(keyDown("space") && player.y >= 139) {
     player.velocityY = -12;
   }
 
   player.velocityY =  player.velocityY + 0.8
 
   if (ground.x < 0){
     ground.x = ground.width/2;
   }

   if(bananaGroup.isTouching(player)){
    bananaGroup.destroyEach();
    score = score+2;
  }
 
   player.collide(ground);
   
   spawnbanana();
   spawnObstacles();
 
  if(obstaclesGroup.isTouching( player)){
       gameState = END;
   } 
 }

 
 else if (gameState === END ) {
   gameOver.visible = true;
   restart.visible = true;
   //set velcity of each game object to 0
   ground.velocityX = 0;
   player.velocityY = 0;
   obstaclesGroup.setVelocityXEach(0);
   bananaGroup.setVelocityXEach(0);
   
   
   //set lifetime of the game objects so that they are never destroyed
   obstaclesGroup.setLifetimeEach(-1);
   bananaGroup.setLifetimeEach(-1);
   
   if(mousePressedOver(restart)) {
     reset();
   }
 }
}

function spawnbanana() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var banana = createSprite(400,400,20,50);
    banana.y = Math.round(random(200,300));
    banana.addImage(bananaImage);
    banana.scale = 0.07;
    banana.velocityX =-5;
    
     //assign lifetime to the variable
     banana.lifetime = 200;
    
    //adjust the depth
    banana.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    bananaGroup.add(banana);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(800,365,20,50);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.19;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bananaGroup.destroyEach();
  
  player.changeAnimation("running",player_running);
  player.scale =0.1;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
}