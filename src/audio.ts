import { SOUNDS, SOUNDS_TO_LOAD } from "./loader";
import { store } from "./utils/store";

export function playMusic() {
    const music = SOUNDS.get("music")
    if(music == null){
        setTimeout(playMusic, 100); // buffer not ready, retry later
        return;
    }
    music.setLoop(true)
    music.setVolume(store.MUSIC_VOLUME)
    music.play()
}

export function playSound(name: keyof typeof SOUNDS_TO_LOAD){
    const sound = SOUNDS.get(name)
    if(!sound) console.error(`Sound not found: ${name}`)
    else {
        sound.setVolume(store.SFX_VOLUME)
        sound.play()
    }
}