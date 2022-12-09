<template>
    <Loading v-if="isLoading"></Loading>
    <Menu v-else-if="gameState.scene === 'menu'" />
    <Options v-else-if="gameState.scene === 'options'" />
    <template v-else>
        <div style="display: flex; justify-content: space-between;">
            <div class="score">
                <p>Score: {{gameState.score}}</p>
                <p v-if="record" class="record">Record: {{record}}</p>
            </div>
            <div class="time">
                <p>Time: {{formatTime(gameState.time)}}</p>
            </div>
        </div>
    </template>

</template>

<script lang="ts" setup>
import { gameState } from "../gamestate";
import { store } from '../utils/store';
import { isLoading } from '../loader';

import Loading from './Loading.vue';
import Menu from "./Menu.vue";
import Options from "./Options.vue";

const record = store.record
const formatTime = (ms: number) => {
    const s = ms/1000
    const seconds = ('00'+Math.floor(s) % 60).slice(-2)
    const minutes = ('00'+Math.floor(s/60)).slice(-2)
    return `${minutes}:${seconds}`
}
</script>

<style scoped>
p {
    margin-top: 0;
}
p.record {
    font-size: 50%;
}
</style>