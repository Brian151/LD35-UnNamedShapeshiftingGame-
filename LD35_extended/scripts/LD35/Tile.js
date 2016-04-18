var Tile = function(x,y,type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.sprite = new Sprite(this.x,this.y,GameObjs.tileImage,GameObjs.tileAnim);
	this.sprite.gotoAndStop(this.type);
}
Tile.prototype.draw = function() {
	this.sprite.draw();
}