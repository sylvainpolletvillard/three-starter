import * as THREE from "three"
import { ParticlesEmitter } from "./particles";

export function spawnExplosion(position: THREE.Vector3, size: number, scene: THREE.Scene, camera: THREE.PerspectiveCamera){
    const emitter = new ParticlesEmitter({
        camera,
        parent: scene,
        params: {
            position: position.clone(),
            velocity: new THREE.Vector3(0,0,0),
            spread: 16,
            nbParticles: 20+size,
            nbParticlesPerFrame: 2,
            lifeTime: 1000,
            particleLifeTime: 950,
            particleSize: size
        }
    })
    setTimeout(() => { emitter.destroy() }, 500)
}