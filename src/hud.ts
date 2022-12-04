import { ref, type Ref } from "vue";
import type { Block } from "./block"
import type { BlockType } from "./blocks/blocktype";
import type { Planet } from "./planet";
import type { Ship } from "./ship";
import type { SolarSystem } from "./system";

export enum Action { VIEW = "view", BUILD = "build" }
export type SelectableUnit = Planet | Ship | Block | SolarSystem
export let selectedUnit: Ref<SelectableUnit | null> = ref(null)
export let selectedBlockToBuild: Ref<BlockType | null> = ref(null)
export let currentAction: Ref<Action> = ref(Action.VIEW)