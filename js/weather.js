let keyWeater = '37c8fb4c8927f2c462daf9e2b512f194';

let InformationAboutCity = {};

let searchCityInput = document.querySelector("#searchCityInput");
let searchCityBtn = document.querySelector("#searchCityBtn");
let weatherBody = document.querySelector(".weather__body");

let city = localStorage.getItem("cityKey");

weatherRequest();

searchCityBtn.addEventListener("click", function () {
    city = searchCityInput.value.trim();
    weatherRequest();
});

function weatherRequest() {

    let url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyWeater}&lang=ua&units=metric`;

    let promise = fetch(url1);
    promise
        .then(response => response.json())
        .then(json => {
            createWeatherArray(json);
            localStorage.setItem("cityKey", city);
        })

        .catch(error => {
            showError(error.message);
            console.error(error.message);
        })
}

function showError(message) {
    const html = `<div class="weather-box">${message}</div>`;
    weatherBody.insertAdjacentHTML('afterend', html);
}

function removeCard() {
    // удаляем карточку 
    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) weatherBox.remove();
}

function showCard() {
    const html = `<div class="weather-box">
                    <div class="weather-box__info">
                        <div class="info__city">
                            <h3>${InformationAboutCity.city}</h3>
                        </div>
                        <div class="info__temperature">${InformationAboutCity.temp}<sup>°c</sup></div>
                        <div class="info__around">${InformationAboutCity.description}</div>
                    </div>
                    <div class="weather-box__picture">
                        <img src="https://openweathermap.org/img/w/${InformationAboutCity.icon}.png" alt="${InformationAboutCity.weatherStatus}">
                    </div>
                </div>`;
    weatherBody.insertAdjacentHTML('afterend', html);
}

function createWeatherArray(array) {

    removeCard();

    InformationAboutCity.city = array.name;            // город
    InformationAboutCity.temp = Math.round(array.main.temp);            // температура
    InformationAboutCity.windSpeed = array.wind.speed;
    InformationAboutCity.clouds = array.clouds.all;
    InformationAboutCity.icon = array.weather[0].icon;
    InformationAboutCity.weatherStatus = array.weather[0].main;
    InformationAboutCity.description = array.weather[0].description;

    showCard();
}