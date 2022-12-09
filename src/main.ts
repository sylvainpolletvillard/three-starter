import "./css/index.css";
import { createApp } from 'vue'
import * as THREE from "three";
import { initPostprocessing } from "./postprocessing";
import { Game, getGame } from "./game";
import Hud from "./components/Hud.vue";
import { loadAssets } from "./loader";
import { gameState } from "./gamestate";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.domElement.style.position = "fixed";
document.body.appendChild(renderer.domElement);

function resize() {
  const game = getGame();
  if(!game) return;
  const availableHeight = window.innerHeight
  game.camera.aspect = window.innerWidth / availableHeight;
  renderer.setSize( window.innerWidth, availableHeight )
  game.camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);

createApp(Hud).mount('#hud')
loadAssets()

export function startGame(){
  const game = new Game(renderer);  
  resize();
  gameState.scene = "game";
  initPostprocessing(game.scene, game.camera, renderer)

  // Expose globals
  Object.assign(window, {
    game: game
  })
}