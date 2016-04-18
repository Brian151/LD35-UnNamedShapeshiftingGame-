/*not really a required file...
Just an example of how to launch/configure the game*/

Game.prototype.init = function(mainCanvas) {
	this.state = "init";
	this.assets = GameObjs.assets = new AssetManager(this,"assets/");
	this.canvas = document.getElementById(mainCanvas);
	this.renderer = GameObjs.renderer = new GraphicsHandler(this.canvas);
	this.controller = GameObjs.controller = new InputManager(this);
	this.assets.loadAsset("image","Terrain.png","tiles");
	this.assets.loadAsset("txt","Terrain.json","tilesAnim");
	this.assets.loadAsset("txt","Map1.json","levelMap1");
	this.assets.loadAsset("image","Player.png","playerSprite");
	this.assets.loadAsset("txt","Player.json","playerAnim");
	this.assets.loadAsset("image","Baddies.png","badGuySprite");
	this.assets.loadAsset("txt","Baddies.json","badGuyAnim");
	this.assets.loadAsset("txt","Map1Objs.json","objMap1");
	this.assets.loadAsset("image","Items.png","itemSprite");
	this.assets.loadAsset("txt","Items.json","itemAnim");
	this.assets.loadAsset("image","Title.png","titleScreen");
	this.assets.loadAsset("image","Menu.png","menuScreen");
	this.assets.loadAsset("image","Credits.png","credScreen");
	this.assets.loadAsset("txt","Map2.json","levelMap2");
	this.assets.loadAsset("txt","Map2Objs.json","objMap2");
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.tileMap = [];
	this.objs = [];
	this.score = {};
	this.selectedLevel = 1;
	this.maxLevel = 1;
	this.lastLevel = false;
}

Game.prototype.loadLevel = function(levelID) {
	this.tileMap = [];
	this.objs = [];
	this.score = {
		"coins" : 0,
		"enemies" : 0,
		"consoles" : 0,
		"mice" : 0,
		"switches" : 0,
		"sacrifices" : []
	};
	this.state = "play";
	var myMap = JSON.parse(this.assets.requestAsset("txt","levelMap" + levelID));
	var myObjs = JSON.parse(this.assets.requestAsset("txt","objMap" + levelID));
	this.objs.push(this.player = new Player(this,myMap.settings.player.x,myMap.settings.player.y,myMap.settings.player.forms));
	this.lastLevel = false;
	this.lastLevel = myMap.settings.isLast;
	this.winConditions = myMap.settings.win;
	var i3 = 0;
	for (var i=0; i < myMap.h; i++) {
		for(var i2=0; i2 < myMap.w; i2++) {
			var tType = myMap.tiles[i3];
			this.tileMap.push(new Tile(i2 * 16,i * 16,tType));
			i3++;
		}
	}
	for (var i=0; i < myObjs.objs.length; i++) {
		var curr = myObjs.objs[i];
		switch (curr.type) {
			case "lava" : {
				this.objs.push(new Lava(this,curr));
				break;
			}
			case "spike" : {
				this.objs.push(new Spikes(this,curr.x,curr.y));
				break;
			}
			case "water" : {
				this.objs.push(new Water(this,curr));
				break;
			}
			case "coin" : {
				this.objs.push(new Coin(this,curr.x,curr.y,curr.value));
				break;
			}
			case "wall" : {
				this.objs.push(new Wall(this,curr));
				break;
			}
			case "vermine" : {
				this.objs.push(new EnemyMouse(this,curr.x,curr.y));
				break;
			}
			default: {
				break;
			}
			
		}
	}
}

