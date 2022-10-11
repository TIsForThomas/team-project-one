var searchBar = document.querySelector('#location-inline');
var musicFilter = document.querySelector('#music-btn');
var sportsFilter = document.querySelector('#sports-btn');
var theaterFilter = document.querySelector('#theater-btn');


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

// const geojson = {
//     type: 'FeatureCollection',
//     features: [
//         {
//             type: 'Feature',
//             geometry: {
//                 type: 'Point',
//                 coordinates: [-97.7333, 30.266]
//             },
//             properties: {
//                 title: 'Mapbox',
//                 description: 'Washington, D.C.'
//             }
//         },
//         {
//             type: 'Feature',
//             geometry: {
//                 type: 'Point',
//                 coordinates: [-97.2333, 30.366]
//             },
//             properties: {
//                 title: 'Mapbox',
//                 description: 'San Francisco, California'
//             }
//         }
//     ]
// };


// SeatGeek API



var seatGeekAPI = 'https://api.seatgeek.com/2/events?&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc';
var seatGeekData;
var events = {
};
var eName;

function getEvents() {
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
  }


  function displayEvents() {
    
    // add markers per event
    for (let i = 0; i < events.venue; i++) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
    
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(events.lat[i], events.long[i])
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(
                    `<p>${events.type[i]}</p>
                    <h3>${events.venue[i]}</h3>
                    <p>${events.address[i]}</p>
                    <p>${events.performers[i]}</p>
                    <a href='${events.url[i]}</a>`
                  )
              ).addTo(map);
    }
}
