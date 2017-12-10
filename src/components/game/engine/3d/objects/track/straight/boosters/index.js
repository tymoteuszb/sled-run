import { objectsData } from '../../../../../physics/objects/track/straightBoosters';


export default async function createBoostersForSegment(objects, segmentType) {
  const boosters = [];

  objectsData[segmentType].forEach(({ type, position, rotation }) => {
    const object = objects[type].clone();

    object.rotation.y = rotation / 180 * Math.PI;
    object.position.set(position.x, position.z || 0, -position.y);

    boosters.push(object);
  });

  return boosters;
}