Game.prototype.tick = function(){
	this.assets.tick();
	if (this.state == "init"){
		if(this.assets.queuecomplete) {
			this.state = "title";
			console.log("start game!");
			GameObjs.tileAnim = new SpriteData(JSON.parse(this.assets.requestAsset("txt","tilesAnim")));
			GameObjs.tileImage = this.assets.requestAsset("image","tiles");
			GameObjs.playerSprite = this.assets.requestAsset("image","playerSprite");
			GameObjs.playerAnim = new SpriteData(JSON.parse(this.assets.requestAsset("txt","playerAnim")));
			GameObjs.badGuySprite = this.assets.requestAsset("image","badGuySprite");
			GameObjs.badGuyAnim = new SpriteData(JSON.parse(this.assets.requestAsset("txt","badGuyAnim")));
			GameObjs.itemSprite = this.assets.requestAsset("image","itemSprite");
			GameObjs.itemAnim = new SpriteData(JSON.parse(this.assets.requestAsset("txt","itemAnim")));
			GameObjs.title = this.assets.requestAsset("image","titleScreen");
			GameObjs.menu = this.assets.requestAsset("image","menuScreen");
			GameObjs.credits = this.assets.requestAsset("image","credScreen");
		}
	}
	if (this.state == "play") {
		for (var i=0; i < this.objs.length; i++) {
			this.objs[i].tick();
		}
		var up = this.controller.checkKeyDown(38);
		var right = this.controller.checkKeyDown(39);
		var down = this.controller.checkKeyDown(40);
		var left = this.controller.checkKeyDown(37);
		var change = this.controller.checkKeyPress(32," ");
		if (change) this.player.shapeShift();
		if(up) {
			this.player.dir.y = -1;
			this.player.walk();
			//console.log("up");
		}
		if(down) {
			this.player.dir.y = 1;
			this.player.walk();
			//console.log("down");
		}
		if(right) {
			this.player.dir.x = 1;
			this.player.walk();
			//console.log("right");
		}
		if(left) {
			this.player.dir.x = -1;
			this.player.walk();
			//console.log("left");
		}
		var score1 = this.score.coins;
		var score2 = this.score.enemies;
		var score3 = this.score.consoles;
		var score4 = this.score.mice;
		var score5 = this.score.switches;
		var score6 = this.score.sacrifices;
		var scores = 0;
		if (score1 >= this.winConditions.coins) scores++;
		if (score2 >= this.winConditions.enemies) scores++;
		if (score3 >= this.winConditions.consoles) scores++;
		if (score4 >= this.winConditions.mice) scores++;
		if (score5 >= this.winConditions.switches) scores++;
		if (scores == 5) {
			this.state = "win";
			
			if (!this.lastLevel) {
			this.selectedLevel++;
			this.maxLevel++;
			}
		}
		for (var i = this.objs.length - 1; i >= 0; i--) {
			var curr = this.objs[i];
			if (curr.dead) {
				this.objs.splice(i,1);
			}
		}
	}
	if (this.state == "title" || this.state == "menu" || this.state == "credits" || this.state == "win" || this.state == "lose") {
		var toMenu = this.controller.checkKeyPress(77,"M");
		var toTitle = this.controller.checkKeyPress(84,"T");
		var toCreds = this.controller.checkKeyPress(67,"C");
		if (toMenu) this.state = "menu";
		if (toTitle) this.state = "title";
		if (toCreds) {
			if (this.state != "lose" && this.state != "win") this.state = "credits";
		}
	}
	if (this.state == "menu") {
		var load = this.controller.checkKeyPress(76,"L");
		if (load) this.loadLevel(this.selectedLevel);
		var prev = this.controller.checkKeyPress(37);
		var next = this.controller.checkKeyPress(39);
		if (prev) {
			if (this.selectedLevel > 1) this.selectedLevel--;
		}
		if (next) {
			if (this.selectedLevel < this.maxLevel) this.selectedLevel++;
		}
	}
	if (this.state == "lose") {
		var restart = this.controller.checkKeyPress(82,"R");
		if (restart) this.loadLevel(this.selectedLevel);
	}
	if (this.state == "win") {
		var restart = this.controller.checkKeyPress(82,"R");
		if (restart) this.loadLevel(this.selectedLevel - 1);
		var load = this.controller.checkKeyPress(76,"L");
		if (load) {
			if (!this.lastLevel) {
				//console.log(this.maxLevel);
				this.loadLevel(this.selectedLevel);
			} else {
				this.state = "complete";
			}
		}
	}
	if (this.state == "complete") {
		var toMenu = this.controller.checkKeyPress(77,"M");
		var toTitle = this.controller.checkKeyPress(84,"T");
		var toCreds = this.controller.checkKeyPress(67,"C");
		if (toMenu) this.state = "menu";
		if (toTitle) this.state = "title";
		if (toCreds) this.state = "credits";
	}
	this.draw();
}

