

class Dashboard {

    loadDashboard() {

        // <aside id="gui-container" class=" bottom-0 grid grid-cols-3 gap-4 max-w-max">

        // create a new div element
        const dashboardParent = document.createElement("aside")
        dashboardParent.id = "dashboard"
        dashboardParent.classList.add("absolute", "inset-x-0", "bottom-0", "grid", "grid-cols-3", "gap-4", "max-w-max")

        // Output loading status
        console.log('Dashboard component is loaded...')

        document.body.appendChild(dashboardParent)

    }

}

export const dashboard = new Dashboard()