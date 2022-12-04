import { ref, type Ref } from "vue";

const keyBindings: Map<string, (() => void)[]> = new Map()
const keyWatchers: Map<string, Ref<boolean>> = new Map()

export function initControls(){
    document.addEventListener("keydown", function onKeyDown(e: KeyboardEvent){
        const key = e.code
        if(keyBindings.has(key)) keyBindings.get(key)!.forEach(callback => callback())
        if(keyWatchers.has(key)) keyWatchers.get(key)!.value = true
    });
    document.addEventListener("keyup", function onKeyUp(e: KeyboardEvent){
        const key = e.code
        if(keyWatchers.has(key)) keyWatchers.get(key)!.value = false
    });
}

const ARROW_KEYS = {
    UP: [
        watchKey("KeyW"),
        watchKey("ArrowUp")
    ],
    DOWN: [
        watchKey("KeyS"),
        watchKey("ArrowDown")
    ],
    LEFT: [
        watchKey("KeyA"),
        watchKey("ArrowLeft")
    ],
    RIGHT: [
        watchKey("KeyD"),
        watchKey("ArrowRight")
    ]
}

export const arrowKeysPressed = {
    get UP(){ return ARROW_KEYS.UP.some(k => k.value === true) },
    get DOWN(){ return ARROW_KEYS.DOWN.some(k => k.value === true) },
    get LEFT(){ return ARROW_KEYS.LEFT.some(k => k.value === true) },
    get RIGHT(){ return ARROW_KEYS.RIGHT.some(k => k.value === true) }
}

export function onKey(code: string, callback: () => void){
    if(!keyBindings.has(code)) keyBindings.set(code, [callback])
    else keyBindings.get(code)!.push(callback)
}

export function watchKey(code: string): Ref<boolean> {
    if(!keyWatchers.has(code)) keyWatchers.set(code, ref(false))
    return keyWatchers.get(code)!
}

export function getDirectionVector(): [number, number] {
    const dx = Number(arrowKeysPressed.RIGHT) - Number(arrowKeysPressed.LEFT)
    const dy = Number(arrowKeysPressed.UP) - Number(arrowKeysPressed.DOWN)
    return [dx, dy]
}

export function hasArrowKeyPressed(): boolean {
    return Object.values(arrowKeysPressed).includes(true)
}