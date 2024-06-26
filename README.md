# React / Canvas Game Demo

This is a project to show my kids how video games work. While cycling through view modes, explain the following:

1. The demo starts with two points moving around the screen. Let them try to move the points outside the screen.
1. Show that we can draw a box using these two points.
1. Instead of just a box, we can draw a picture in the box.
1. Now take away the box and we have just the character.
1. Now if we choose different pictures at different times, we can show action.

Then show the spritesheets and how it's choosing which image to show.

Slow it down to see the process better.

Show the background to explain how world buiilding works.

## Playing

Use `npm start` to start the server.git 

It should automatically open up a browser window to http://localhost:3000. If not, open that 

### Controls
* `WASD / ⬅⬆⬇➡` or right stick on a gamepad to move the box / Link
* Hold `shift` or move the gamepad's right stick to the outer edge to run
* `F1` to switch display mode of the player between: just the sprite, just the bounding box, the sprite and the bounding box
* `F2` to show/hide the spritesheet and the currently selected sprite
* `F3` to switch between 60fps / 15fps
* `F4` to show / hide a grass background
* `F5` to hide / show the option buttons in the bottom right corner
* `F9` to show / hide useful debug information

## Development

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
