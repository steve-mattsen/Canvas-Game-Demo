
import { Animation, SpriteSheet, sprt } from "./Sprites"
import { Obj } from "./Obj"
import { vec, Box } from "./Geo"
import Vars from "./Vars";
import Game from "./Game";
import { v4 as uuid } from 'uuid';

export default function buildWorld() {
	let ss = new SpriteSheet('spritesheet_link', 8, 10);
	let anims: { [id: string]: Animation } = {};

	let idleFrames = [0, 1, 2, 1];
	anims.idle_down = ss.getAnim([0], idleFrames);
	anims.idle_left = ss.getAnim([1], idleFrames);
	anims.idle_up = ss.getAnim([2], [0]);
	anims.idle_right = ss.getAnim([3], idleFrames);

	let blinkInterval = 60;
	anims.idle_down.sprites[0].duration = blinkInterval;
	anims.idle_left.sprites[0].duration = blinkInterval;
	anims.idle_right.sprites[0].duration = blinkInterval;

	let runFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	anims.run_right = ss.getAnim([7], [...runFrames].reverse());
	anims.run_left = ss.getAnim([5], runFrames);
	anims.run_down = ss.getAnim([4], runFrames);
	anims.run_up = ss.getAnim([6], runFrames);

	let lungeDuration = 7;
	anims.run_right.sprites[2].duration = lungeDuration;
	anims.run_right.sprites[7].duration = lungeDuration;
	anims.run_left.sprites[2].duration = lungeDuration;
	anims.run_left.sprites[7].duration = lungeDuration;
	anims.run_down.sprites[2].duration = lungeDuration;
	anims.run_down.sprites[7].duration = lungeDuration;
	anims.run_up.sprites[2].duration = lungeDuration;
	anims.run_up.sprites[7].duration = lungeDuration;

	for (let i = 0; i < 5; i++) {
		const tree_sprite = sprt('tree');
		const tree = new Obj(
			'tree' + i,
			vec(
				Math.floor((Math.random() * Game.camera.width)),
				Math.floor((Math.random() * Game.camera.height) + tree_sprite.image.size.y / 2),
			),
			tree_sprite,
			new Box(
				tree_sprite.drawBox.width * .4,
				tree_sprite.drawBox.height * .75,
				tree_sprite.drawBox.width * .2,
				tree_sprite.drawBox.height * .15,
				{ x: 'center', y: 'bottom' },
			),
		);
		Obj.addObj(tree);
	}

	for (let i = 0; i < 50; i++) {
		const corn_sprite = sprt('corn');
		const corn = new Obj(
			'corn' + i,
			vec(
				Math.floor((Math.random() * Game.camera.width)),
				Math.floor((Math.random() * Game.camera.height) + corn_sprite.image.size.y / 2),
			),
			corn_sprite,
		)
		Obj.addObj(corn);
	}

	genBushes(10);

	randomizeLayout();


	const player = new Obj(
		'player',
		vec(
			(Vars.canvasWidth - ss.rowSize - 1) / (2 * Game.camera.zoom),
			(Vars.canvasHeight - ss.colSize) / (2 * Game.camera.zoom),
		),
		anims.idle_down.sprites[0],
		new Box(0, 0, 10, 8, { x: 'center', y: 'bottom' }),
		anims
	);
	Obj.addObj(player);

	for (let i = 0; i < 1; i++) {
		genTiger();
		genTiger();
		genLion();
	}
}

function genBushes(count: number) {
	let ss = new SpriteSheet('bushes', 3, 5);
	let anim = ss.getAnim([0], [1]);

	for (let i = 0; i < count; i++) {
		const bush = new Obj(
			'bush' + uuid(),
			vec(
				(Vars.canvasWidth - ss.rowSize - 1) / (2 * Game.camera.zoom),
				(Vars.canvasHeight - ss.colSize) / (2 * Game.camera.zoom),
			),
			anim.sprites[0],
		);
		Obj.addObj(bush);
	}

	anim = ss.getAnim([0], [3]);
	for (let i = 0; i < count; i++) {
		const bush = new Obj(
			'bush' + uuid(),
			vec(
				(Vars.canvasWidth - ss.rowSize - 1) / (2 * Game.camera.zoom),
				(Vars.canvasHeight - ss.colSize) / (2 * Game.camera.zoom),
			),
			anim.sprites[0],
		);
		Obj.addObj(bush);
	}

}

