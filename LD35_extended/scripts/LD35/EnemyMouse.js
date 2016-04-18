var EnemyMouse = function(parent,x,y) {
	this.parent = parent;
	this.x = (x * 16) - 3;
	this.y = (y * 16) - 3;
	this.width = 15;
	this.height = 19;
	this.isEnemy = true;
	this.sprite = new Sprite(this.x,this.y,GameObjs.badGuySprite,GameObjs.badGuyAnim);
	this.sprite.gotoAndStop("mouse");
	this.dead = false;
	this.collisionRect = {
		"x": this.x + 3,
		"y": this.y + 3,
		"width": this.width,
		"height": this.height
	};
	this.dir = {"x":0,"y":0};
	this.speed = 6;
	this.timing = Math.floor((Math.random() * 100) + 1);
	//this.timing = 10;
	this.timer = 0;
}
EnemyMouse.prototype.draw = function() {
	this.sprite.draw();
	GameObjs.renderer.ctx.fillStyle = "rgba(255,0,0,.5)";
	//GameObjs.renderer.ctx.fillRect(this.collisionRect.x,this.collisionRect.y,this.collisionRect.width,this.collisionRect.height);
}
EnemyMouse.prototype.walk = function() {
	var tempX = this.x;
	var tempY = this.y;
	//console.log("mouse walk");
	if(this.dir.x == 1){
		if (this.collisionRect.x < (this.parent.width - this.width) + this.speed) {
			this.x += this.speed;
		} else {
			this.x = (this.parent.width - this.width);
		}
		//console.log("walk right");
	}
	if(this.dir.x == -1){
		if ((this.collisionRect.x - this.speed) >= 0) {
			this.x -= this.speed;
		} else {
			this.x = 0;
		}
		//console.log("walk left");
	}
	if(this.dir.y == 1){
		if (this.collisionRect.y < (this.parent.height - this.height) + this.speed) {
			this.y += this.speed;
		} else {
			this.y = (this.parent.height - this.height);
		}
		//console.log("walk down");
	}
	if(this.dir.y == -1){
		if ((this.collisionRect.y - this.speed) >= 0) {
			this.y -= this.speed;
		} else {
			this.y = 0;
		}
		//console.log("walk up");
	}
	var collided = false;
	/*for (var i = 0; i < this.parent.objs.length; i++) {
		var curr = this.parent.objs[i];
		if(curr.isWater) collided = curr.checkEnemyCollision(this.collisionRect);
		if (collided) {
			this.x = tempX;
			this.y = tempY;
			break;
		}
	}
	for (var i = 0; i < this.parent.objs.length; i++) {
		var curr = this.parent.objs[i];
		if(curr.isWall) collided = curr.checkEnemyCollision(this.collisionRect);
		if (collided) {
			this.x = tempX;
			this.y = tempY;
			break;
		}
	}*/ //not working right
	
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.collisionRect.x = this.x + 3;
	this.collisionRect.y = this.y + 3;
}
EnemyMouse.prototype.tick = function() {
	var getTaken = checkCollision(this.collisionRect,this.parent.player);
	if (getTaken) {
		if(this.parent.player.pain.mice) {
			this.parent.score.mice++;
		}
		this.dead = true;
	}
	if (!this.dead) {
		if (!(this.timer % this.timing) && this.timer != 0) {
			this.timing = Math.floor((Math.random() * 100) + 1);
			var dX = Math.floor(Math.random() * 3);
			var dY = Math.floor(Math.random() * 3);
			switch (dX){
				case 0 : {
					this.dir.x = 0;
					break;
				}
				case 1 : {
					this.dir.x = 1;
					break;
				}
				case 2 : {
					this.dir.x = -1;
					break;
				}
			}
			switch (dY){
				case 0 : {
					this.dir.y = 0;
					break;
				}
				case 1 : {
					this.dir.y = 1;
					break;
				}
				case 2 : {
					this.dir.y = -1;
					break;
				}
			}
			//console.log("mouse direction");
			//console.log("x : " + this.dir.x);
			//console.log("y : " + this.dir.y);
			this.timer = 0;
		} else {
			this.timer++;
		}
		this.walk();
	}
}