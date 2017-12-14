import * as CANNON from 'cannon';

export const RAMP_MATERIAL_NAME = 'rampMaterial';
export const material = new CANNON.Material(RAMP_MATERIAL_NAME);

const boxes = [
  { size: [6, 1, 3], offset: [0, -0.8, 5], rotation: 0.15 },
  { size: [6, 1, 3], offset: [0, 0.1, -1], rotation: 0.2 },
  { size: [6, 1, 3], offset: [0, 1.8, -7], rotation: 0.35 },
];


export default function createTree({ position }) {
  const ramp = new CANNON.Body({
    position: new CANNON.Vec3(position.x, 0, -position.y),
    material,
    type: CANNON.Body.STATIC,
  });

  boxes.forEach((box) => {
    const quaternion = new CANNON.Quaternion();

    quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), box.rotation);

    ramp.addShape(
      new CANNON.Box(new CANNON.Vec3(...box.size)),
      new CANNON.Vec3(...box.offset),
      quaternion
    );
  });

  return ramp;
}
