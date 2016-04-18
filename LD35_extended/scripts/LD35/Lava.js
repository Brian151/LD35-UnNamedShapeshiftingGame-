var Lava = function(parent,configData) {
	this.parent = parent;
	this.collisionField = configData;
	this.collisionField.x *= 16;
	this.collisionField.y *= 16;
	this.collisionField.width *= 16;
	this.collisionField.height *= 16;
	for (var i=0; i < this.collisionField.subRects.length; i++) {
		var curr = this.collisionField.subRects[i];
		curr.x *= 16;
		curr.y *= 16;
		curr.width *= 16;
		curr.height *= 16;
	}
}
Lava.prototype.tick = function() {
	var playerInBounds = checkCollision(this.parent.player,this.collisionField);
	if (playerInBounds) {
		var playerHit = false;
		for (var i=0; i < this.collisionField.subRects.length; i++) {
			var curr = this.collisionField.subRects[i];
			playerHit = checkCollision(this.parent.player,curr)
			if (playerHit) {
				this.parent.player.takeHit(5 * this.parent.player.dmg.lava);
				break;
			}
		}
	}
}
Lava.prototype.draw = function() {
	if(this.collisionField.debug) {
		GameObjs.renderer.ctx.strokeRect(this.collisionField.x,this.collisionField.y,this.collisionField.width,this.collisionField.height);
		for (var i=0; i < this.collisionField.subRects.length; i++) {
			var curr = this.collisionField.subRects[i];
			GameObjs.renderer.ctx.strokeRect(curr.x,curr.y,curr.width,curr.height);
		}
	}
}