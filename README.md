# Seaman's gear Hackaton 8.-9. 10.2022

[Website](https://3d.dsm.museum/seamansgear/)

## Zusammenfassung

Das Deutsche Schifffahrtsmuseum / Leibniz Institut für Maritime Geschichte (DSM) veranstaltet in Kooperation mit der Fakultät 4 (Elektrotechnik und Informatik) der Hochschule Bremen (HSB) und dem MAPEX Center for Materials and Processes der Universität Bremen einen zweitägigen Hackathon und Visualisierungsworkshop. Der Hackathon ist offen für Studierende aus Bremen und Umgebung und findet unter dem Motto „Seaman’s Gear“ am 8. und 9. Oktober an der HSB statt. Dabei soll die Online-Präsentation von visualisierten technischen Geräten mithilfe von Open Source-Anwendungen ermöglicht werden.

## Objects 

**Vidi Barometer** - used to measure air pressure in a certain environment
**Chronometer** - measure Longitude (360 deg/24 hours = 15 deg for 1 hour). Needs 2 parameters: Beobachtungsort und Zielort.
**Boxsextant** - measure distance between 2 Objects to determine  position (Latitude) 

## μ-computer tomography 

x-ray tube  - object on rotatiable sample holder - detector panel 

Creates projections (2D), which then stitched together to 3D object. [Dragonfly](https://www.theobjects.com/dragonfly/index.html) software to create the mesh from image stack. 




## Tools 

[Blender](https://www.blender.org/)  
[Three.js](https://threejs.org/)  


## Ideation 
## Web stuff
### Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
