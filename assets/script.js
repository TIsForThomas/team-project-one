var searchBar = document.querySelector('#location_inline');
var musicFilter = document.querySelector('#music-button');
var sportsFilter = document.querySelector('#sports-button');
var theaterFilter = document.querySelector('#theater-button');
var locationPlaceholder = document.querySelector('#local');
var searchContainer = document.querySelector('#search-1');

M.AutoInit();
init();

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
    date: [],

};
// var test = 'sports';
var markerFilter = {
    sports: [],
    concert: [],
    theater: [],
};
var centerLat = 30.266;
var centerLong = -97.7333;


// seatgeek api request to get events based on location input from user
function getEvents(input) {
    
    // get current date and format for api
    var currentDate = '';
    var currentVar = new Date();
    currentDate = currentDate.concat(currentVar.getUTCFullYear());
    currentDate = currentDate.concat('-' + currentVar.getUTCMonth());
    currentDate = currentDate.concat('-' + currentVar.getUTCDay());

    // console.log(currentDate);

    var seatGeekCityAPI = 'https://api.seatgeek.com/2/events?per_page=50&datetime_utc.gt=' + currentDate + '&venue.city=' + input + '&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc'


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
                date: [],
            
            };
            for (let i = 0; i < seatGeekData.length; i++) {
                events.venue.push(seatGeekData[i].venue.name);
                events.lat.push(seatGeekData[i].venue.location.lat);
                events.long.push(seatGeekData[i].venue.location.lon);
                events.address.push(seatGeekData[i].venue.address);
                events.website.push(seatGeekData[i].url);
                events.eventType.push(seatGeekData[i].taxonomies[0].name);
                events.performers.push(seatGeekData[i].title);
                events.date.push(seatGeekData[i].datetime_local);
                if (seatGeekData[i].stats.highest_price == null) {
                    events.highPrice.push(' ');
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
                document.querySelector('#location_inline').removeClass('valid');
                document.querySelector('#location_inline').addClass('invalid');
                return
            } else {
                let lat = 0;
                let long = 0;
                for (var i = 0; i < events.lat.length; i++) {
                    lat += events.lat[i];
                    long += events.long[i];
                }
                centerLat = lat / events.lat.length;
                centerLong = long / events.long.length;
            }
            document.querySelector('#helper').textContent = `${events.lat.length} events found! Check the map!`;

            displayEvents();
        })
}

// display events onto map
function displayEvents() {
    document.querySelector('#map').style.display = 'flex';

    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzaXNtZTEiLCJhIjoiY2w5MDQxcnk1MHd3OTNvcXY5cDVhN3J3ZyJ9.mf0LftJWuD2HkgIlKhwzaw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: [centerLong, centerLat], // starting position [lng, lat]
        zoom: 12, // starting zoom
        projection: 'globe' // display the map as a 3D globe
    });
    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    // add markers per event
    for (let i = 0; i < events.venue.length; i++) {

        let lat = events.lat[i];
        let long = events.long[i];

        // create a HTML element for each feature
        const el = document.createElement('div');

        el.setAttribute('id', events.eventType[i]);
        
        el.className = 'marker';
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat([long, lat]).setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `
                <h4 id='event-performer'>${events.performers[i]}</h4>
                <h5 id='event-venue'>${events.venue[i]}</h5>
                <h6 id='event-address'>${events.address[i]}</h6>
                <a id='event-link' href='${events.website[i]}' target='_blank'>Buy Tickets!</a>
                <p id='event-price-range'>$${events.lowPrice[i]} - $${events.highPrice[i]}</p>
                `
                )
                ).addTo(map);
            }
            
    console.log(document.querySelectorAll('#sports'));
    markerFilter.sports = [];
    markerFilter.concert = [];
    markerFilter.theater = [];
    markerFilter.sports = document.querySelectorAll('#sports');
    markerFilter.concert = document.querySelectorAll('#concert');
    markerFilter.theater = document.querySelectorAll('#theater');
    console.log(markerFilter);
}

