var Player = function(parent,x,y,forms) {
	this.parent = parent;
	this.x = x * 16;
	this.y = y * 16;
	this.isPlayer = true;
	this.stats = {
		"human" : {
			"speed" : 3,
			"health" : 10,
			"healthCurr" : 0,
			"width" : 24,
			"height" : 24,
			"spriteOffset" : {
				"x" : 0,
				"y" : 0
			},
			"dmg" : {
				"lava" : true,
				"water" : false,
				"spike" : true,
				"enemy" : true
			},
			"collisionLayers" : {
				"water" : true,
				"wall" : true
			},
			"pain" : {
				"mice" : false
			}
		},
		"cat" : {
			"speed" : 5,
			"health" : 5,
			"healthCurr" : 0,
			"width" : 18,
			"height" : 18,
			"spriteOffset" : {
				"x" : -3,
				"y" : -3
			},
			"dmg" : {
				"lava" : true,
				"water" : false,
				"spike" : true,
				"enemy" : true
			},
			"collisionLayers" : {
				"water" : true,
				"wall" : false
			},
			"pain" : {
				"mice" : true
			}
		},
		"spider" : {
			"speed" : 3,
			"health" : 1,
			"healthCurr" : 0,
			"width" : 8,
			"height" : 8,
			"spriteOffset" : {
				"x" : -8,
				"y" : -8
			},
			"dmg" : {
				"lava" : true,
				"water" : false,
				"spike" : true,
				"enemy" : true
			},
			"collisionLayers" : {
				"water" : true,
				"wall" : false
			},
			"pain" : {
				"mice" : false
			}
		},
		"robot" : {
			"speed" : 4,
			"health" : 15,
			"healthCurr" : 0,
			"width" : 24,
			"height" : 24,
			"spriteOffset" : {
				"x" : 0,
				"y" : 0
			},
			"dmg" : {
				"lava" : true,
				"water" : false,
				"spike" : .75,
				"enemy" : true
			},
			"collisionLayers" : {
				"water" : true,
				"wall" : true
			},
			"pain" : {
				"mice" : false
			}
		},
		"waterdrop" : {
			"speed" : 7,
			"health" : 3,
			"healthCurr" : 0,
			"width" : 8,
			"height" : 8,
			"spriteOffset" : {
				"x" : -8,
				"y" : -8
			},
			"dmg" : {
				"lava" : true,
				"water" : false,
				"spike" : false,
				"enemy" : true
			},
			"collisionLayers" : {
				"water" : false,
				"wall" : true
			},
			"pain" : {
				"mice" : false
			}
		}
	}
	for (var i=0; i < forms.length; i++) {
		var curr = this.stats[forms[i]];
		curr.healthCurr = curr.health;
	}
	this.types = ["human","cat","spider","robot","waterdrop"];
	this.typeLink = 0;
	this.sprite = new Sprite(this.x,this.y,GameObjs.playerSprite,GameObjs.playerAnim);
	this.setStats();
	this.dir = {"x":0,"y":0};
	this.dmgTimer = 0;
	this.hurt = false;
	this.hasMaxHealth = true;
}
Player.prototype.draw = function() {
	//GameObjs.renderer.ctx.fillStyle = "#00ff00";
	//GameObjs.renderer.ctx.fillRect(this.x,this.y,this.width,this.height);
	if(this.hurt) GameObjs.renderer.ctx.globalAlpha = 0.5;
	this.sprite.draw();
	if(this.hurt) GameObjs.renderer.ctx.globalAlpha = 1;
	GameObjs.renderer.ctx.fillStyle = "#dddddd";
	GameObjs.renderer.ctx.fillRect(0,0,100,8);
	GameObjs.renderer.ctx.fillStyle = "#ff0000";
	var hpPerc = this.currHealth / this.health;
	GameObjs.renderer.ctx.fillRect(0,0,100 * hpPerc,8);
}
Player.prototype.typeSwitch = function() {
	var temp = this.typeLink;
	if (temp + 1 < this.types.length) {
		temp++;
	} else {
		temp = 0;
	}
	this.typeLink = temp;
}
Player.prototype.shapeShift = function() {
	var success = false;
	for (var i =0; i < this.types.length; i++) {
		this.typeSwitch();
		var curr = this.stats[this.types[this.typeLink]];
		if (curr.healthCurr > 0) {
			success = true;
			break;
		}
	}
	if (success) {
		this.setStats();
	} else {
		this.parent.state = "lose";
	}
}
Player.prototype.walk = function() {
	//console.log("walk");
	var tempX = this.x;
	var tempY = this.y;
	if(this.dir.x == 1){
		if (this.x < (this.parent.width - this.width) + this.speed) {
			this.x += this.speed;
		} else {
			this.x = (this.parent.width - this.width);
		}
		//console.log("walk right");
	}
	if(this.dir.x == -1){
		if ((this.x - this.speed) >= 0) {
			this.x -= this.speed;
		} else {
			this.x = 0;
		}
		//console.log("walk left");
	}
	if(this.dir.y == 1){
		if (this.y < (this.parent.height - this.height) + this.speed) {
			this.y += this.speed;
		} else {
			this.y = (this.parent.height - this.height);
		}
		//console.log("walk down");
	}
	if(this.dir.y == -1){
		if ((this.y - this.speed) >= 0) {
			this.y -= this.speed;
		} else {
			this.y = 0;
		}
		//console.log("walk up");
	}
	this.dir = {"x":0,"y":0};
	var collided = false;
	if(this.collisionLayers.water) {
		for (var i = 0; i < this.parent.objs.length; i++) {
			var curr = this.parent.objs[i];
			if(curr.isWater) collided = curr.checkPlayerCollision();
			if (collided) {
				this.x = tempX;
				this.y = tempY;
				break;
			}
		}
	}
	if(this.collisionLayers.wall) {
		for (var i = 0; i < this.parent.objs.length; i++) {
			var curr = this.parent.objs[i];
			if(curr.isWall) collided = curr.checkPlayerCollision();
			if (collided) {
				this.x = tempX;
				this.y = tempY;
				break;
			}
		}
	}
	this.sprite.x = this.x + this.spriteOffset.x;
	this.sprite.y = this.y + this.spriteOffset.y;
}
Player.prototype.tick = function() {
	if (this.hurt) {
		if(!(this.dmgTimer % 30) && this.dmgTimer > 0) {
			this.hurt = false;
		} else {
			this.dmgTimer++;
		}
	}
}
Player.prototype.takeHit = function(ouch) {
	if(!this.hurt) {
		this.currHealth -= ouch;
		this.hurt = true;
		this.dmgTimer = 0;
		if (this.hasMaxHealth) this.hasMaxHealth = false;
		this.stats[this.type].healthCurr -= ouch;
		if(this.currHealth <= 0) this.shapeShift();
	}
}
Player.prototype.setStats = function() {
	this.type = this.types[this.typeLink];
	this.speed = this.stats[this.type].speed;
	this.health = this.stats[this.type].health;
	if (this.hasMaxHealth) {
		this.currHealth = this.health;
	} else {
		if(this.currHealth >= this.health) {
			this.currHealth = this.health;
		} else {
			this.currHealth = this.stats[this.type].healthCurr;
		}
	}
	this.width = this.stats[this.type].width;
	this.height = this.stats[this.type].height;
	this.spriteOffset = this.stats[this.type].spriteOffset;
	this.collisionLayers = this.stats[this.type].collisionLayers;
	this.pain = this.stats[this.type].pain;
	this.sprite.x = this.x + this.spriteOffset.x;
	this.sprite.y = this.y + this.spriteOffset.y;
	this.sprite.gotoAndPlayWithin(this.type);
	this.dmg = this.stats[this.type].dmg;
}