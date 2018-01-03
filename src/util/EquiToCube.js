const CUBE_FACE_SIZE = 1024;

let _maxSize = null;
let _sphere;
let _timer;

function EquiToCube (renderer) {
  this.renderer = renderer;

  if (_maxSize === null) {
    const gl = renderer.getContext();
    _maxSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
  }

  this.material = new THREE.MeshBasicMaterial({
    map: null,
    side: THREE.BackSide
  });
  if (!_sphere) {
    _sphere = new THREE.SphereBufferGeometry(100, 256, 64);
  }

  this.mesh = new THREE.Mesh(_sphere, this.material);
  this.scene = new THREE.Scene();
  this.scene.add(this.mesh);

  const mapSize = Math.min(CUBE_FACE_SIZE, _maxSize);
  this.camera = new THREE.CubeCamera(1, 1000, mapSize);
  this.cubeTexture = this.camera.renderTarget.texture;

  // After N seconds, dispose the sphere geometry
  // and let it be re-created if necessary
  clearTimeout(_timer);
  _timer = setTimeout(() => {
    _sphere.dispose();
  }, 3000);
}

EquiToCube.prototype.convert = function (map) {
  this.material.map = map;
  this.material.needsUpdate = true;
  this.camera.update(this.renderer, this.scene);
};

module.exports = EquiToCube;
