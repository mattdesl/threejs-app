const { gui, webgl, assets } = require('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
const gltfKey = assets.queue({
  url: 'assets/models/honeycomb.gltf'
});

module.exports = class Honeycomb extends THREE.Object3D {
  constructor () {
    super();

    // now fetch the loaded resource
    const gltf = assets.get(gltfKey);

    this.material = new LiveShaderMaterial(honeyShader, {
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color('rgb(213,70,70)') },
        colorB: { value: new THREE.Color('rgb(223,191,86)') }
      }
    });

    // Replaces all meshes material with something basic
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.material = this.material;

        // ThreeJS attaches something odd here on GLTF ipmport
        child.onBeforeRender = () => {};
      }
    });

    this.add(gltf.scene);

    if (gui) { // assume it can be falsey, e.g. if we strip dat-gui out of bundle
      // attach dat.gui stuff here as usual
      const folder = gui.addFolder('honeycomb');
      const settings = {
        colorA: this.material.uniforms.colorA.value.getStyle(),
        colorB: this.material.uniforms.colorB.value.getStyle()
      };
      const update = () => {
        this.material.uniforms.colorA.value.setStyle(settings.colorA);
        this.material.uniforms.colorB.value.setStyle(settings.colorB);
      };
      folder.addColor(settings, 'colorA').onChange(update);
      folder.addColor(settings, 'colorB').onChange(update);
      folder.open();
    }
  }

  update (dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    this.rotation.y += dt * 0.1;
    this.material.uniforms.time.value = time;
  }

  onTouchStart (ev, pos) {
    const [ x, y ] = pos;
    console.log('Touchstart / mousedown: (%d, %d)', x, y);

    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
      pos[0] / webgl.width * 2 - 1,
      -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(this, true);
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');
  }

  onTouchMove (ev, pos) {
  }

  onTouchEnd (ev, pos) {
  }
};
