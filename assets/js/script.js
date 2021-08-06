//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

var API_key = '5de402f3e60411c4f9d65bfcb6878fea';

// api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
function handleSuccessfulData(data){
    $('#today').empty();
    var list = data.list[0];
    set_item(list['name']);
    console.log()
    var iconurl = "https://openweathermap.org/img/wn/"+ list['weather'][0]['icon']+ ".png";
    var weather_image = $('<img id="weather-icon" src='+iconurl+'>');
    var today = moment().format("M/D/YYYY");
    var mainContent = $("<div class='card'></div>");
    var contentBdy = $("<div class='card-body'></div>");
    var todayTemp = $("<p class='card-text'>Temp: "+list['main']['temp']+"°F</p>");
    var todayWind = $("<p class='card-text'>Wind: "+list['wind']['speed']+" mph</p>");
    var todayHumidity = $("<p class='card-text'>Humidity: "+list['main']['humidity']+"%</p>");
    mainContent.append(contentBdy);
    var contentTitle = $("<h2 class='h3 card-title'>"+list['name']+" ("+today+") </h2>");
    contentTitle.append(weather_image)
    contentBdy.append(contentTitle).append(todayTemp).append(todayWind).append(todayHumidity);;
    $('#today').append(mainContent);
}

function UVfider(coord){
    var lat = coord['lat'];
    var lon = coord['lon'];
    console.log(coord);
    var todayUV; 
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly,alerts,daily&appid="+API_key;
    fetch(requestURL)
    .then(function (res) {
        if(res.ok){
            return res.json();
        }else{
            return;
        }
      })
      .then(function (data) {   
        console.log(data['current']['uvi']);
        uvData = data['current']['uvi'];
        todayUV= $("<p class='card-text'>UV index: </p>");
        uvNum = $("<span class='UVI'>"+uvData+"</span>");
        todayUV.append(uvNum)
        if(uvData > 2 && uvdata <= 5){
            uvNum.attr('id', 'yellow');
            
        }else if(uvData > 5 && uvdata <= 7){
            uvNum.attr('id', 'orange');
 
        }else if(uvData > 7 && uvdata <= 10){
            uvNum.attr('id', 'red');

        }else if(uvData >= 11){
            uvNum.attr('id', 'purple'); 

        }else{
            uvNum.attr('id', 'green');
        }
        $('.card-body').append(todayUV);
      });  
}

function fiveDay(coords){
    var forecast = $('#forecast');
    forecast.empty();
    var forecast_title = $('<h4 class="col-12">5-day Forecast:</h4>');
    forecast.append(forecast_title);
    var lat = coords['lat'];
    var lon = coords['lon'];
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly,alerts,current&appid="+API_key;
    fetch(requestURL)
    .then(function (response) {
        if(response.ok){
            return response.json();
        }else{
            return;
        }
      })
      .then(function (data) {
        console.log(data)
        var weather_list = data['daily'];
        for(var i = 1; i < weather_list.length - 2; i++){
            var icon = weather_list[i]['weather']
            var iconurl = "https://openweathermap.org/img/wn/"+ icon[0]['icon']+ ".png";
            var weather_image = $('<p><img id="weather-icon" src='+iconurl+'></p>');
            var card_container = $('<div class="col-md five-day-card"></div>');
            var card_content = $('<div class="card h-150 text-white" id="forecast-card"></div>');
            card_container.append(card_content);
            var card_title = $("<h4>"+moment().add(i, 'days').format("M/D/YYYY")+"</h4>");
            var card_temp = $("<p>Temp: "+weather_list[i]['temp']['day']+"°F</p>");
            var card_wind = $("<p>Wind: "+weather_list[i]['wind_speed']+" mph</p>");
            var card_humid = $("<p>Humidity: "+weather_list[0]['humidity']+"%</p>");
            card_content.append(card_title).append(weather_image).append(card_temp).append(card_wind).append(card_humid);
            forecast.append(card_container);
        }
     });  
}

function search_city(city){

    console.log(city);
    var searchURL = 'https://api.openweathermap.org/data/2.5/find?q='+city+'&units=imperial&appid='+API_key;
    fetch(searchURL)
    .then(function (response) {
        if(response.ok){
            return response.json();
        }else{
            alert(city + " not found!");
            return;
        }
      })
      .then(function (data) {
          if(data.count === 0){
            alert(city + " is not a valid location!");
            return;
          }
          handleSuccessfulData(data);
          UVfider(data['list'][0]['coord']);
          fiveDay(data['list'][0]['coord']);
     });  
}

function handleBtn(evnt){
    evnt.preventDefault();
    var location = evnt.target.value;
    search_city(location);
}

function storage(){
    var city_items = JSON.parse(localStorage.getItem('city'));
    if(city_items != undefined){
        for(i = 0; i < city_items.length; i++){
            var newBtn = $('<button class="btn btn-success">'+city_items[i]+'</button>');
            $('#history').append(newBtn)
            newBtn.attr('value', city_items[i]);
            newBtn.on('click', handleBtn);
        }
    }
}

function set_item(city){
    city_Arr = [city]
    var city_items = JSON.parse(localStorage.getItem('city'));
    if(city_items != undefined){
        for(var i = 0; i < city_items.length; i++){
            var lowLocation = city.toLowerCase();
            var lowItem = city_items[i].toLowerCase();
            if(lowItem == lowLocation){
                return;
            }
        }
        localStorage.setItem('city', JSON.stringify(city_items.concat(city)));
    }else{
        
        localStorage.setItem('city', JSON.stringify(city_Arr));
    }
    var newBtn = $('<button class="btn btn-success">'+city+'</button>');
            $('#history').append(newBtn)
            newBtn.attr('value', city);
            newBtn.on('click', handleBtn);
}

function setEventlisteners(){
    $('#searchBtn').on('click', function(evnt){
        evnt.preventDefault();
    var letters = /[a-zA-Z]/g;
    var city = $("#state-input").val();
    if(!(letters.test(city))){
        alert('Please enter a location!');
        return;
    }
    search_city(city);
    });
    $('#clearBtn').on('click', function(){
        localStorage.clear();
        $('#history').clear();
    });
}

function init(){
    storage();
    setEventlisteners();
}

init();