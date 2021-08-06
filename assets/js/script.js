// generated api key
var API_key = '5de402f3e60411c4f9d65bfcb6878fea';

/// successful data
function handleSuccessfulData(data){
    // clearing our today's forecast content that was already displayed
    $('#today').empty();
    // capturing list array from data
    var list = data.list[0];
    // setting location name to localStoarage
    set_item(list['name']);
    // icon url
    var iconurl = "https://openweathermap.org/img/wn/"+ list['weather'][0]['icon']+ ".png";
    // weather icon image
    var weather_image = $('<img id="weather-icon" src='+iconurl+'>');
    // caoturing moment
    var today = moment().format("M/D/YYYY");
    // creating today content container
    var mainContent = $("<div class='card'></div>");
    // creating today weather card content holder
    var contentBdy = $("<div class='card-body'></div>");
    // creating temperature element with proper data
    var todayTemp = $("<p class='card-text'>Temp: "+list['main']['temp']+"°F</p>");
    // creating wind speed element with proper data
    var todayWind = $("<p class='card-text'>Wind: "+list['wind']['speed']+" mph</p>");
    // creating humidity element with proper data content
    var todayHumidity = $("<p class='card-text'>Humidity: "+list['main']['humidity']+"%</p>");
    // appending all our content to container
    mainContent.append(contentBdy);
    //creating today weather title with proper data
    var contentTitle = $("<h2 class='h3 card-title'>"+list['name']+" ("+today+") </h2>");
    // appending weather icon to title
    contentTitle.append(weather_image);
    // appending all our newly made elements to content holder
    contentBdy.append(contentTitle).append(todayTemp).append(todayWind).append(todayHumidity);
    // appending todays weather content to DOM
    $('#today').append(mainContent);
}

// UVI finder
function UVfider(coord){
    // capturing coords into variables
    var lat = coord['lat'];
    var lon = coord['lon'];
    // declaring today's UVI var
    var todayUV; 
    // request URL link
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly,alerts,daily&appid="+API_key;
    // fetched URL link
    fetch(requestURL)
    .then(function (res) {
        if(res.ok){
            // returned JSON data
            return res.json();
        }else{
            return;
        }
      })
      // JSON data
      .then(function (data) {   
        // capturing UVI data
        uvData = data['current']['uvi'];
        // creating UV index element into todayUV var
        todayUV= $("<p class='card-text'>UV index: </p>");
        // adding a span indicator to our UVI number
        uvNum = $("<span class='UVI'>"+uvData+"</span>");
        // if UVI data is between 3-5
        if(uvData > 2 && uvData <= 5){
            // setting id to yellow
            uvNum.attr('id', 'yellow');
            // if UVI is 6-7
        }else if(uvData > 5 && uvData <= 7){
            // setting id to orange
            uvNum.attr('id', 'orange');
            //if UVI is 8-10
        }else if(uvData > 7 && uvData <= 10){
            // setting id to red
            uvNum.attr('id', 'red');
            //if UVI is greater than equal to 11
        }else if(uvData >= 11){
            // setting id to purple
            uvNum.attr('id', 'purple'); 
            // else
        }else{
            // setting id to green
            uvNum.attr('id', 'green');
        }
        // appending uvNUmber element to DOM
        todayUV.append(uvNum)
        // appending todayUV to DOM
        $('.card-body').append(todayUV);
      });  

}

// five day forecast
function fiveDay(coords){
    // capturing our parent container element
    var forecast = $('#forecast');
    // clearing content that was previosly displayed on DOM
    forecast.empty();
    // setting title
    var forecast_title = $('<h4 class="col-12">5-day Forecast:</h4>');
    // appending title
    forecast.append(forecast_title);
    // cpaturing location coords into seperate variables
    var lat = coords['lat'];
    var lon = coords['lon'];
    // request link to get five day forecast
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly,alerts,current&appid="+API_key;
    // fetch requestURL
    fetch(requestURL)
    .then(function (response) {
        if(response.ok){
            // return JSON data
            return response.json();
        }else{
            return;
        }
      })
      // JSON data being handled
      .then(function (data) {
          // weather information from data
            var weather_list = data['daily'];
            // for as long as the weather array
            for(var i = 1; i < weather_list.length - 2; i++){
                // capturing weather icon
            var icon = weather_list[i]['weather']
            // getting weather icon link
            var iconurl = "https://openweathermap.org/img/wn/"+ icon[0]['icon']+ ".png";
            // setting weather icon URL to image element
            var weather_image = $('<p><img id="weather-icon" src='+iconurl+'></p>');
            // setting our card container
            var card_container = $('<div class="col-md five-day-card"></div>');
            // card content holder
            var card_content = $('<div class="card h-150 text-white" id="forecast-card"></div>');
            // appending card content to content container
            card_container.append(card_content);
            // creating title element
            var card_title = $("<h4>"+moment().add(i, 'days').format("M/D/YYYY")+"</h4>");
            // creating temperature element
            var card_temp = $("<p>Temp: "+weather_list[i]['temp']['day']+"°F</p>");
            // creating wind speed element
            var card_wind = $("<p>Wind: "+weather_list[i]['wind_speed']+" mph</p>");
            // creating humidity element
            var card_humid = $("<p>Humidity: "+weather_list[i]['humidity']+"%</p>");
            // appending created elements with proper data to card content 
            card_content.append(card_title).append(weather_image).append(card_temp).append(card_wind).append(card_humid);
            // displaying forecast card to DOM
            forecast.append(card_container);
        }
     });  
}

