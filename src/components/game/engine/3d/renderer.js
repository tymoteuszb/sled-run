import * as THREE from 'three';


export default function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  return renderer;
}
