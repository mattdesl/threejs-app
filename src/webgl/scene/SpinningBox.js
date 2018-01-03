module.exports = class SpinningBox extends THREE.Object3D {
  constructor () {
    super();
    this.add(new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        wireframe: true, color: 'black'
      })
    ));
  }

  update (dt = 0) {
    this.rotation.x += dt * 0.1;
  }
};
