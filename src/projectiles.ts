import * as THREE from "three"
import { BLOOM_SCENE } from "./postprocessing"

let projectiles: Set<Projectile> = new Set()

export class Projectile {
    mesh: THREE.Mesh
    velocity: THREE.Vector3
    size: number
    lifetime: number
    life: number

    constructor(position: THREE.Vector3, velocity: THREE.Vector3, size?: number, lifetime?: number){
        this.velocity = velocity
        this.lifetime = lifetime ?? 5000
        this.life = this.lifetime
        this.size = size ?? 1

        const geometry = new THREE.SphereGeometry( size, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffe066 } );
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.position.copy(position)
        this.mesh.layers.enable( BLOOM_SCENE );
    }

    update(timeElapsed: number, scene: THREE.Scene){
        this.life -= timeElapsed;
        this.mesh.position.add(this.velocity.clone().multiplyScalar(timeElapsed/1000));
        if(this.life < 0){
            scene.remove(this.mesh)
            projectiles.delete(this)
        }
    }

    get hitbox(): THREE.Sphere {        
       return new THREE.Sphere(this.mesh.position.clone(), this.size)
    }

    destroy(){
        this.life = 0
    }
}

export function getProjectiles(): Set<Projectile> {
    return projectiles
}

export function updateProjectiles(timeElapsed: number, scene: THREE.Scene){
    for(let projectile of projectiles) projectile.update(timeElapsed, scene)
}

export function spawnProjectile({ position, velocity, size = 1, lifetime = 1000, scene }: {
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    size?: number,
    lifetime?: number,
    scene: THREE.Scene
}){    
    const projectile = new Projectile(position, velocity, size, lifetime)
    scene.add(projectile.mesh)
    projectiles.add(projectile)
}