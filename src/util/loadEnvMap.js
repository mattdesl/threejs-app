const noop = () => {};
const EquiToCube = require('./EquiToCube');
const loadTexture = require('./loadTexture');
const clamp = require('clamp');

module.exports = function loadEnvMap (opt = {}, cb = noop) {
  const renderer = opt.renderer;
  const basePath = opt.url;
  if (!renderer) throw new Error('PBR Map requires renderer to be set on AssetManager!');

  if (opt.equirectangular) {
    const equiToCube = new EquiToCube(renderer);
    loadTexture(basePath, { renderer }, (err, tex) => {
      if (err) return cb(err);
      equiToCube.convert(tex);
      tex.dispose(); // dispose original texture
      tex.image.data = null; // remove Image reference
      onCubeMapLoaded(equiToCube.cubeTexture);
    });
    return equiToCube.cubeTexture;
  } else {
    const isHDR = opt.hdr;
    const extension = isHDR ? '.hdr' : '.png';
    const urls = genCubeUrls(basePath.replace(/\/$/, '') + '/', extension);

    if (isHDR) {
      // load a float HDR texture
      return new THREE.HDRCubeTextureLoader()
        .load(THREE.UnsignedByteType, urls, onCubeMapLoaded, noop, onError);
    } else {
      // load a RGBM encoded texture
      return new THREE.CubeTextureLoader()
        .load(urls, cubeMap => {
          cubeMap.encoding = THREE.RGBM16Encoding;
          onCubeMapLoaded(cubeMap);
        }, noop, onError);
    }
  }

  function onError () {
    const err = new Error(`Could not load PBR map: ${basePath}`);
    console.error(err);
    cb(err);
    cb = noop;
  }

  function onCubeMapLoaded (cubeMap) {
    if (opt.pbr || typeof opt.level === 'number') {
      // prefilter the environment map for irradiance
      const pmremGenerator = new THREE.PMREMGenerator(cubeMap);
      pmremGenerator.update(renderer);
      if (opt.pbr) {
        const pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
        pmremCubeUVPacker.update(renderer);
        const target = pmremCubeUVPacker.CubeUVRenderTarget;
        cubeMap = target.texture;
      } else {
        const idx = clamp(Math.floor(opt.level), 0, pmremGenerator.cubeLods.length);
        cubeMap = pmremGenerator.cubeLods[idx].texture;
      }
    }
    if (opt.mapping) cubeMap.mapping = opt.mapping;
    cb(null, cubeMap);
    cb = noop;
  }
}

function genCubeUrls (prefix, postfix) {
  return [
    prefix + 'px' + postfix, prefix + 'nx' + postfix,
    prefix + 'py' + postfix, prefix + 'ny' + postfix,
    prefix + 'pz' + postfix, prefix + 'nz' + postfix
  ];
}
