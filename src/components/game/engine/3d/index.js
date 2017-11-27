import * as CANNON from 'cannon';
import * as THREE from 'three';

import createScene from './scene';
import createCamera from './camera';
import createRenderer from './renderer';
import createLight from './light';

import createPlayer from './objects/player';
import createSky from './objects/sky';
import createTrack from './objects/track';

window.THREE = THREE;
window.CANNON = CANNON;

require('cannon/tools/threejs/CannonDebugRenderer');


export default class Engine3D {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();
  light = createLight();

  constructor(renderTarget, physics) {
    this.physics = physics;

    this.scene.add(this.light);
    this.scene.add(this.camera);

    this.cannonDebugRenderer = new THREE.CannonDebugRenderer(this.scene, this.physics.world);

    renderTarget.appendChild(this.renderer.domElement);
  }

  async load() {
    this.player = await createPlayer();
    this.sky = await createSky();
    this.track = await createTrack();

    this.scene.add(this.player, this.sky, this.track);
  }

  updateViewport = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  updatePlayer = () => {
    this.player.position.copy(this.physics.player.position);
    this.player.quaternion.copy(this.physics.player.quaternion);
  }

  render = () => {
    this.updatePlayer();
    this.renderer.render(this.scene, this.camera);
    this.cannonDebugRenderer.update();
  };
}
