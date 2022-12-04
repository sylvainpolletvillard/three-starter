import * as THREE from "three"
import { spawnExplosion } from "./explosion"
import { getGame } from "./game"
import { gameState } from "./gamestate"
import { MODELS } from "./loader"
import { ParticlesEmitter } from "./particles"

let enemies: Set<Enemy> = new Set()

export class Enemy {
    object: THREE.Group
    velocity: THREE.Vector3
    particlesEmitters: ParticlesEmitter[]
    life: number

    constructor(position: THREE.Vector3, velocity: THREE.Vector3, camera: THREE.Camera){
        this.velocity = velocity
        this.life = 3
        this.object = MODELS.get("Challenger")!.clone();
        (this.object.children[0] as THREE.Mesh).material = (this.object.children[0] as THREE.Mesh).material.clone()
        this.object.scale.set(6,6,6)
        this.object.rotateY(Math.PI)
        this.object.position.copy(position)

        this.particlesEmitters = []        
        //this.fireProjectile = throttle(this.fireProjectile.bind(this), 250)
        
        this.addReactors(camera)        
    }
    
    addReactors(camera: THREE.Camera){
        this.particlesEmitters = [new ParticlesEmitter({
            camera,
            parent: this.object!,
            params: {
                position: new THREE.Vector3(0, -0.1, -5),
                velocity: new THREE.Vector3(0,0, -20),
                spread: 0.1,
                nbParticles: 20,
                particleLifeTime: 250,
                particleSize: 20
            }
        })]
    }

    update(timeElapsed: number, scene: THREE.Scene){        
        this.object.position.add(this.velocity.clone().multiplyScalar(timeElapsed/1000));
        if(this.life < 0){
            const { camera } = getGame()
            spawnExplosion(this.object.position, 60, scene, camera);
            scene.remove(this.object)
            enemies.delete(this)
            gameState.score += 1;
        }
    }

    get hitbox(){
        this.object?.updateMatrixWorld(true)
        return new THREE.Box3().setFromObject(this.object!);        
    }

    onHit(){
        this.life -= 1;
        const { scene, camera } = getGame()
        spawnExplosion(this.object.position, 35, scene, camera);
        (this.object.children[0] as THREE.Mesh).material.color.set(0xFF8080);
        setTimeout(() => {
            (this.object.children[0] as THREE.Mesh).material.color.set(0xFFFFFF);
        }, 250)
    }
}

export function getEnemies(): Set<Enemy> {
    return enemies
}

export function updateEnemies(timeElapsed: number, scene: THREE.Scene){
    for(let enemy of enemies) enemy.update(timeElapsed, scene)
}

export function spawnEnemy({ position, velocity, scene, camera }: {
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
}){    
    const enemy = new Enemy(position, velocity, camera)
    scene.add(enemy.object)
    enemies.add(enemy)
}