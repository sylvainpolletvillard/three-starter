import { SOUNDS } from "./loader";
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