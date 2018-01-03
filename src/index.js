global.THREE = require('three');

// include any additional ThreeJS vendor libraries here
require('three/examples/js/loaders/GLTFLoader.js');

// ensure context is loaded before entry
require('./context');

// now start up WebGL app
require('./startup')();
