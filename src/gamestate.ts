import { reactive } from "vue"

export interface GameState {
    scene: string
    score: number
    time: number
}

export const gameState: GameState = reactive({
    scene: "menu",
    score: 0,
    time: 0,
})

export function updateGameState(timeElapsed: number){
    gameState.time += timeElapsed
}