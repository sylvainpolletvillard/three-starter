import * as THREE from "three"

let projectiles: Set<Projectile> = new Set()

interface Projectile {
    mesh: THREE.Mesh
    velocity: THREE.Vector3
    size: number
    lifetime: number
    life: number
    alpha: number
}

export function updateProjectiles(timeElapsed: number, scene: THREE.Scene){
    for(let p of projectiles){
        p.life -= timeElapsed;
        p.mesh.position.add(p.velocity.clone().multiplyScalar(timeElapsed/1000));
        if(p.life < 0){
            scene.remove(p.mesh)
            projectiles.delete(p)
        } 
    }
}

export function spawnProjectile({ position, velocity, size = 1, lifetime = 1000, scene }: {
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    size?: number,
    lifetime?: number,
    scene: THREE.Scene
}){    
    const geometry = new THREE.SphereGeometry( size, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.copy(position)
    scene.add(mesh)
    
    projectiles.add({
        mesh,
        velocity,
        size,
        lifetime,
        life: lifetime,
        alpha: 1.0
    })
}