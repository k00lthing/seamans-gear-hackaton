import './style.scss'
import { Scene } from './layouts/scene.js'
import { Dashboard } from './layouts/dashboard.js'
import { Debug } from './layouts/debug.js'

const scene = new Scene()
const dashboard = new Dashboard()

scene.loadScene()
dashboard.loadDashboard()