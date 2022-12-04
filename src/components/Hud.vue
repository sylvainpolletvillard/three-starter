<template>
    <Loading v-if="isLoading"></Loading>
    <div v-else class="score">
        <p>Score: {{gameState.score}}</p>
        <p v-if="record" class="record">Record: {{record}}</p>
    </div>
</template>

<script lang="ts" setup>
import { gameState } from "../gamestate";
import { store } from '../utils/store';
import { isLoading } from '../loader';

import Loading from './Loading.vue';

const record = store.record
</script>

<style scoped>
p {
    margin-top: 0;
}
p.record {
    font-size: 50%;
}
</style>