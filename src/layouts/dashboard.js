import Glider from 'glider-js/glider'
class Dashboard {

    loadDashboard() {
      
      window.addEventListener('load', function(){
        new Glider(document.querySelector('.glider'),  {
          // Mobile-first defaults
          slidesToShow: 1,
          slidesToScroll: 1,
          scrollLock: true,
          arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
          },
          responsive: [
            {
              // screens greater than >= 775px
              breakpoint: 775,
              settings: {
                // Set to `auto` and provide item width to adjust to viewport
                slidesToShow: 2,
                slidesToScroll: 1,
                itemWidth: 100,
                duration: 0.25
              }
            },{
              // screens greater than >= 1024px
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                itemWidth: 100,
                duration: 0.25
              }
            }
          ]
        });
      })

        // Output loading status
        console.log('Dashboard component is loaded.')
    }


}

export const dashboard = new Dashboard()