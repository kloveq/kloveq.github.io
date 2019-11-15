const LEVEL1 = [
	[11, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 12],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
	[9, 0, 1, 2, 2, 0, 1, 0, 3, 0, 1, 2, 2, 0, 1, 0, 8],
	[9, 0, 2, 2, 4, 2, 0, 3, 0, 3, 2, 2, 5, 2, 2, 0, 8],
	[9, 2, 2, 4, 1, 4, 3, 0, 0, 0, 3, 5, 1, 5, 2, 2, 8],
	[9, 2, 4, 4, 4, 4, 4, 2, 3, 2, 5, 5, 5, 5, 5, 2, 8],
	[9, 2, 1, 4, 1, 4, 1, 2, 3, 2, 1, 5, 1, 5, 1, 2, 8],
	[9, 2, 2, 4, 4, 4, 2, 0, 3, 0, 2, 5, 5, 5, 2, 2, 8],
	[9, 0, 2, 2, 4, 4, 4, 2, 3, 2, 5, 5, 5, 5, 2, 0, 8],
	[9, 0, 1, 2, 2, 4, 2, 0, 3, 0, 2, 5, 2, 2, 1, 0, 8],
	[9, 0, 0, 0, 2, 2, 4, 2, 3, 2, 5, 2, 2, 0, 0, 0, 8],
	[9, 0, 1, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 1, 0, 8],
	[9, 0, 0, 0, 0, 0, 2, 2, 3, 2, 2, 0, 0, 0, 0, 0, 8],
	[9, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 8],
	[13, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 14]
];

const ENEMY_LEVEL1 = [
	[1, 1],
	[1, 13],
	[13, 13]
];

buildMap = (scene, level, platforms) => {
	level.forEach((row, rowIndex) => {
		row.forEach((index, colIndex) => {
			switch(index) {
				case 1:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'item_wood').setScale(0.5).refreshBody();
					break;
				case 2:
					item = platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'item_grass').setScale(0.9).refreshBody();
					item.type = 2;
					break;
				case 3:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'item_stone').setScale(0.9).refreshBody();
					break;
				case 6:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'bottom_stone').setScale(0.9);
					break;
				case 7:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'top_stone').setScale(0.9);
					break;
				case 8:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'right_stone').setScale(0.9);
					break;
				case 9:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'left_stone').setScale(0.9);
					break;
				case 11:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'top_left').setScale(0.9);
					break;
				case 12:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'top_right').setScale(0.9);
					break;
				case 13:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'bottom_left').setScale(0.9);
					break;
				case 14:
					platforms.create((colIndex + 0.5) * SIZE, (rowIndex + 0.5) * SIZE, 'bottom_right').setScale(0.9);
					break;
			}
		});
	});
	return platforms;
}

createEnemies = (scene, level, enemies) => {
	level.forEach((row, rowIndex) => {
		enemy = enemies.create(row[0] * SIZE + 22.5, row[1] * SIZE + 22.5, 'boss_down').setScale(0.6);
		enemy.body.allowGravity = false;
		enemy.lasttime = 0;
		enemy.setVelocityY(boss_speed);
	});
	return enemies;
}