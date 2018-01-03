const Honeycomb = require('./webgl/scene/Honeycomb');
// const SpinningBox = require('./webgl/scene/SpinningBox');

const { assets, webgl, gui } = require('./context');

module.exports = function () {
  // Set background color
  const background = 'white';
  document.body.style.background = background;
  webgl.renderer.setClearColor(background);

  // Hide canvas
  webgl.canvas.style.visibility = 'hidden';

  // Preload any queued assets
  assets.loadQueued(() => {
    console.log('Done loading');

    // Show canvas
    webgl.canvas.style.visibility = '';

    // To avoid page pulling and such
    webgl.canvas.addEventListener('touchstart', ev => ev.preventDefault());

    // Add any "WebGL components" here...
    // webgl.scene.add(new SpinningBox());
    webgl.scene.add(new Honeycomb());

    // start animation loop
    webgl.start();
    webgl.draw();
  });
};
