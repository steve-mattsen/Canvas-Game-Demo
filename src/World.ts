
import { Animation, SpriteSheet, sprt } from "./Sprites"
import { Obj } from "./Obj"
import { vec, Box } from "./Geo"
import Vars from "./Vars";
import Game from "./Game";

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

	for (let i = 0; i < 10; i++) {
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
		const bush_sprite = sprt('bush');
		const bush = new Obj(
			'bush' + i,
			vec(
				Math.floor((Math.random() * Game.camera.width)),
				Math.floor((Math.random() * Game.camera.height) + bush_sprite.image.size.y / 2),
			),
			bush_sprite,
		)
		Obj.addObj(bush);
	}
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

	genTiger();
}

function randomizeLayout() {
	let entries = Object.values(Obj.store);
	entries.sort((a, b) => Math.random() - Math.random());
	let cols = Math.floor(Math.sqrt(entries.length));
	let colWidth = Math.floor(Game.camera.width / cols);
	let rows = Math.floor(entries.length / cols);
	let rowHeight = Math.floor((Game.camera.height * .9) / rows);
	let randomOffset = 25;
	let i = 0;
	for (const obj of entries) {
		obj.pos.x = (i % cols) * colWidth + (colWidth * .5);
		obj.pos.x += (Math.random() * randomOffset) - randomOffset;
		obj.pos.y = Game.camera.height * .25;
		obj.pos.y += Math.floor(i / cols) * rowHeight + (rowHeight * .5);
		obj.pos.y += ((Math.random() * randomOffset) - randomOffset) * 2;
		i++;
	}
}

function genTiger() {
	let ss = new SpriteSheet('tiger', 8, 12);
	let anims: { [id: string]: Animation } = {};

	let idleFrames = [1];
	anims.idle_down = ss.getAnim([0], idleFrames);
	anims.idle_left = ss.getAnim([1], idleFrames);
	anims.idle_right = ss.getAnim([2], idleFrames);
	anims.idle_up = ss.getAnim([3], [0]);

	let walkFrames = [0, 1, 2, 1];
	anims.run_down = ss.getAnim([0], idleFrames);
	anims.run_left = ss.getAnim([1], idleFrames);
	anims.run_right = ss.getAnim([2], idleFrames);
	anims.run_up = ss.getAnim([3], [0]);


	const tiger = new Obj(
		'tiger',
		vec(
			(Vars.canvasWidth - ss.rowSize - 1) / (2 * Game.camera.zoom) + 50,
			(Vars.canvasHeight - ss.colSize) / (2 * Game.camera.zoom) + 50,
		),
		anims.idle_down.sprites[0],
		new Box(0, 0, 10, 8, { x: 'center', y: 'bottom' }),
		anims
	);
	Obj.addObj(tiger);
}