function randomizeLayout() {
	let entries = Object.values(Obj.store);
	let currentIndex = entries.length;

	while (currentIndex != 0) {

		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[entries[currentIndex], entries[randomIndex]] = [
			entries[randomIndex], entries[currentIndex]];
	}

	let cols = Math.floor(Math.sqrt(entries.length));
	let colWidth = Math.floor(Game.camera.width / cols);
	let rows = Math.floor(entries.length / cols);
	let rowHeight = Math.floor((Game.camera.height * .9) / rows);
	let randomOffset = .6;
	let i = 0;
	for (const obj of entries) {
		obj.pos.x = (i % cols) * colWidth + (colWidth * .5);
		obj.pos.x += (Math.random() * colWidth * randomOffset) - randomOffset * colWidth;
		obj.pos.y = Game.camera.height * .25;
		obj.pos.y += Math.floor(i / cols) * rowHeight + (rowHeight * .5);
		obj.pos.y += ((Math.random() * rowHeight * randomOffset) - randomOffset) * 2;
		i++;
	}
}

function genTiger() {
	let ss = new SpriteSheet('tiger', 8, 12, 6);
	let anims: { [id: string]: Animation } = {};

	let idleFrames = [10];
	anims.idle_down = ss.getAnim([0], idleFrames);
	anims.idle_left = ss.getAnim([1], idleFrames);
	anims.idle_right = ss.getAnim([2], idleFrames);
	anims.idle_up = ss.getAnim([3], idleFrames);

	let walkFrames = [9, 10, 11, 10];
	anims.run_down = ss.getAnim([0], walkFrames);
	anims.run_left = ss.getAnim([1], walkFrames);
	anims.run_right = ss.getAnim([2], walkFrames);
	anims.run_up = ss.getAnim([3], walkFrames);


	const tiger = new Obj(
		'tiger' + uuid(),
		vec(
			(Vars.canvasWidth - ss.rowSize - 1) / (2 * Game.camera.zoom) + 50,
			(Vars.canvasHeight - ss.colSize) / (2 * Game.camera.zoom) + 50,
		),
		anims.idle_down.sprites[0],
		new Box(0, 0, 20, 35, { x: 'center', y: 'bottom' }),
		anims
	);
	Obj.addObj(tiger);
}

function genLion() {
	let ss = new SpriteSheet('lion', 8, 12, 6);
	let anims: { [id: string]: Animation } = {};

	let idleFrames = [1];
	anims.idle_down = ss.getAnim([0], idleFrames);
	anims.idle_left = ss.getAnim([1], idleFrames);
	anims.idle_right = ss.getAnim([2], idleFrames);
	anims.idle_up = ss.getAnim([3], idleFrames);

	let walkFrames = [0, 1, 2, 1];
	anims.run_down = ss.getAnim([0], walkFrames);
	anims.run_left = ss.getAnim([1], walkFrames);
	anims.run_right = ss.getAnim([2], walkFrames);
	anims.run_up = ss.getAnim([3], walkFrames);

	const lion = new Obj(
		'lion' + uuid(),
		vec(
			(Vars.canvasWidth - ss.rowSize - 1) / (2 * Game.camera.zoom) - 50,
			(Vars.canvasHeight - ss.colSize) / (2 * Game.camera.zoom) + 50,
		),
		anims.idle_down.sprites[0],
		new Box(0, 0, 20, 35, { x: 'center', y: 'bottom' }),
		anims
	);
	Obj.addObj(lion);
}