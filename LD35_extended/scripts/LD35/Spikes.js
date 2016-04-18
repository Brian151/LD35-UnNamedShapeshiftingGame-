var Spikes = function(parent,x,y) {
	this.parent = parent;
	this.x = (x * 16) - 4;
	this.y = (y * 16) - 4;
	this.width = 16;
	this.height = 16;
	this.isEnemy = true;
	this.sprite = new Sprite(this.x,this.y,GameObjs.badGuySprite,GameObjs.badGuyAnim);
	this.sprite.gotoAndStop("spike");
	this.collisionRect = {
		"x":this.x + 4,
		"y":this.y + 4,
		"width":this.width,
		"height":this.height
	};
}
Spikes.prototype.draw = function() {
	this.sprite.draw();
	GameObjs.renderer.ctx.fillStyle = "rgba(255,0,0,.5)";
	//GameObjs.renderer.ctx.fillRect(this.collisionRect.x,this.collisionRect.y,this.collisionRect.width,this.collisionRect.height);
}
Spikes.prototype.tick = function() {
	var hurtPlayer = checkCollision(this.collisionRect,this.parent.player);
	if (hurtPlayer) {
		if (this.parent.player.dmg.spike) this.parent.player.takeHit(1 * this.parent.player.dmg.spike);
	}
}