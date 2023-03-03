
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import Stats from 'stats.js'

class Scene {

    loadScene() {

        // Dashboard buttons
        const xray_button = document.querySelector('#xray')
        const reset_button = document.querySelector('#reset')

        const open_button = document.querySelector('#open_case')
        const remove_case_button = document.querySelector('#remove_case')
        const action_button = document.querySelector('#in_action')
        const liftup_button = document.querySelector('#lift_up')

        // Stats
        const stats = new Stats()
        stats.showPanel(0)
        document.body.appendChild(stats.dom)

        // Canvas
        const canvas = document.querySelector('canvas.webgl')

        // Scene
        const scene = new THREE.Scene()

        // Define global objects
        let model, animation_clips, mixer, open_case_action, lift_up_action, measuring_action
        let etui_parts = []

        let uniforms = {
            isXRay: { value: false },
            rayAng: { value: 0.975 },
            rayOri: { value: new THREE.Vector3() },
            rayDir: { value: new THREE.Vector3() }
        }

        let raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2()

        // Model Loader
        // Instantiate DRACO Loader
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')

        // Load model with GLTF Loader
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)
        gltfLoader.load(
            '/models/last_textured_baro_test5.glb',
            (gltf) => {

                console.log('Model loaded as : ', gltf)

                model = gltf
                model.scene.scale.set(12, 12, 12)
                model.scene.traverse(function (child) {
                    if (child.isMesh) {

                        // child.material.map = null
                        child.castShadow = false
                        child.receiveShadow = false

                        child.material.transparent = true;
                        child.material.side = THREE.DoubleSide;
                        child.material.onBeforeCompile = shader => {
                            shader.uniforms.isXRay = uniforms.isXRay;
                            shader.uniforms.rayAng = uniforms.rayAng;
                            shader.uniforms.rayOri = uniforms.rayOri;
                            shader.uniforms.rayDir = uniforms.rayDir;
                            shader.vertexShader = `
          uniform vec3 rayOri;
          varying vec3 vPos;
          varying float vXRay;
          ${shader.vertexShader}
        `.replace(
                                `#include <begin_vertex>`,
                                `#include <begin_vertex>
            vPos = (modelMatrix * vec4(position, 1.)).xyz;
            
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * normalize(rayOri - vPos) );
            vXRay = pow(1. - dot(vNormal, vNormel), 3. );
          `
                            );
                            // console.log(shader.vertexShader);
                            shader.fragmentShader = `
          uniform float isXRay;
          uniform float rayAng;
          uniform vec3 rayOri;
          uniform vec3 rayDir;
          
         varying vec3 vPos;
         varying float vXRay;
          ${shader.fragmentShader}
        `.replace(
                                `#include <dithering_fragment>`,
                                `#include <dithering_fragment>
          
          if(abs(isXRay) > 0.9){
          
            vec3 xrVec = vPos - rayOri;
            vec3 xrDir = normalize( xrVec );
            float angleCos = dot( xrDir, rayDir );

            vec4 col = vec4(0, 1, 1, 1) * vXRay;
            col.a = 0.5;
            gl_FragColor = mix(gl_FragColor, col, smoothstep(rayAng - 0.02, rayAng, angleCos));

          }
          
          `
                            );
                            // console.log(shader.fragmentShader);
                        }

                    }
                })
                scene.add(model.scene)
                console.log(scene)

                // Group Etui Parts
                let etui_bottom = scene.getObjectByName("Lower_Case", true)
                let etui_top = scene.getObjectByName("Upper_case", true)
                let etui_hinge_bottom = scene.getObjectByName("etui_hinge_bottom1", true)

                etui_parts.push(etui_bottom, etui_top, etui_hinge_bottom)

                // Define Animation Actions

                mixer = new THREE.AnimationMixer(model.scene)
                animation_clips = model.animations
                console.log('Animations: ', animation_clips)

                // etui_anim_group = new THREE.AnimationObjectGroup(animation_clips[8], animation_clips[9])
                // open_case_action = mixer.clipAction( etui_anim_group )
                open_case_action = mixer.clipAction(animation_clips[0])
                open_case_action.setLoop(THREE.LoopOnce)
                open_case_action.clampWhenFinished = true


                lift_up_action = mixer.clipAction(animation_clips[2])
                lift_up_action.setLoop(THREE.LoopOnce)
                lift_up_action.clampWhenFinished = true

                measuring_action = mixer.clipAction(animation_clips[3])
                measuring_action.setLoop(THREE.LoopPingPong)



                // List materials
                model.parser.getDependencies('material').then((materials) => {
                    console.log('Materials: ', materials)
                })


                // keep an eye on button clicks
                events()

                // start the rendering
                tick()

            },
            // called while loading is progressing
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened:', error)

            })

        // Lighting

        // ambient
        scene.add(new THREE.AmbientLight(0xffffff, 0.1)); // optional

        const parametersDirLight = {
            color: 0xffffff,
            intensity: 1.5
        }
        const directionalLight = new THREE.DirectionalLight(parametersDirLight.color, parametersDirLight.intensity)

        // Set up shadow properties for the light
        directionalLight.receiveShadow = false
        directionalLight.shadow.mapSize.width = 128
        directionalLight.shadow.mapSize.height = 128
        directionalLight.shadow.camera.near = 0.5
        directionalLight.shadow.camera.far = 1
        scene.add(directionalLight)

        const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( helper );

        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setClearColor(0xfbfbfb, 1)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 5)
        camera.position.x = 0
        camera.position.y = 1.5
        camera.position.z = 4
        scene.add(camera)


        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enablePan = false
        controls.autoRotate = true
        controls.autoRotateSpeed = 1
        controls.enableDamping = true
        controls.dampingFactor = .5
        controls.minDistance = 1.5
        controls.maxDistance = 3


        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        })
        renderer.setClearColor(0xfbfbfb, 1)
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        console.log('Renderer: ', renderer.info)


        // const axesHelper = new THREE.AxesHelper( 3 )
        // scene.add( axesHelper )

        /**
         * Animate
         */
        const clock = new THREE.Clock()
        let lastElapsedTime = 0

        const tick = () => {



            // Clock
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - lastElapsedTime
            lastElapsedTime = elapsedTime


            // Update controls
            controls.update()

            // Render
            renderer.render(scene, camera)
            // renderer.setClearColor(0xFBFBFB, 1);

            // Update the animation mixer
            if (mixer) mixer.update(deltaTime)

            stats.update()

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        // Listen for buttonclicks
        const events = () => {
            // stop autorotate after the first interaction
            controls.addEventListener('start', function () {
                controls.autoRotate = false
            })

            // restart autorotate after the last interaction & an idle time has passed
            controls.addEventListener('end', function () {
                setTimeout(function () {
                    controls.autoRotate = true
                }, 10000)
            })


            xray_button.addEventListener('click', function (e) {
                this.classList.toggle('active')

                if (this.classList.contains('active')) {
                    // start xray mode
                    uniforms.isXRay.value = true;
                } else {
                    // restore init mode
                    uniforms.isXRay.value = false;
                }

            }, false)

            renderer.domElement.addEventListener("pointermove", event => {

                setXRay(event);

            })


            open_button.addEventListener('click', function (e) {
                this.classList.toggle('active')

                if (this.classList.contains('active')) {
                    // play open anim clip
                    open_case_action.play()
                } else {
                    // stop
                    open_case_action.stop()
                }
            }, false)

            remove_case_button.addEventListener('click', function (e) {
                this.classList.toggle('active')

                if (this.classList.contains('active')) {
                    // hide leather case
                    etui_parts.forEach((part) => {
                        part.visible = false
                    })
                    open_button.disabled = true

                } else {

                    // hsow again 
                    etui_parts.forEach((part) => {
                        part.visible = true
                    })
                    open_button.disabled = false
                }

            }, false)

            action_button.addEventListener('click', function (e) {
                this.classList.toggle('active')
                if (this.classList.contains('active')) {
                    // start measuring anim clip
                    measuring_action.play()
                } else {
                    // stop
                    measuring_action.stop()
                }
            }, false)

            liftup_button.addEventListener('click', function (e) {
                this.classList.toggle('active')

                if (this.classList.contains('active')) {
                      // hide leather case
                      etui_parts.forEach((part) => {
                        part.visible = false
                    })
                    open_button.disabled = true
                    // start lift anim clip
                    lift_up_action.play()
                    directionalLight.position.set( -5, 5, 0 )
                } else {
                    directionalLight.position.set( 0, 5, 0 )
                    // stop
                    lift_up_action.stop()
                     // show again 
                     etui_parts.forEach((part) => {
                        part.visible = true
                    })
                    open_button.disabled = false
                }

            }, false)

            reset_button.addEventListener('click', function (e) {
                // restore init mode
                camera.position.set(1, 1, 1);
                controls.update();
            }, false)

        }

        function setXRay(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            if (model && uniforms.isXRay.value) {
                uniforms.rayOri.value.copy(raycaster.ray.origin)
                uniforms.rayDir.value.copy(raycaster.ray.direction);
            }
        }

        // Output loading status
        console.log('Scene component is loaded.')
    }

}

export const scene = new Scene()

