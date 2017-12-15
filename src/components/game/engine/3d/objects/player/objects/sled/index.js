import { createTexturizedObject } from '../../../../utils';
import geometry from './sled.json';
import texture from './sled.jpg';


export default function createSanta() {
  return createTexturizedObject(geometry, texture);
}
