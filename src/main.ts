import "./css/index.css";
import { createApp } from 'vue'
import * as THREE from "three";
import { createCamera, updateCamera } from "./camera"
import { initPostprocessing, renderWithPostProcessing } from "./postprocessing";
import { handleCursor, initCursor } from "./cursor";
import { Game } from "./game";
import Hud from "./components/Hud.vue";
import { createSkybox } from "./skybox";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.domElement.style.position = "fixed";
document.body.appendChild(renderer.domElement);

function resize() {
  const availableHeight = window.innerHeight
  camera.aspect = window.innerWidth / availableHeight;
  renderer.setSize( window.innerWidth, availableHeight )
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);

initCursor();

//Scene and Camera
const scene = new THREE.Scene();
const { camera, cameraControls } = createCamera(renderer)

const game = new Game(scene, camera);
const skybox = createSkybox()
scene.add(skybox)

scene.add(camera)
resize();

const ambientLight = new THREE.AmbientLight(0x202020);
scene.add(ambientLight);

initPostprocessing(scene, camera, renderer)

createApp(Hud).mount('#hud')

//Main Loop
let t = performance.now();
renderer.setAnimationLoop(() => {
  const t2 = performance.now()
  const timeElapsed = t2 - t;
  game.update(timeElapsed, scene)
  updateCamera(timeElapsed);
  renderWithPostProcessing(scene);
  handleCursor(camera)
  t=t2
});

// Expose globals
Object.assign(window, {
  game,
  scene,
  camera,
  cameraControls
})