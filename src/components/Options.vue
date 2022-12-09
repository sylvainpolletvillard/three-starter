<template>
    <div id="options">
        <h1>Options</h1>
        <div class="options">
            <label for="volume-music">Music volume</label>
            <input type="range" min="0" max="100" id="volume-music" v-model="store.MUSIC_VOLUME" />
            <label for="volume-sfx">SFX volume</label>
            <input type="range" min="0" max="100" id="volume-sfx" v-model="store.SFX_VOLUME" />
        </div>
        <footer>
            <button @click="gameState.scene = 'menu'">Back</button>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { gameState } from "../gamestate";
import { store } from "../utils/store";
</script>

<style scoped>
#options {
    display: grid;
    grid-template: 20vh 1fr min-content / 1fr;
    place-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
}

#options .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
}

#options footer {
    display: flex;    
    justify-content: center;    
}
</style>