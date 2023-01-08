import * as dat from 'dat.gui'

class DebugGUI {

    loadGUI() {
        console.log('GUI component is loaded.')

        const gui = new dat.GUI()
        var folderRenderer = gui.addFolder('Renderer settings')
        var folderCamera = gui.addFolder('Camera settings')
        var folderLights = gui.addFolder('Light settings')
        var folderDirLight = folderLights.addFolder('Directional Light')
        var folderObject = gui.addFolder('Object properties')

        // Debug directional light
        folderDirLight.addColor(parametersDirLight, 'color').onChange(() => {
            directionalLight.color.set(parametersDirLight.color)
        })

        const helperDirLight = new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000)
        scene.add(helperDirLight)
        folderDirLight.add(helperDirLight, 'visible').name('Light Helper')

        folderDirLight.add(directionalLight, 'intensity').name('Intensity').min(0).max(2).step(0.01)

        folderDirLight.add(directionalLight.position, 'x').name('Position X Axis').min(-5).max(5).step(0.01)
        folderDirLight.add(directionalLight.position, 'y').name('Position Y Axis').min(0).max(10).step(0.01)
        folderDirLight.add(directionalLight.position, 'z').name('Position Z Axis').min(-5).max(10).step(0.01)

        //Create a helper for the shadow camera
        const helperDirLightShadow = new THREE.CameraHelper(directionalLight.shadow.camera)
        scene.add(helperDirLightShadow)
        folderDirLight.add(helperDirLightShadow, 'visible').name('Shadow Helper')
        folderDirLight.add(directionalLight.shadow.camera, 'near').name('Near').min(0).max(5).step(0.01)
        folderDirLight.add(parametersDirLight, 'shadowFar').name('Far').min(0).max(500).step(0.01).onChange(() => {
            directionalLight.shadow.camera.near = parametersDirLight.shadowFar
        })
    }

}

export const debug = new DebugGUI()