import * as THREE from 'three';
import type { Ref } from 'vue';
import { getDirectionVector, hasArrowKeyPressed, initControls, watchKey } from "./controls";
import { spawnExplosion } from './explosion';
import { getGame } from './game';
import { MODELS, SOUNDS } from './loader';
import { ParticlesEmitter } from './particles';
import { spawnProjectile } from './projectiles';
import { range } from './utils/array';
import { throttle } from './utils/functions';
import { clamp } from './utils/number';

const MAX_VELOCITY = 2
const ACCELERATION = 4
const MAX_X = 250

export class Player {
    object: THREE.Group| null
    velocity: THREE.Vector3;
    particlesEmitters: ParticlesEmitter[]
    fire: Ref<boolean>;

    constructor(scene: THREE.Scene, camera: THREE.Camera){
        this.object = MODELS.get("Spitfire")!;
        this.object.scale.set(10,10,10)

        this.particlesEmitters = []
        this.velocity = new THREE.Vector3()
        this.fire = watchKey("Space");
        this.fireProjectile = throttle(this.fireProjectile.bind(this), 250)
        
        scene.add(this.object)
        this.addReactors(camera)
        initControls()
    }

    addReactors(camera: THREE.Camera){
        this.particlesEmitters = range(0,4).map(i => new ParticlesEmitter({
            camera,
            parent: this.object!,
            params: {
                position: new THREE.Vector3(4.5 * (i>=2 ? 1 : -1), i%2 ? 0.1 : -1.3, -2.1),
                velocity: new THREE.Vector3(0,0,-5),
                spread: 0.3,
                nbParticles: 50,
                particleLifeTime: 250,
                particleSize: 25
            }
        }))
    }

    fireProjectile(scene: THREE.Scene){
        SOUNDS.get("shoot")!.play();
        spawnProjectile({
            position: this.object!.position.clone().add(new THREE.Vector3(0,-2,40)),
            velocity: new THREE.Vector3(0,0, 500),
            lifetime: 5000,
            size: 2,
            scene
        })
    }

    update(timeElapsed: number, scene: THREE.Scene){
        if(!this.object) return;
        const [ax, ay] = getDirectionVector()
        this.velocity.x = clamp(this.velocity.x + ax * -1 * ACCELERATION * timeElapsed/1000, -MAX_VELOCITY, +MAX_VELOCITY)
        if(!hasArrowKeyPressed()){
            this.velocity.lerp(new THREE.Vector3(0,0,0), 0.05)
        }
        
        this.object.rotation.set(0, 0, this.velocity.x * (-Math.PI/4) / MAX_VELOCITY)
        this.object.position.add(this.velocity)
        this.object.position.x = clamp(this.object.position.x, -MAX_X, +MAX_X)

        if(this.fire.value === true) this.fireProjectile(scene)
    }

    get hitbox(){
        this.object?.updateMatrixWorld(true)
        return new THREE.Box3().setFromObject(this.object!);        
    }

    onHit(){
        console.log("player hit !")
        const { scene, camera } = getGame()
        SOUNDS.get("hit")!.play();
        spawnExplosion(this.object!.position, 40, scene, camera);
    }

}