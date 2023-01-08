import { button, carousel, toggle } from '../components'

class Dashboard {

    loadDashboard() {

        // Invoke the method (component)
        toggle.loadToggleButton()
        carousel.loadCarousel()
        button.loadButton()

        // Output loading status
        console.log('Dashboard component is loaded...')
        
    }

}

export const dashboard = new Dashboard()