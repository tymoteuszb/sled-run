import * as CANNON from 'cannon';
import { clamp } from 'lodash';
import { times, identity } from 'ramda';

import createGround from './objects/ground';
import createPlayer from './objects/player';
import createWorld from './objects/world';
import createTrack from './objects/track';
import { material as coinMaterial } from './objects/track/objects/coin/';


export default class Physics {
  constructor(trackData) {
    this.world = createWorld();

    this.player = createPlayer();
    this.world.addBody(this.player);

    this.ground = createGround();
    this.world.addBody(this.ground);

    createTrack(trackData).forEach((object, index) => {
      this.world.addBody(object);
      switch (object.material.name) {
        case coinMaterial:
          object.addEventListener('collide', (e) => this.handleCollide(e, index));
          break;
        default:
          return null;
      }
    });

    this.rotation = 0;
    this.realRotation = 0;

    window.addEventListener('keydown', ({ key }) => {
      if (key === 'ArrowLeft') {
        this.rotation = -1;
      } else if (key === 'ArrowRight') {
        this.rotation = 1;
      }
    });

    window.addEventListener('keyup', () => {
      this.rotation = 0;
    });
  }

  onCollideHandler = identity;

  set onCollide(fn) {
    this.onCollideHandler = fn;
  }

  handleCollide = (e, index) => {
    console.log('kolizja', e, index)
    this.coins[index].removeEventListener('collide', (e) => this.handleCollide(e, index));
    this.world.remove(this.coins[index]);
    this.onCollideHandler(e, index);
  };

  update() {
    this.realRotation = clamp(this.realRotation + this.rotation * 0.05, -1, 1);
    this.player.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -0.5, -0.5), 0.2 * Math.PI * this.realRotation);
    this.player.applyLocalForce(new CANNON.Vec3(this.realRotation * 60, 0, -150), new CANNON.Vec3(0, 0, 0));
    this.world.step(1 / 60);
  }
}
