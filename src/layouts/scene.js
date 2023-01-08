
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import Stats from 'stats.js'

class Scene {

    loadScene() {
        /**
 * Base
 */


//Debug 
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild( stats.dom )

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let case_model = null
let clips = null
let mixer = null
let hingeAction = null

window.SCENE = scene

// Model Loader

// Instantiate DRACO Loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// Load model with GLTF Loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/models/case_baro_less_Geo.glb', (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
    clips = gltf.animations
    mixer = new THREE.AnimationMixer(gltf.scene)

    // iterate over every animation
    // for(let index in gltf.animations) {
    //     let animation = gltf.animations[index]
    //     let clip = AnimationClip.findByName(clips, animation.name)
    //     let action = mixer.clipAction(clip)
    //     action.loop = LoopPingPong
    //     action.play()
    // }

    // let clip = THREE.AnimationClip.findByName(clips, "Animation")
    // let action = mixer.clipAction(clip)

    // action.loop = THREE.LoopPingPong
    // action.play()

    // Add the mixer for the case
    // mixer = new AnimationMixer(case_model)

    // let hingeClip = AnimationClip.findByName(clips, 'etui_hinge_top|etui_hinge_top|etui_hinge_top|etui_hinge_top|etu')
    // let etuiClip = AnimationClip.findByName(clips, 'etui_only_top|etui_only_top|etui_hinge_top|etui_hinge_top|etui_')

    // hingeAction = mixer.clipAction(hingeClip)
    // let etuiAction = mixer.clipAction(etuiClip)

    // hingeAction.loop = LoopPingPong
    // etuiAction.loop = LoopPingPong

    // hingeAction.play()
    // etuiAction.play()

    // actions

    // finally, start the rendering
    tick()

    // Debug
    // folderObject.add(gltf.scene.children[35].material, 'wireframe' )

})

// Lighting

const parametersDirLight  = {
    color: 0xffffff,
    intensity: 2,
    shadowNear: .5,
    shadowFar: 1
}
const directionalLight = new THREE.DirectionalLight(parametersDirLight.color, parametersDirLight.intensity)

//Set up shadow properties for the light
directionalLight.receiveShadow = false
directionalLight.shadow.mapSize.width = 128
directionalLight.shadow.mapSize.height = 128
directionalLight.shadow.camera.near = 0.5 
directionalLight.shadow.camera.far = 1
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setClearColor( 0xffffff, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.autoRotate = true
// controls.autoRotateSpeed = 1
controls.enableDamping = true
controls.dampingFactor = .5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setClearColor( 0xdadada, 1 );
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    stats.begin()
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    renderer.setClearColor( 0xFBFBFB, 1);

    // update the animation mixer
    mixer.update(deltaTime)

    //console.log(hingeAction.time);

    stats.end()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
        // Output loading status
        console.log('Scene component is loaded...')
    }

}

export const scene = new Scene()

