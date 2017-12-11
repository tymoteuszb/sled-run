import * as CANNON from 'cannon';


export const material = new CANNON.Material();

export default function createPlayer() {
  const player = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 5, 0),
    shape: new CANNON.Sphere(1.5),
    fixedRotation: true,
    linearDamping: 0.999,
    material,
  });

  player.userData = {
    initialSpeed: 500,
    speed: 500,
    speedBooster: 900,
    speedBoosterTime: 1500,
  };

  return player;
}
