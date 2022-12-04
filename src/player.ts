import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Ref } from 'vue';
import { moveCameraTo } from './camera';
import { getDirectionVector, hasArrowKeyPressed, initControls, watchKey } from "./controls";
import { ParticlesEmitter } from './particles';
import { spawnProjectile } from './projectiles';
import { range } from './utils/array';
import { throttle } from './utils/functions';
import { clamp } from './utils/number';

export class Player {
    object: THREE.Group| null
    velocity: THREE.Vector3;
    particlesEmitters: ParticlesEmitter[]
    fire: Ref<boolean>;

    constructor(scene: THREE.Scene, camera: THREE.Camera){
        this.object = null;
        this.particlesEmitters = []
        this.velocity = new THREE.Vector3()
        this.fire = watchKey("Space");
        this.fireProjectile = throttle(this.fireProjectile.bind(this), 500)

        const gltfLoader = new GLTFLoader()
        gltfLoader.load('assets/models/Spitfire/glTF/Spitfire.gltf', (gltf: GLTF) => {
            this.object = gltf.scene
            this.object.scale.set(10,10,10)
            scene.add(this.object)
            this.addReactors(camera)
            moveCameraTo(this.object, 2500)
            initControls()
        })
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
                lifeTime: 250,
                particleSize: 25
            }
        }))
    }

    fireProjectile(scene: THREE.Scene){
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
        this.velocity.x = clamp(this.velocity.x + ax * -2 * timeElapsed/1000, -1, +1)  
        this.velocity.y = clamp(this.velocity.y + ay * timeElapsed/1000, -1, +1)
        if(!hasArrowKeyPressed()){
            this.velocity.lerp(new THREE.Vector3(0,0,0), 0.05)
        }
        
        this.object.rotation.set(this.velocity.y * (-Math.PI/32), 0, this.velocity.x * (-Math.PI/4))
        this.object.position.add(this.velocity)
        this.particlesEmitters.forEach(emitter => emitter.update(timeElapsed))

        if(this.fire.value === true) this.fireProjectile(scene)
    }

}