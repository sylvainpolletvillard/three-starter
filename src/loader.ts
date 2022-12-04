import * as THREE from "three"
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ref } from "vue";

const loadingManager = new THREE.LoadingManager()

export const isLoading = ref(true)
export const loadingPercentage = ref(0)

loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    isLoading.value = true
    loadingPercentage.value = 0
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    loadingPercentage.value = Math.round(100*itemsLoaded/itemsTotal)
	console.log( 'Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

loadingManager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

const gltfLoader = new GLTFLoader(loadingManager)

const MODELS_TO_LOAD = {
    Challenger: 'assets/models/Challenger/glTF/Challenger.gltf',
    Spitfire: 'assets/models/Spitfire/glTF/Spitfire.gltf'
}

export const MODELS: Map<keyof typeof MODELS_TO_LOAD, THREE.Group> = new Map()

export function loadAssets(): Promise<void> {
    return new Promise((resolve) => {
        loadingManager.onLoad = function ( ) {
            isLoading.value = false
            console.log( 'Loading complete!');
            resolve()
        };
        
        Object.entries(MODELS_TO_LOAD).forEach(([name, path]) => {
            gltfLoader.load(path, (gltf: GLTF) => { 
                console.log({gltf})
                MODELS.set(name as keyof typeof MODELS_TO_LOAD, gltf.scene)
            })
        })
    })

}