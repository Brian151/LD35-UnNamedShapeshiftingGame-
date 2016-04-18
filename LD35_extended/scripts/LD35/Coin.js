var Coin = function(parent,x,y,value) {
	this.parent = parent;
	this.x = (x * 16) - 6;
	this.y = (y * 16) - 6;
	this.width = 12;
	this.height = 12;
	this.isPickup = true;
	this.sprite = new Sprite(this.x,this.y,GameObjs.itemSprite,GameObjs.itemAnim);
	this.sprite.gotoAndStop("coin" + value);
	this.value = value;
	this.dead = false;
	this.collisionRect = {
		"x":this.x + 6,
		"y":this.y + 6,
		"width":this.width,
		"height":this.height
	};
}
Coin.prototype.draw = function() {
	this.sprite.draw();
	GameObjs.renderer.ctx.fillStyle = "rgba(0,255,255,.5)";
	//GameObjs.renderer.ctx.fillRect(this.collisionRect.x,this.collisionRect.y,this.collisionRect.width,this.collisionRect.height);
}
Coin.prototype.tick = function() {
	var getTaken = checkCollision(this.collisionRect,this.parent.player);
	if (getTaken) {
		this.parent.score.coins += this.value;
		this.dead = true;
	}
}