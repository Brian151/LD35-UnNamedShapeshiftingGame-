function checkCollision(o1,o2) {
	var out = false;
	if(
	(o1.x + o1.width >= o2.x && o1.x <= o2.x + o2.width && o1.y + o1.height >= o2.y && o1.y <= o2.y + o2.height) || (o2.x + o2.width >= o1.x && o2.x <= o1.x + o1.width && o2.y + o2.height >= o1.y && o2.y <= o1.y + o1.height)) {
		out = true;
	}
	return out;
}