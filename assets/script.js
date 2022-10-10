mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzaXNtZTEiLCJhIjoiY2w5MDQxcnk1MHd3OTNvcXY5cDVhN3J3ZyJ9.mf0LftJWuD2HkgIlKhwzaw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-97.7333, 30.266], // starting position [lng, lat]
    zoom: 10, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-97.7333, 30.266]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-97.2333, 30.366]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        }
    ]
};

// add markers to map
for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
}







var seatGeekAPI = 'https://api.seatgeek.com/2/events?&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc';
var seatGeekData;
var events = {

};
var eName;

fetch(seatGeekAPI)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (data) {

        seatGeekData = data.events;
        console.log(seatGeekData)
        return seatGeekData;

    })
    .then(function () {
        for (let i = 0; i < seatGeekData.length; i++) {
            eName = i;
            events.eName = seatGeekData[i].venue.location; // this works for getting one key and one item
            //   events.eName.type = seatGeekData[i].type;
            //   console.log(events);
        }
    })