// search location function
function search_city(city){
    // capturing url that will be fetched
    var searchURL = 'https://api.openweathermap.org/data/2.5/find?q='+city+'&units=imperial&appid='+API_key;
    // fetching url
    fetch(searchURL)
    .then(function (response) {
        // if repsonse is ok
        if(response.ok){
            // return JSON
            return response.json();
            // if response is not ok
        }else{
            // alerting user location not found
            alert(city + " not found!");
            // exit program
            return;
        }
      })
      // JSON data
      .then(function (data) {
          // if nothing is within the data
          if(data.count === 0){
              // alert user not a valid location
            alert(city + " is not a valid location!");
            // exit program
            return;
          }
          // sending successful data to function
          handleSuccessfulData(data);
          // sending location coords to find UVI
          UVfider(data['list'][0]['coord']);
          // sending location coords to display five day forecast
          fiveDay(data['list'][0]['coord']);
     });  
}

// handleing history searched buttons
function handleBtn(evnt){
    evnt.preventDefault();
    // capturing button value
    var location = evnt.target.value;
    // sending our value to search location function
    search_city(location);
}

// localStoarage handler
function storage(){
    // capturing parsed localStorage info
    var city_items = JSON.parse(localStorage.getItem('city'));
    // if localStoarage is not empty
    if(city_items != undefined){
        // for as long as city_items
        for(i = 0; i < city_items.length; i++){
            // creating button element with value at the ith index of city_items
            var newBtn = $('<button class="btn btn-success">'+city_items[i]+'</button>');
            // appending new button to history DOM
            $('#history').append(newBtn)
            // giving button its relative value
            newBtn.attr('value', city_items[i]);
            // event listener for each button
            newBtn.on('click', handleBtn);
        }
    }
}

// set_item to localStorage
function set_item(city){
    // setting our passed in parameter into an array
    var city_Arr = [city]
    // capturing parsed localStorage info
    var city_items = JSON.parse(localStorage.getItem('city'));
    // if localStorage is not empty
    if(city_items != undefined){
        // for as long as city_items 
        for(var i = 0; i < city_items.length; i++){
            // setting our current searched location to lowercase char as well as 
            // value at the ith index of city_items
            var lowLocation = city.toLowerCase();
            var lowItem = city_items[i].toLowerCase();
            // if both lowercase values are equal
            if(lowItem == lowLocation){
                //exit
                return;
            }
        }
        // setting our new location list to localStorage
        localStorage.setItem('city', JSON.stringify(city_items.concat(city)));
        // if localStorage is empty
    }else{
        // setting our first searched location to localStorage
        localStorage.setItem('city', JSON.stringify(city_Arr));
    }
    // creating button element with location value
    var newBtn = $('<button class="btn btn-success">'+city+'</button>');
    // appending new button to DOM
    $('#history').append(newBtn)
    // giving button value of relative location
    newBtn.attr('value', city);
    // event listener
    newBtn.on('click', handleBtn);
}

// event listener function
function setEventlisteners(){
    // listening for when search button is clicked
    $('#searchBtn').on('click', function(evnt){
        evnt.preventDefault();
    var letters = /[a-zA-Z]/g;
    // capturing user location input 
    var city = $("#state-input").val();
    // if user input does not contain letters
    if(!(letters.test(city))){
        alert('Please enter a location!');
        return;
    }
    // search city function called with user input as passed in parameter
    search_city(city);
    });
    // listening for when clear button is clicked
    $('#clearBtn').on('click', function(){
        // clear localStorage
        localStorage.clear();
        // history search buttons are cleared
        $('#history').clear();
    });
}

function init(){
    // calling our localStorage handeling function
    storage();
    // event listener function
    setEventlisteners();
}

// calling our initial function when the page loads
init();