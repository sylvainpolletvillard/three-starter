import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { randomVariation } from "./utils/random";

interface PostProcessingParams {
  bloomThreshold: number;
  bloomStrength: number;
  bloomRadius: number;
}

let bloomPass: UnrealBloomPass;
let bloomComposer: EffectComposer;
let finalPass: ShaderPass;
let finalComposer: EffectComposer;
let bloomLayer: THREE.Layers;

const params: PostProcessingParams = {
  bloomThreshold: 0.25,
  bloomStrength: 4,
  bloomRadius: 0.15,
};

export const BLOOM_SCENE = 1;

export function initPostprocessing(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.Renderer
) {
  const renderScene = new RenderPass(scene, camera);

  bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `
      varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
      `,
      fragmentShader: `
      uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}
      `,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;

  finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);
}

export function renderBloom(scene: THREE.Scene) {
  scene.traverse(darkenNonBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
}

export function renderWithPostProcessing(scene: THREE.Scene) {
    //flickering
    bloomPass.strength = randomVariation(params.bloomStrength, 0.01)
  // render scene with bloom
  renderBloom(scene);

  // render the entire scene, then render bloom scene on top
  finalComposer.render();
}

const materials: Map<string, THREE.Material> = new Map();
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });

function darkenNonBloomed(obj: THREE.Mesh | THREE.Object3D) {
  if (obj instanceof THREE.Mesh && bloomLayer.test(obj.layers) === false) {
    materials.set(obj.uuid, obj.material);
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj: THREE.Mesh | THREE.Object3D) {
  if (obj instanceof THREE.Mesh && materials.has(obj.uuid)) {
    obj.material = materials.get(obj.uuid) as THREE.Material;
    materials.delete(obj.uuid);
  }
}
