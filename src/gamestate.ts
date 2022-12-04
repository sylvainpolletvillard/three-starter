import { reactive } from "vue"

export interface GameState {
    score: number
    time: number
}

export const gameState: GameState = reactive({
    score: 0,
    time: 0
})

export function updateGameState(timeElapsed: number){
    gameState.time += timeElapsed
}