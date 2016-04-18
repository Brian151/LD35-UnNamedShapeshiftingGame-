var Wall = function(parent,configData) {
	this.parent = parent;
	this.collisionField = configData;
	this.collisionField.x *= 16;
	this.collisionField.y *= 16;
	this.collisionField.width *= 16;
	this.collisionField.height *= 16;
	this.isWall = true;
	for (var i=0; i < this.collisionField.subRects.length; i++) {
		var curr = this.collisionField.subRects[i];
		curr.x *= 16;
		curr.y *= 16;
		curr.width *= 16;
		curr.height *= 16;
	}
}
Wall.prototype.checkPlayerCollision = function() {
	var playerInBounds = checkCollision(this.parent.player,this.collisionField);
	var playerCollided = false;
	if (playerInBounds) {
		var playerHit = false;
		for (var i=0; i < this.collisionField.subRects.length; i++) {
			var curr = this.collisionField.subRects[i];
			playerHit = checkCollision(this.parent.player,curr)
			if (playerHit) {
				playerCollided = true;
				break;
			}
		}
	}
	return playerCollided;
}
Wall.prototype.checkEnemyCollision = function(e) {
	var enemyInBounds = checkCollision(e,this.collisionField);
	var enemyCollided = false;
	if (enemyInBounds) {
		var enemyHit = false;
		for (var i=0; i < this.collisionField.subRects.length; i++) {
			var curr = this.collisionField.subRects[i];
			enemyHit = checkCollision(e,curr)
			if (enemyHit) {
				enemyCollided = true;
				//console.log("enemy hit wall");
				break;
			}
		}
	}
	return enemyCollided;
}
Wall.prototype.tick = function() {
	
}
Wall.prototype.draw = function() {
	if(this.collisionField.debug) {
		GameObjs.renderer.ctx.strokeRect(this.collisionField.x,this.collisionField.y,this.collisionField.width,this.collisionField.height);
		for (var i=0; i < this.collisionField.subRects.length; i++) {
			var curr = this.collisionField.subRects[i];
			GameObjs.renderer.ctx.strokeRect(curr.x,curr.y,curr.width,curr.height);
		}
	}
}