const loadImg = require('load-img');
const noop = () => {};

module.exports = function loadTexture (src, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  opt = Object.assign({}, opt);
  cb = cb || noop;

  const texture = new THREE.Texture();
  texture.name = src;
  texture.encoding = opt.encoding || THREE.LinearEncoding;
  setTextureParams(src, texture, opt);
  loadImg(src, {
    crossOrigin: 'Anonymous'
  }, (err, image) => {
    if (err) {
      const msg = `Could not load texture ${src}`;
      console.error(msg);
      return cb(new Error(msg));
    }
    texture.image = image;
    texture.needsUpdate = true;
    if (opt.renderer) {
      // Force texture to be uploaded to GPU immediately,
      // this will avoid "jank" on first rendered frame
      opt.renderer.setTexture2D(texture, 0);
    }
    cb(null, texture);
  });
  return texture;
}

function setTextureParams (url, texture, opt) {
  if (typeof opt.flipY === 'boolean') texture.flipY = opt.flipY;
  if (typeof opt.mapping !== 'undefined') {
    texture.mapping = opt.mapping;
  }
  if (typeof opt.format !== 'undefined') {
    texture.format = opt.format;
  } else {
    // choose a nice default format
    const isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;
    texture.format = isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
  }
  if (opt.repeat) texture.repeat.copy(opt.repeat);
  texture.wrapS = opt.wrapS || THREE.ClampToEdgeWrapping;
  texture.wrapT = opt.wrapT || THREE.ClampToEdgeWrapping;
  texture.minFilter = opt.minFilter || THREE.LinearMipMapLinearFilter;
  texture.magFilter = opt.magFilter || THREE.LinearFilter;
  texture.generateMipmaps = opt.generateMipmaps !== false;
}
