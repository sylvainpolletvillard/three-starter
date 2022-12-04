import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const skyMap = await textureLoader.load("assets/textures/galaxy.png");
/*
skyMap.repeat.set(4, 4);
skyMap.wrapS = skyMap.wrapT = THREE.RepeatWrapping;
*/

export function createSkybox(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(1000, 64, 64);
  const material = new THREE.MeshBasicMaterial({
    map: skyMap,
    side: THREE.BackSide,
    transparent: true,
  });

  const skyMesh = new THREE.Mesh(geometry, material);
  return skyMesh
}
