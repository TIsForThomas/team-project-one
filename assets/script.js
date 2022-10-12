var searchBar = document.querySelector('#location_inline');
var musicFilter = document.querySelector('#music-btn');
var sportsFilter = document.querySelector('#sports-btn');
var theaterFilter = document.querySelector('#theater-btn');
M.AutoInit();

var seatGeekData;
var events = {

    venue: [],
    lat: [],
    long: [],
    address: [],
    website: [],
    eventType: [],
    performers: [],
    lowPrice: [],
    highPrice: [],

};

var centerLat = 30.266;
var centerLong = -97.7333;


// SeatGeek API



// var seatGeekAPI = 'https://api.seatgeek.com/2/events?&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc';


function getEvents(input) {
    // get user input from variable
    // var input = 'austin'
    var currentDate = '';
    var currentVar = new Date();
    currentDate = currentDate.concat(currentVar.getUTCFullYear());
    currentDate = currentDate.concat('-' + currentVar.getUTCMonth());
    currentDate = currentDate.concat('-' + currentVar.getUTCDay());

    // console.log(currentDate);

    var seatGeekCityAPI = 'https://api.seatgeek.com/2/events?datetime_utc.gt=' + currentDate + '&venue.city=' + input + '&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc'


    fetch(seatGeekCityAPI)
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {

            seatGeekData = data.events;
            console.log(seatGeekData);
            return seatGeekData;

        })
        .then(function () {
            events = {

                venue: [],
                lat: [],
                long: [],
                address: [],
                website: [],
                eventType: [],
                performers: [],
                lowPrice: [],
                highPrice: [],
            
            };
            for (let i = 0; i < seatGeekData.length; i++) {
                events.venue.push(seatGeekData[i].venue.name);
                events.lat.push(seatGeekData[i].venue.location.lat);
                events.long.push(seatGeekData[i].venue.location.lon);
                events.address.push(seatGeekData[i].venue.address);
                events.website.push(seatGeekData[i].url);
                events.eventType.push(seatGeekData[i].type);
                events.performers.push(seatGeekData[i].title);
                if (seatGeekData[i].stats.highest_price == null) {
                    events.highPrice.push('SOLD OUT!');
                    events.lowPrice.push('SOLD OUT');
                }
                else {
                    events.highPrice.push(seatGeekData[i].stats.highest_price);
                    events.lowPrice.push(seatGeekData[i].stats.lowest_price);
                }
                // console.log(events);
            }
            console.log(events);
            if (events.lat.length == 0 && events.long.length == 0) {
                document.querySelector('#helper').textContent = 'No events found';
                return
            }
            else {
                let lat = 0;
                let long = 0;
                for (var i = 0; i < events.lat.length; i++) {
                    lat += events.lat[i];
                    long += events.long[i];
                }
                centerLat = lat / events.lat.length;
                centerLong = long / events.long.length;
            }

            displayEvents();
        })
}

function displayEvents() {
    document.querySelector('#map').style.display = 'flex';

    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzaXNtZTEiLCJhIjoiY2w5MDQxcnk1MHd3OTNvcXY5cDVhN3J3ZyJ9.mf0LftJWuD2HkgIlKhwzaw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: [centerLong, centerLat], // starting position [lng, lat]
        zoom: 10, // starting zoom
        projection: 'globe' // display the map as a 3D globe
    });
    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    // add markers per event
    for (let i = 0; i < events.venue.length; i++) {

        let lat = events.lat[i];
        let long = events.long[i];

        console.log(lat);
        console.log(long);
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat([long, lat]).setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<p id='event-type'>${events.eventType[i]}</p>
                    <h1 id='event-venue'>${events.venue[i]}</h1>
                    <p id='event-address'>${events.address[i]}</p>
                    <p id='event-performer'>${events.performers[i]}</p>
                    <p id='event-price-range'>$${events.lowPrice[i]} - $${events.highPrice[i]}</p>
                    <a id='event-link' href='${events.website[i]}' target='_blank'>SeatGeek link</a>`
                )
        ).addTo(map);
    }
    // // document.querySelector('#map').style.width = '100%';
    // // document.querySelector('#map').style.height = '700px';
}
function filterResults() {

}




searchBar.addEventListener('keyup', function (event) {

    if (event.key !== 'Enter') {
        return;
    }

    console.log(event);
    let userInput = document.querySelector('#location_inline').value;

    getEvents(userInput);
})