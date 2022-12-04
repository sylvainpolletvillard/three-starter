import * as THREE from "three";
import { createCamera, lockCamera, moveCameraTo, updateCamera } from "./camera";
import { checkCollisions } from "./collisions";
import { handleCursor, initCursor } from "./cursor";
import { spawnEnemy, updateEnemies } from "./enemies";
import { gameState, updateGameState, type GameState } from "./gamestate";
import { SOUNDS } from "./loader";
import { updateParticles } from "./particles";
import { Player } from "./player";
import { initPostprocessing, renderWithPostProcessing } from "./postprocessing";
import { updateProjectiles } from "./projectiles";
import { createSkybox } from "./skybox";
import { randomBetween } from "./utils/random";

let game: Game;

export function getGame(){ return game }
export class Game {
    player: Player
    state: GameState
    score: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer

    constructor(renderer: THREE.WebGLRenderer){
        this.renderer = renderer
        this.score = 0;
        game = this

        //Scene and Camera
        this.scene = new THREE.Scene();        
        this.camera = createCamera(renderer);
        this.player = new Player(this.scene, this.camera)
        this.state = gameState
        
        const skybox = createSkybox()
        this.scene.add(skybox)

        this.scene.add(this.camera)

        const ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        initPostprocessing(this.scene, this.camera, renderer)
        initCursor();

        moveCameraTo(this.player.object!, 2500).then(() => {
            lockCamera()
            this.spawnNextEnemy()
        })

        const music = SOUNDS.get("music")!
        music.setLoop(true)
        music.setVolume(0.5)
        music.play()

        //Main Loop
        let t = performance.now();
        this.renderer.setAnimationLoop(() => {
            const t2 = performance.now()
            const timeElapsed = t2 - t;
            this.update(timeElapsed, this.scene)
            updateCamera(timeElapsed);
            renderWithPostProcessing(this.scene);
            handleCursor(this.camera)
            t=t2
        });
    }

    update(timeElapsed: number, scene: THREE.Scene){
        this.player.update(timeElapsed, scene);
        updateGameState(timeElapsed);
        updateProjectiles(timeElapsed, scene);
        updateEnemies(timeElapsed, scene);
        updateParticles(timeElapsed);
        checkCollisions();
    }

    spawnNextEnemy(){
        spawnEnemy({
            position: new THREE.Vector3(randomBetween(-230, +230), 0, 1000),
            velocity: new THREE.Vector3(0,0,-250),
            camera: this.camera,
            scene: this.scene
        })
        const delay = Math.max(100, 3000 - (this.state.time/100))
        setTimeout(() => this.spawnNextEnemy(), delay)
    }
}