// function to filter events by theater, music, and sports after receiving results from seatgeek
function filterResults(buttonClicked){

    document.querySelector('#local').textContent = '';
    // CLEAR CURRENT MAP MARKERS?

    var currentDate = '';
    var currentVar = new Date();
    currentDate = currentDate.concat(currentVar.getUTCFullYear());
    currentDate = currentDate.concat('-' + currentVar.getUTCMonth());
    currentDate = currentDate.concat('-' + currentVar.getUTCDay());
    let userInput = document.querySelector('#location_inline').value;

    var seatGeekEventsAPI = 'https://api.seatgeek.com/2/events?per_page=50&datetime_utc.gt=' + currentDate + '&taxonomies.name=' + buttonClicked + '&venue.city=' + userInput + '&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc'

    fetch(seatGeekEventsAPI)
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
                date: [],
            
            };
            for (let i = 0; i < seatGeekData.length; i++) {
                events.venue.push(seatGeekData[i].venue.name);
                events.lat.push(seatGeekData[i].venue.location.lat);
                events.long.push(seatGeekData[i].venue.location.lon);
                events.address.push(seatGeekData[i].venue.address);
                events.website.push(seatGeekData[i].url);
                events.eventType.push(seatGeekData[i].taxonomies[0].name);
                events.performers.push(seatGeekData[i].title);
                events.date.push(seatGeekData[i].datetime_local);
                if (seatGeekData[i].stats.highest_price == null) {
                    events.highPrice.push(' ');
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
            } else {
                let lat = 0;
                let long = 0;
                for (var i = 0; i < events.lat.length; i++) {
                    lat += events.lat[i];
                    long += events.long[i];
                }
                centerLat = lat / events.lat.length;
                centerLong = long / events.long.length;
            }
            document.querySelector('#helper').textContent = `${events.lat.length} events found! Check the map!`;

            displayEvents();
        })
}

function init() {

    var recentLocation = localStorage.getItem('last-location')
    if(recentLocation === null){
        return;
    }
    document.querySelector('#local').textContent = '';
    searchBar.value += recentLocation;

    getEvents(recentLocation);
}

function selectText() {
    const input = searchBar;
    input.focus();
    input.select();
}

searchBar.addEventListener('keyup', function (event) {

    if (event.key !== 'Enter') {
        return;
    }

    // console.log(event);
    let userInput = document.querySelector('#location_inline').value;

    localStorage.setItem('last-location', userInput);

    document.querySelector('#local').textContent = '';

    document.querySelector('#location_inline').style.borderBottom = '1px solid #9e9e9e;';

    getEvents(userInput);
})

theaterFilter.addEventListener('click', function () {
    console.log('ding');
    var filterTheater = 'theater';
    document.body.style.backgroundImage = 'url(assets/images/theater.jpg)';
    document.querySelector('#theater-button').style.backgroundColor = 'rgba(255, 0, 0, 0.305)';
    document.querySelector('#sports-button').style.backgroundColor = 'rgba(247, 247, 247, 0.6)';
    document.querySelector('#music-button').style.backgroundColor = 'rgba(247, 247, 247, 0.6)';
    filterResults(filterTheater);
})

sportsFilter.addEventListener('click', function () {
    console.log('dong');
    var filterSports = 'sports';
    document.body.style.backgroundImage = 'url(assets/images/sports.jpg)';
    document.querySelector('#theater-button').style.backgroundColor = 'rgba(247, 247, 247, 0.6)';
    document.querySelector('#sports-button').style.backgroundColor = 'rgba(0, 255, 0, 0.305)';
    document.querySelector('#music-button').style.backgroundColor = 'rgba(247, 247, 247, 0.6)';
    filterResults(filterSports);
})

musicFilter.addEventListener('click', function () {
    console.log('The queen is gone!');
    var filterMusic = 'concert';
    document.body.style.backgroundImage = 'url(assets/images/concert.jpg)';
    document.querySelector('#theater-button').style.backgroundColor = 'rgba(247, 247, 247, 0.6)';
    document.querySelector('#sports-button').style.backgroundColor = 'rgba(247, 247, 247, 0.6)';
    document.querySelector('#music-button').style.backgroundColor = 'rgba(0, 0, 255, 0.305)';
    filterResults(filterMusic);
})


searchContainer.addEventListener('click', selectText);