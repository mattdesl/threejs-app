const WebGLApp = require('./webgl/WebGLApp');
const AssetManager = require('./util/AssetManager');
const query = require('./util/query');
const dat = require('dat.gui').default;

// Setup dat.gui
const gui = new dat.GUI();

if (!query.gui) {
  document.querySelector('.dg.ac').style.display = 'none';
}

// Grab our canvas
const canvas = document.querySelector('.main-canvas');

// Setup the WebGLRenderer
const webgl = new WebGLApp({
  canvas
});

// Setup an asset manager
const assets = new AssetManager({
  renderer: webgl.renderer
});

module.exports = {
  assets,
  canvas,
  webgl,
  gui
};
