import { ref, type Ref } from "vue";
import { Player } from "./player";
import { updateProjectiles } from "./projectiles";

export let game: Ref<Game>;

export class Game {
    player: Player

    constructor(scene: THREE.Scene, camera: THREE.Camera){
        this.player = new Player(scene, camera)
        game = ref(this)
    }

    update(timeElapsed: number, scene: THREE.Scene){
        this.player.update(timeElapsed, scene);
        updateProjectiles(timeElapsed, scene);
    }
}