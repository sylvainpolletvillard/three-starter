import * as THREE from "three";

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

export function initCursor() {
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("click", onPointerClick)
}

function onPointerMove(event: MouseEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / (window.innerHeight-240)) * 2 + 1;
}

function onPointerClick(event: MouseEvent){
  if(mouseTarget && onClickCallbacks.has(mouseTarget.uuid)){
    onClickCallbacks.get(mouseTarget.uuid)()
  }
}

let mouseTarget: THREE.Object3D | null = null;

export function handleCursor(camera: THREE.Camera) {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(Array.from(hoverables) as THREE.Object3D[], false);
  if (intersects.length > 0){
    const newTarget = intersects[0].object
    if(newTarget !== mouseTarget){
        if(mouseTarget && onMouseLeaveCallbacks.has(mouseTarget.uuid)){
            onMouseLeaveCallbacks.get(mouseTarget.uuid)()
        }
        mouseTarget = newTarget
        if (onMouseEnterCallbacks.has(mouseTarget.uuid)) onMouseEnterCallbacks.get(mouseTarget.uuid)()
    }
  } else if(mouseTarget) {
    if(onMouseLeaveCallbacks.has(mouseTarget.uuid)) onMouseLeaveCallbacks.get(mouseTarget.uuid)()
    mouseTarget = null;
  }
}

const hoverables = new Set()

const onMouseEnterCallbacks = new Map()
export function onMouseEnter(el: THREE.Object3D, callback: () => void) {
    hoverables.add(el)
    onMouseEnterCallbacks.set(el.uuid, callback)
}

const onMouseLeaveCallbacks = new Map()
export function onMouseLeave(el: THREE.Object3D, callback: () => void) {
    hoverables.add(el)
    onMouseLeaveCallbacks.set(el.uuid, callback)
}

const onClickCallbacks = new Map()
export function onClick(el: THREE.Object3D, callback: () => void) {
    hoverables.add(el)
    onClickCallbacks.set(el.uuid, callback)
}