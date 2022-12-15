import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import Stats from 'stats.js'
import * as dat from 'dat.gui'


/**
 * Base
 */

//Debug 
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild( stats.dom )

const gui = new dat.GUI()
var folderRenderer= gui.addFolder('Renderer settings')
var folderCamera = gui.addFolder('Camera settings')
var folderLights = gui.addFolder('Light settings')
var folderDirLight = folderLights.addFolder('Directional Light')
var folderObject = gui.addFolder('Object properties')



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
gltfLoader.load('/models/smaller-file-barometer.glb', (gltf) => {
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

    let clip = THREE.AnimationClip.findByName(clips, "Animation")
    let action = mixer.clipAction(clip)

    action.loop = THREE.LoopPingPong
    action.play()

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
    folderObject.add(gltf.scene.children[35].material, 'wireframe' )

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


// Debug

folderDirLight.addColor(parametersDirLight, 'color').onChange(() =>{
    directionalLight.color.set(parametersDirLight.color)
})

const helperDirLight = new THREE.DirectionalLightHelper( directionalLight, 1, 0xff0000 )
scene.add( helperDirLight )
folderDirLight.add(helperDirLight, 'visible').name('Light Helper')

folderDirLight.add(directionalLight, 'intensity').name('Intensity').min(0).max(2).step(0.01)

folderDirLight.add(directionalLight.position, 'x').name('Position X Axis').min(-5).max(5).step(0.01)
folderDirLight.add(directionalLight.position, 'y').name('Position Y Axis').min(0).max(10).step(0.01)
folderDirLight.add(directionalLight.position, 'z').name('Position Z Axis').min(-5).max(10).step(0.01)


//Create a helper for the shadow camera
const helperDirLightShadow = new THREE.CameraHelper( directionalLight.shadow.camera )
scene.add( helperDirLightShadow )
folderDirLight.add(helperDirLightShadow, 'visible').name('Shadow Helper')
folderDirLight.add(directionalLight.shadow.camera, 'near').name('Near').min(0).max(5).step(0.01)
folderDirLight.add(parametersDirLight, 'shadowFar').name('Far').min(0).max(500).step(0.01).onChange(() => {
    directionalLight.shadow.camera.near = parametersDirLight.shadowFar
})


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