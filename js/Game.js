class Game {
  constructor() {
    this.resetButton=createButton("reset ")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    fuels=new Group()
    powerCoins=new Group()
    obs1Group=new Group()
    
    this.addSprites(fuels,8,fuel,0.02)
    this.addSprites(powerCoins,9,powerCoin,0.05)
    var obstaclesPositions = [ { x: width / 2 + 250, y: height - 800, image: obstacle2Image }, { x: width / 2 - 150, y: height - 1300, image: obstacle1Image }, { x: width / 2 + 250, y: height - 1800, image: obstacle1Image }, { x: width / 2 - 180, y: height - 2300, image: obstacle2Image }, { x: width / 2, y: height - 2800, image: obstacle2Image }, { x: width / 2 - 180, y: height - 3300, image: obstacle1Image }, { x: width / 2 + 180, y: height - 3300, image: obstacle2Image }, { x: width / 2 + 250, y: height - 3800, image: obstacle2Image }, { x: width / 2 - 150, y: height - 4300, image: obstacle1Image }, { x: width / 2 + 250, y: height - 4800, image: obstacle2Image }, { x: width / 2, y: height - 5300, image: obstacle1Image }, { x: width / 2 - 180, y: height - 5500, image: obstacle2Image } ];
    this.addSprites(obs1Group,obstaclesPositions.length,obstacle1Image,0.04, obstaclesPositions)
   
  }
 
  
  
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetButton.position(width/2,100)
  }

  play() {
    
    player.getCarAtEnd()
    this.resetGame()
    this.handleElements();

    Player.getPlayersInfo();
    
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderBoard()
      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // Changing camera position in y direction
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }
      drawSprites();
      this.handlePlayerControls();
     var finishline=3700
     
     if (player.positionY>finishline){
       gameState=2
       player.rank=player.rank+1
       this.update(2)
     // swal({title:"game over",text:"oops you lose the race"})
    
     Player.updateCarAtEnd(player.rank)
     swal({title:"awsome! rank is ${player.rank}",text:"you reach to finish line succesfully"})
     }
     console.log(player.positionY)
      
    }
  }

  handlePlayerControls() {
    // handling keyboard events
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW)) {
      player.positionX-= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.positionX+= 5;
      player.update();
    }
  }
  resetGame(){
this.resetButton.mousePressed(()=>{
  database.ref("/").update({
    gameState:0,playerCount:0, carAtEnd:0 ,
    players:{}

  
  })
  window.location.reload()
})
 

  }
  addSprites(spriteGroup,numberOfSprit,spriteImage,scale,position=[]){
    for( var i=0; i<numberOfSprit; i++){
      
      var x,y
      if (position.length>0){
        x=position[i].x
        y=position[i].y
        spriteImage=position[i].image
      }
      else {
      x=random(width/2+150,width/2-150)
      y=random(-height*5,height-400)
      }
      var sprite=createSprite(x,y)
      sprite.addImage("sprite",spriteImage)
      sprite.scale=scale
      spriteGroup.add(sprite)

    }
}
showLeaderBoard(){
  var leader1,leader2
  var players=Object.values(allPlayers)
  if((players[0].rank===0 && players[1].rank===0)||players[0].rank===1){
    leader1=players[0].name + "    " +players[0].rank + "     "  +players[0].score
    leader2=players[1].name + "    " +players[1].rank + "     "  +players[1].score
  }
  if(players[1].rank===1){
    leader1=players[0].name + "    " +players[0].rank + "     "  +players[0].score
    leader2=players[1].name + "    " +players[1].rank + "     "  +players[1].score
  }
  this.leader1.html(leader1)
  this.leader2.html(leader2)
}

}