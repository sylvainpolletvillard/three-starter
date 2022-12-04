<template>
    <div class="progress-bar-container">
        <label for="progress-bar">Loading... {{loadingPercentage}}%</label>
        <progress id="progress-bar" :value="loadingPercentage" max="100"></progress>
    </div>
</template>

<script lang="ts" setup>
import { loadingPercentage } from "../loader"
</script>

<style scoped>
.progress-bar-container {
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
}

#progress-bar {
    width: 50vw;
    height: 50px;
}
label {
    font-size: 64px;
}
</style>