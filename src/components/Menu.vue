<template>
    <div id="menu">
        <img src="assets/logo.png" alt="game_title_to_be_found" id="logo">
        <div class="actions">
            <button @click="startGame">Play</button>
            <button @click="gameState.scene = 'options'">Options</button>
        </div>
        <footer>
            <p id="credits">Credits: AUTHOR</p>
            <p id="version">v{{version}}</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { version } from "../../package.json"
import { startGame } from "../main"
import { gameState } from "../gamestate";
</script>

<style scoped>
#menu {
    display: grid;
    grid-template: 20vh 1fr min-content / 1fr;
    place-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
}

#logo {
    margin: auto;
}

#menu .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
}

#menu footer {
    display: flex;    
    justify-content: space-between;    
}

#menu footer p {
    margin: 0.5em;
    flex: 0 0 auto;
}
</style>