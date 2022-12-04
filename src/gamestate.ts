import { reactive } from "vue"

export interface GameState {
    score: number    
}

export const gameState: GameState = reactive({
    score: 0
})