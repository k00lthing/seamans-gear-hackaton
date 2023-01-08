import { Button } from '../components/button.js'
import { ToggleButton } from '../components/toggle-button.js'
import { Carousel } from '../components/button-carousel.js'

class Dashboard {

    loadDashboard() {
        // Creata a new instances of imported classes
        const xrayButton = new ToggleButton()
        const resetButton = new Button()
        const buttonCarousel = new Carousel()

        // Invoke the method (component)
        xrayButton.loadToggleButton()
        buttonCarousel.loadCarousel()
        resetButton.loadButton()

        // Output loading status
        console.log('Dashboard component is loaded...')
        
    }

}

export const dashboard = new Dashboard()