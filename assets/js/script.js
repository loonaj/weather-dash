var weatherEl = $("#weather-container");
var historyEl = $("#history");
var apiKey = "aa630346e91a6441f826ab5f7a6be4a5";
var searchHistory = [];

function searchCity(event, city) {
    event.preventDefault();
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        saveHistory(city);
                        displayWeather(data.coord.lon, data.coord.lat);
                        $("#city").val("");
                    })
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to API ", error);
        })
}

function displayWeather(long, lat) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + long + "&appid=" + apiKey;
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        console.log(data);
                        currentWeather(data.current);
                        forecastWeather(data.daily);
                    })
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to API ", error);
        })
}

function currentWeather(current) {
    $("#weather-container").html("");
    var iconURL = "https://openweathermap.org/img/wn/" + current.weather[0].icon + "@2x.png"
    var currentEl = document.createElement("div");
    currentEl.className = "border border-dark p-4";
    var dateEl = document.createElement("h2");
    dateEl.textContent = "Date: " + moment().format("MM/DD/YYYY");
    var weather = document.createElement("h2");
    weather.innerHTML = "Current Weather: <img src='" + iconURL + "' alt='weather-icon' max-width=50%/> " + current.weather[0].description
    var TempEl = document.createElement("h4");
    TempEl.textContent = "Temp: " + current.temp + " °F";
    var WindEl = document.createElement("h4");
    WindEl.textContent = "Wind: " + current.wind_speed + " MPH";
    var HumidityEl = document.createElement("h4");
    HumidityEl.textContent = "Humidity: " + current.humidity + " %";
    var uvEl = document.createElement("h4");
    uvEl.textContent = "UV Index: ";
    var uvIndex = document.createElement("span");
    if (current.uvi < 2) {
        uvIndex.className = "d-inline rounded favorable";
    } else if (current.uvi >= 2 && current.uvi < 6) {
        uvIndex.className = "d-inline rounded moderate";
    } else {
        uvIndex.className = "d-inline rounded severe";
    }
    uvIndex.textContent = current.uvi;
    uvEl.append(uvIndex);
    currentEl.append(dateEl, weather, TempEl, WindEl, HumidityEl, uvEl);
    weatherEl.append(currentEl);
}

function forecastWeather(daily) {
    var cardContainerEl = document.createElement("div");
    cardContainerEl.className = "d-flex flex-row flex-wrap justify-content-between mt-3";
    var cardTitleEl = document.createElement("h1");
    cardTitleEl.textContent = "Five Day Forecast: ";
    weatherEl.append(cardTitleEl);
    for (var i = 0; i < 5; i++) {
        var iconURL = "https://openweathermap.org/img/wn/" + daily[i].weather[0].icon + ".png"
        var cardEl = document.createElement("div");
        cardEl.className = "card text-center align-items-center p-3";
        var cardDateEl = document.createElement("h3");
        cardDateEl.textContent = moment().add((i + 1), 'd').format("MM/DD/YY");
        var cardImgEl = document.createElement("img");
        cardImgEl.src = iconURL;
        cardImgEl.alt = "weather-icon";
        cardImgEl.width = "100";
        cardImgEl.height = "100";
        var cardDescEl = document.createElement("h4");
        cardDescEl.textContent = daily[i].weather[0].description;
        var cardTempEl = document.createElement("h3");
        cardTempEl.textContent = "Temp: " + daily[i].temp.day + " °F";
        var cardWindEl = document.createElement("h3");
        cardWindEl.textContent = "Wind: " + daily[i].wind_speed + " MPH";
        var cardHumidityEl = document.createElement("h3");
        cardHumidityEl.textContent = "Humidity: " + daily[i].humidity + " %";
        cardEl.append(cardDateEl, cardImgEl, cardDescEl, cardTempEl, cardWindEl, cardHumidityEl);
        cardContainerEl.append(cardEl);
        weatherEl.append(cardContainerEl);
    }
}

function saveHistory(city) {
    if (!(searchHistory.indexOf(city) > -1)) {
        searchHistory.push(city);
    }
    localStorage.setItem("search", JSON.stringify(searchHistory));
}

function getHistory() {
    var history = localStorage.getItem("search");
    history = JSON.parse(history);
    for (x in history) {
        searchHistory.push(history[x]);
        SearchHistoryButton(history[x]);
    }
}

function SearchHistoryButton(cityName) {
    var buttonEl = document.createElement("button");
    buttonEl.className = "btn btn-success w-75 m-1";
    buttonEl.textContent = cityName;
    buttonEl.setAttribute("data-search", cityName);
    historyEl.append(buttonEl);
}

function clearHistory() {
    localStorage.clear();
    location.reload();
}

$(document).on("click", ".btn", function() {
    var city = $("#city").val().trim();
    if (city === null || city === "") {
        city = $(this).attr("data-search");
    }
    if (!(searchHistory.indexOf(city) > -1)) {
        SearchHistoryButton(city);
    }
    $("#weather-search").text(city);
    searchCity(event, city);
});

getHistory();