var seatGeekAPI = 'https://api.seatgeek.com/2/events?&client_id=MTEzMTA3Njd8MTY2NTE3MDU2OC42ODE5NTc';
var seatGeekData;
var events = {
  
};
var eName;

fetch(seatGeekAPI)
  .then(function(response){
    console.log(response);
    return response.json();
  })
  .then(function(data){

    seatGeekData = data.events;
    console.log(seatGeekData)
    return seatGeekData;
    
  })
  .then(function(){
    for (let i = 0; i < seatGeekData.length; i++) {
      eName = i;
      events.eName = seatGeekData[i].venue.location; // this works for getting one key and one item
    //   events.eName.type = seatGeekData[i].type;
    //   console.log(events);
    }
  })

  // for (let i =0; i < seatGeekData.length; i++) {
  //   console.log(seatGeekData[i].location)
  // }
