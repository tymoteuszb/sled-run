import * as THREE from 'three';
import * as CANNON from 'cannon';

import createScene from './scene';
import createCameras, { updateCameras } from './cameras';
import createRenderer, { updateRenderer } from './renderer';
import createLight, { createPlayerLights } from './light';
import createSnow from './objects/snow';

import createPlayer from './objects/player';
import createSky from './objects/sky';
import createTrack from './objects/track';
import createSnowdriftExplosion, { explode } from './objects/track/objects/snowdriftExplosion';
import { GREEN_PLAYER, RED_PLAYER } from '../../../../../server/helpers';


window.THREE = THREE;
window.CANNON = CANNON;

require('cannon/tools/threejs/CannonDebugRenderer');


export default class Engine3D {
  scene = createScene();
  cameras = createCameras();
  renderer = createRenderer();
  light = createLight();
  playerLights = createPlayerLights();

  constructor(renderTarget, physics, trackData) {
    this.physics = physics;
    this.physics.world.addEventListener('removeBody', this.handleRemoveObject);
    this.physics.onSnowdriftCollide = this.handleSnowdriftCollide;

    this.trackData = trackData;

    this.scene.add(this.light);

    this.cannonDebugRenderer = new THREE.CannonDebugRenderer(this.scene, this.physics.world);

    renderTarget.appendChild(this.renderer.domElement);
  }

  async load() {
    this.players = [await createPlayer(GREEN_PLAYER), await createPlayer(RED_PLAYER)];
    this.track = await createTrack(this.trackData);
    this.snowdriftExplosion = await createSnowdriftExplosion();
    this.sky = await createSky();
    this.snow = await createSnow();

    this.players.forEach((player, index) => player.add(this.cameras[index], this.playerLights[index]));

    this.debugCamera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    this.debugCamera.position.set(0, 300, -100);
    this.debugCamera.lookAt(new THREE.Vector3(0, 0, -100));
    this.scene.add(this.debugCamera);

    // this.scene.add(new THREE.DirectionalLightHelper(this.playerLights[1], 3));

    this.scene.add(this.track, this.sky, ...this.players);
  }

  handleRemoveObject = ({ body }) => {
    const objectToRemove = this.scene.getObjectByName(body.userData.name);
    objectToRemove.parent.remove(objectToRemove);
  };

  handleSnowdriftCollide = async (body) => {
    const snowdrift = this.scene.getObjectByName(body.userData.name);
    const snowdriftWorldPosition = snowdrift.parent.localToWorld(snowdrift.position.clone());
    const snowdriftExplosion = this.snowdriftExplosion.clone();

    snowdriftExplosion.position.copy(snowdriftWorldPosition);

    this.scene.add(snowdriftExplosion);

    await explode(snowdriftExplosion);

    this.scene.remove(snowdriftExplosion);
  };

  updateViewport = () => {
    updateRenderer(this.renderer);
    updateCameras(this.cameras);
  };

  syncWorld = () => {
    this.players.forEach((player, index) => {
      player.position.copy(this.physics.players[index].position);
      player.quaternion.copy(this.physics.players[index].quaternion);
    });

    this.physics.dynamicObjects.forEach(object => {
      const sceneObject = this.scene.getObjectByName(object.userData.name);

      sceneObject.position.copy(object.position);
      sceneObject.quaternion.copy(object.quaternion);

      sceneObject.parent.updateMatrixWorld();
      sceneObject.applyMatrix(new THREE.Matrix4().getInverse(sceneObject.parent.matrixWorld));
    });
  };

  render = () => {
    this.syncWorld();
    //
    // this.players.forEach((player, index) => {
    //   const camera = this.cameras[index];
    //
    //   this.sky.position.copy(player.position);
    //   camera.add(this.snow);
    //   this.renderer.setViewport(camera.userData.x, 0, camera.userData.width, window.innerHeight);
    //   this.renderer.setScissor(camera.userData.x, 0, camera.userData.width, window.innerHeight);
    //   this.renderer.setScissorTest(true);
    //   this.renderer.render(this.scene, camera);
    //   camera.remove(this.snow);
    // });

    this.renderer.render(this.scene, this.debugCamera);

    this.cannonDebugRenderer.update();
  };
}
