import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { shallowRef, type ShallowRef } from "vue";

export type CameraTarget = THREE.Object3D

let camera: THREE.PerspectiveCamera;
let cameraLight: THREE.PointLight;
let controls: OrbitControls;

const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(0, 500, -1000)
export let cameraTarget: ShallowRef<CameraTarget | null> = shallowRef(null);

export function createCamera(renderer: THREE.Renderer){
    camera = new THREE.PerspectiveCamera(
        20, // Field of view
        16 / 9, // Aspect ratio
        0.1, // Near plane
        10000 // Far plane
      );

    cameraLight = new THREE.PointLight(0xffffff, 0.5, 0, 0)
    camera.add(cameraLight)
          
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1
    controls.maxDistance = 5000
    camera.position.set(300, 100, 500);
    camera.lookAt(new THREE.Vector3(0,0,0))
    
    return { camera, cameraControls: controls }
}

let travelling: { 
    from: THREE.Vector3, 
    to: THREE.Vector3, 
    offset: THREE.Vector3,
    duration: number, 
    timeElapsed: number
} | null;

export function moveCameraTo(target: CameraTarget, travellingTime=1000, offset = DEFAULT_CAMERA_OFFSET){   
    disableCameraControls()
    travelling = {
        from: camera.position.clone(),
        to: target.position.clone().add(offset),
        duration: travellingTime,
        offset,
        timeElapsed: 0
    }
}

export function followTarget(target: CameraTarget){
    cameraTarget.value = target
}

export function enableCameraControls(){
    controls.enabled = true
}

export function disableCameraControls(){
    controls.enabled = false
}

export function updateCamera(timeElapsed: number) {
    if(travelling){
        travelling.timeElapsed += timeElapsed
        const travelPercentage = travelling.timeElapsed / travelling.duration
        if(travelPercentage > 1){
            travelling = null
            enableCameraControls()            
        } else {
            camera.position.lerpVectors(travelling.from, travelling.to, travelPercentage);
            camera.lookAt(travelling.to.clone().sub(travelling.offset))
        }        
    } else if(cameraTarget.value){
        controls.target.copy(cameraTarget.value.position)
        controls.update()
    }
}