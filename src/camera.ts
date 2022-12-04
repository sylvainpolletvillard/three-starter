import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { ref, shallowRef, type Ref, type ShallowRef } from "vue";
import { getGame } from "./game";
import { gameState } from "./gamestate";
import { audioListener } from "./loader";

let camera: THREE.PerspectiveCamera;
let cameraLight: THREE.PointLight;
let controls: OrbitControls;

const CAMERA_POSITION_FROM_TARGET = new THREE.Vector3(0, 400, -800)
const CAMERA_OFFSET_TO_TARGET = new THREE.Vector3(0, 80, 0)

export function createCamera(renderer: THREE.Renderer): THREE.PerspectiveCamera {
    camera = new THREE.PerspectiveCamera(
        20, // Field of view
        16 / 9, // Aspect ratio
        0.1, // Near plane
        10000 // Far plane
      );

    cameraLight = new THREE.PointLight(0xffffff, 0.5, 0, 0)
    camera.add(cameraLight)
    camera.add(audioListener)
          
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1
    controls.maxDistance = 5000

    cameraPosition.value = {
        position: new THREE.Vector3(300, 100, 500),
        lookAt: new THREE.Vector3(0, 0, 0)
    }
    
    return camera
}

interface CameraPosition {
    position: THREE.Vector3
    lookAt: THREE.Vector3
}

interface Travelling {
    from: CameraPosition,
    to: CameraPosition,
    duration: number, 
    timeElapsed: number
    onFinish?: () => void
}

export let travelling: Travelling | null;
export let cameraPosition: ShallowRef<CameraPosition> = shallowRef({
    position: CAMERA_POSITION_FROM_TARGET.clone(),
    lookAt: new THREE.Vector3(0,0,0)
});

export function moveCameraTo(target: CameraPosition | THREE.Object3D | THREE.Group, travellingTime=1000): Promise<void> {
    let to: CameraPosition = (target instanceof THREE.Object3D || target instanceof THREE.Group) ?
        { 
            position: target.position.clone().add(CAMERA_POSITION_FROM_TARGET).add(CAMERA_OFFSET_TO_TARGET),
            lookAt: target.position.clone().add(CAMERA_OFFSET_TO_TARGET)
        } : target

    disableCameraControls()
    return new Promise(resolve => {
        travelling = {
            from: cameraPosition.value,
            to: to,
            duration: travellingTime,        
            timeElapsed: 0,
            onFinish: resolve
        }
    })
}

const lockedCameraPosition: Ref<THREE.Vector3 | null> = ref(null)
const lockedCameraTarget: Ref<THREE.Vector3 | null> = ref(null)

export function lockCameraPosition(position: THREE.Vector3){
    lockedCameraPosition.value = position
    disableCameraControls()
}

export function lockCameraTarget(target: THREE.Vector3){
    lockedCameraTarget.value = target
}

export function lockCamera(newCameraPosition: CameraPosition = cameraPosition.value){
    lockCameraPosition(newCameraPosition.position)
    lockCameraTarget(newCameraPosition.lookAt)
}

export function unlockCameraPosition(){
    lockedCameraPosition.value = null;
    enableCameraControls()
}

export function unlockCameraTarget(){
    lockedCameraTarget.value = null;
}

export function unlockCamera(){
    unlockCameraPosition()
    unlockCameraTarget()
}

export function enableCameraControls(){
    controls.enabled = true
}

export function disableCameraControls(){
    controls.enabled = false
}

let lookAtVector = new THREE.Vector3()
export function updateCamera(timeElapsed: number) {
    if(travelling){
        travelling.timeElapsed += timeElapsed
        const travelPercentage = travelling.timeElapsed / travelling.duration
        if(travelPercentage > 1){
            enableCameraControls()
            cameraPosition.value = travelling.to
            if(travelling.onFinish) travelling.onFinish()
            travelling = null
        } else {
            camera.position.lerpVectors(travelling.from.position, travelling.to.position, travelPercentage);
            camera.lookAt(lookAtVector.lerpVectors(travelling.from.lookAt, travelling.to.lookAt, travelPercentage))
        }
    } else if(lockedCameraPosition.value != null){
        camera.position.copy(lockedCameraPosition.value)
        if(lockedCameraTarget.value != null){
            camera.lookAt(lockedCameraTarget.value)
        }
    } else {
        if(lockedCameraTarget.value != null){
            controls.target.copy(lockedCameraTarget.value)
            controls.update()
        }
    }
    camera.rotateZ((getGame().player.object!.position.x / 300) * (Math.PI/4))
}