Game.prototype.draw = function(){
	this.renderer.ctx.clearRect(0,0,this.width,this.height);
	if (this.state == "play") {
		for (var i=0; i < this.tileMap.length; i++) {
			this.tileMap[i].draw();
		}
		for (var i=0; i < this.objs.length; i++) {
			this.objs[i].draw();
		}
		if (this.state == "lose") {
			this.renderer.ctx.fillStyle = "#770000";
			this.renderer.ctx.textAlign = "center";
			var x = this.width/2;
			var y = (this.height/2) + 48;
			this.renderer.ctx.font = "96px bold Arial";
			this.renderer.ctx.fillText("DEAD!",x,y);
		}
	}
	if (this.state == "title" || this.state == "menu" || this.state == "credits") {
		this.renderer.ctx.fillStyle = "#ffffff";
		this.renderer.ctx.fillRect(0,0,this.width,this.height);
	}
	if (this.state == "title") {
		this.renderer.ctx.drawImage(GameObjs.title,0,0);
	}
	if (this.state == "menu") {
		this.renderer.ctx.drawImage(GameObjs.menu,0,0);
		this.renderer.ctx.fillStyle = "#cccccc";
		var x = this.width /2;
		var y = (this.height/2) + 24;
		this.renderer.ctx.fillRect(x - (96/2) ,y - (56 - 10),96,56);
		this.renderer.ctx.fillStyle = "#000000";
		this.renderer.ctx.font = "48px bold Arial";
		this.renderer.ctx.textAlign = "center";
		this.renderer.ctx.fillText(this.selectedLevel,x,y);
		
	}
	if (this.state == "credits") {
		this.renderer.ctx.drawImage(GameObjs.credits,0,0);
	}
	if (this.state == "lose") {
		this.renderer.ctx.fillStyle = "#000000";
		this.renderer.ctx.fillRect(0,0,this.width,this.height);
		this.renderer.ctx.fillStyle = "#770000";
		this.renderer.ctx.textAlign = "center";
		var x = this.width/2;
		var y = (this.height/3) + 48;
		this.renderer.ctx.font = "96px bold Arial";
		this.renderer.ctx.fillText("DEAD!",x,y);
		this.renderer.ctx.font = "24px bold Arial";
		y += 24;
		this.renderer.ctx.fillText("Press R to restart",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press M to return to menu",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press T to quit to title",x,y);
	}
	if (this.state == "win") {
		this.renderer.ctx.fillStyle = "#777777";
		this.renderer.ctx.fillRect(0,0,this.width,this.height);
		this.renderer.ctx.fillStyle = "#00ff00";
		this.renderer.ctx.textAlign = "center";
		var x = this.width/2;
		var y = (this.height/3) + 48;
		this.renderer.ctx.font = "96px bold Arial";
		this.renderer.ctx.fillText("YOU WIN!",x,y);
		this.renderer.ctx.font = "24px bold Arial";
		y += 24;
		this.renderer.ctx.fillText("Press R to restart",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press M to return to menu",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press L to load the next level",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press T to quit to title",x,y);
	}
	if (this.state == "complete") {
		this.renderer.ctx.fillStyle = "#777777";
		this.renderer.ctx.fillRect(0,0,this.width,this.height);
		this.renderer.ctx.fillStyle = "#FFA300";
		this.renderer.ctx.textAlign = "center";
		var x = this.width/2;
		var y = (this.height/3) + (64 / 2);
		this.renderer.ctx.font = "64px bold Arial";
		this.renderer.ctx.fillText("GAME COMPLETE!",x,y);
		this.renderer.ctx.font = "24px bold Arial";
		y += 24;
		this.renderer.ctx.fillText("Press M to return to menu",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press T to quit to title",x,y);
		y += 24;
		this.renderer.ctx.fillText("Press C to view credits",x,y);
		
	}
}

var game = null;
var loop = null;

window.onload = function(){
	game = new Game();
	game.init("gameScreen");
	loop = setInterval(function(){game.tick();},game.timing);
}