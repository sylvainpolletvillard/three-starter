import * as THREE from "three"
import { randomVariation } from "./utils/random"

const particlesEmitters: Set<ParticlesEmitter> = new Set();
export interface ParticlesEmitterParams {
    position: THREE.Vector3
    velocity: THREE.Vector3
    spread: number
    nbParticles: number
    nbParticlesPerFrame: number
    lifeTime: number
    particleSize: number
    particleLifeTime: number
    texturePath: string
}

const DEFAULT_PARAMS: ParticlesEmitterParams = {
    position: new THREE.Vector3(0,0,0),
    velocity: new THREE.Vector3(0,0,-1),
    spread: 1,
    nbParticles: 10,
    nbParticlesPerFrame: 1,
    lifeTime: Infinity,
    particleSize: 1,
    particleLifeTime: 1000,
    texturePath: "./assets/textures/fire.png"
}

interface Particle {
    position: THREE.Vector3
    velocity: THREE.Vector3
    size: number
    lifetime: number
    life: number
    color: { r: number, g: number, b: number }
    alpha: number
}

const vertexShader = `
uniform float pointMultiplier;

attribute float size;
attribute vec4 colour;

varying vec4 vColor;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * pointMultiplier / gl_Position.w;

    vColor = colour;
}`

const fragmentShader = `
uniform sampler2D diffuseTexture;

varying vec4 vColor;

void main(){
    gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColor;
}`

export class ParticlesEmitter {    
    camera: THREE.Camera
    material: THREE.ShaderMaterial
    particles: Particle[]
    geometry: THREE.BufferGeometry
    parent: THREE.Object3D | THREE.Group
    points: THREE.Points
    position: THREE.Vector3
    velocity: THREE.Vector3
    spread: number
    nbParticles: number
    nbParticlesPerFrame: number
    life: number
    lifeTime: number
    particleLifeTime: number
    particleSize: number

    constructor({ camera, parent, params: paramsPassed }: { 
        camera: THREE.Camera, 
        parent: THREE.Object3D | THREE.Group,
        params: Partial<ParticlesEmitterParams>
    }) {
        const params = Object.assign({}, DEFAULT_PARAMS, paramsPassed) as ParticlesEmitterParams
        const uniforms = {
            diffuseTexture: {
                value: new THREE.TextureLoader().load(params.texturePath)
            },
            pointMultiplier: {
                value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
            }
        }

        this.material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        })

        this.parent = parent;
        this.camera = camera
        this.position = params.position
        this.velocity = params.velocity
        this.spread = params.spread
        this.nbParticles = params.nbParticles
        this.nbParticlesPerFrame = params.nbParticlesPerFrame
        this.lifeTime = params.lifeTime
        this.life = params.lifeTime
        this.particleLifeTime = params.particleLifeTime
        this.particleSize = params.particleSize
        this.particles = [];

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.Float64BufferAttribute([], 3))

        this.points = new THREE.Points(this.geometry, this.material)
        parent.add(this.points)

        this.addParticles();
        this.updateGeometry();
        particlesEmitters.add(this)
    }
    
    destroy(){        
        this.parent.remove(this.points)
        this.geometry.dispose()
        particlesEmitters.delete(this) 
    }

    addParticles(){
        for(let i=0; i<this.nbParticlesPerFrame; i++){
            const lifetime = randomVariation(this.particleLifeTime, .25)
            const spreadVector = new THREE.Vector3(
                (Math.random() * 2 - 1),
                (Math.random() * 2 - 1),
                (Math.random() * 2 - 1)
            ).setLength(this.spread)
            this.particles.push({
                position: spreadVector.clone().add(this.position),
                size: randomVariation(this.particleSize, .25),
                lifetime,
                life: lifetime,
                velocity: spreadVector.clone().add(this.velocity),
                color: new THREE.Color(0xffffff),
                alpha: 1.0
            })
        }
    }

    updateGeometry(){
        const positions = this.particles.flatMap(p => [p.position.x, p.position.y, p.position.z]);
        const sizes = this.particles.map(p => p.size)
        const colors = this.particles.flatMap(p => [p.color.r, p.color.g, p.color.b, p.alpha])
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
        this.geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))
        this.geometry.setAttribute("colour", new THREE.Float32BufferAttribute(colors, 4));
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.geometry.attributes.colour.needsUpdate = true;
    }

    updateParticles(timeElapsed: number){
        for(let p of this.particles){
            p.life -= timeElapsed;
            p.alpha = p.life/p.lifetime
            p.position.add(p.velocity.clone().multiplyScalar(timeElapsed/1000));
        }
        this.particles = this.particles.filter(p => p.life > 0)
        
        this.particles.sort((a,b) => {
            const d1 = this.camera.position.distanceToSquared(a.position)
            const d2 = this.camera.position.distanceToSquared(b.position)
            return d2 - d1
        })
    }

    update(timeElapsed: number){
        if(this.particles.length < this.nbParticles) this.addParticles()
        this.updateParticles(timeElapsed)
        this.updateGeometry()
        this.life -= timeElapsed
        if(this.life <= 0) this.destroy()
    }
}

export function updateParticles(timeElapsed: number){
    particlesEmitters.forEach(emitter => emitter.update(timeElapsed))
}