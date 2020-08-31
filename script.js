



class FiveDayWeather {
    changeProperties(day, temperature, description, icon, feelslike, wind, time) {
        this.day = day;
        this.temperature = temperature;
        this.description = description;
        this.icon = icon;
        this.feelslike = feelslike;
        this.wind = wind;
        this.time = time;
    }
}


class CurrentWeather {
    changeProperties(city, date, temperature, description, icon, feelslike, sunrise, sunset, country) {
        this.city = city;
        this.temperature = temperature;
        this.description = description;
        this.icon = icon;
        this.date = date;
        this.feelslike = feelslike;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.country = country;
    }
}

class HourWeather {
    changeProperties(city, time, temperature, description, icon, feelslike, wind) {
        this.time = time;
        this.city = city;
        this.temperature = temperature;
        this.description = description;
        this.icon = icon;
        this.feelslike = feelslike;
        this.wind = wind;
    }
}

class NetworkManager {
    static getCurrentWeather(cityname) {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; 
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let datenow = day + "/" + month + "/" + year;
        current_weather = null;
        current_weather = new CurrentWeather();
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=6e8264e813fc976c252fddfb869b53c5`;
        alert(url);
        return $.getJSON(url, function (data) {
            current_weather.changeProperties(data.name, datenow,
                parseInt(data.main.temp, 10), data.weather[0].main,
                data.weather[0].icon, parseInt(data.main.feels_like, 10), new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                new Date(data.sys.sunset * 1000).toLocaleTimeString(), data.sys.country);

            updateCurrentWeatherHTML();
        });
    }
    static getCurrentWeatherHours(cityname) {
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&appid=6e8264e813fc976c252fddfb869b53c5`;
        return $.getJSON(url, function (data) {
            for (let i = 1; i < 6; i++) {
                let temp = new HourWeather();
                temp.changeProperties(data.city.name, new Date(data.list[i - 1].dt * 1000).toLocaleTimeString(),
                    parseInt(data.list[i - 1].main.temp, 10), data.list[i - 1].weather[0].main,
                    data.list[i - 1].weather[0].icon, parseInt(data.list[i - 1].main.feels_like, 5), data.list[i - 1].wind.speed);
                hours_weather.push(temp);
                updateHoursWeatherHTML(i);
            }
        });
    }
    static getCurrentWeatherDays(cityname) {
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&appid=6e8264e813fc976c252fddfb869b53c5`;
        return $.getJSON(url, function (data) {
            let k = 0;
            for (let i = 1; i < 41; i++) {
                let temp = new FiveDayWeather();
                temp.changeProperties(new Date(data.list[i - 1].dt * 1000).toDateString(),
                    parseInt(data.list[i - 1].main.temp, 10), data.list[i - 1].weather[0].main,
                    data.list[i - 1].weather[0].icon, parseInt(data.list[i - 1].main.feels_like, 10), data.list[i - 1].wind.speed, new Date(data.list[i - 1].dt * 1000).toLocaleTimeString());
                days_hours.push(temp);
                if (i == 6 || i == 14 || i == 22 || i == 30 || i == 38) {
                    k++;
                    updateDaysWeatherHTML(k, i - 5);
                }
            }
            for (let m = 1; m < 6; m++)
                updateHoursWeatherHTML1(m, m);
        });

    }
}

function updateCurrentWeatherHTML() {

    $("#date").html(current_weather.date);
    $("#current-weather-description").html(current_weather.description);
    $("#current-temperature").html(current_weather.temperature);
    $("#feels-like").html(current_weather.feelslike);
    $("#today-sunrise").html(current_weather.sunrise);
    $("#today-sunset").html(current_weather.sunset);
    $("#search-input").attr("placeholder", `${current_weather.city}, ${current_weather.country}`);
    $("#current-weather-icon").attr("src", `http://openweathermap.org/img/wn/${current_weather.icon}@2x.png`)
}
function updateHoursWeatherHTML(i) {

    $(`#hour-${i}`).html(hours_weather[i - 1].time);
    $(`#hours-weather-icon-${i}`).attr("src", `http://openweathermap.org/img/wn/${hours_weather[i - 1].icon}@2x.png`);
    $(`#hours-weather-description-${i}`).html(hours_weather[i - 1].description);
    $(`#hours-temperature-${i}`).html(hours_weather[i - 1].temperature);
    $(`#feels-like-${i}`).html(hours_weather[i - 1].feelslike);
    $(`#wind-${i}`).html(hours_weather[i - 1].wind)
}
function updateHoursWeatherHTML1(k, i) {

    $(`#days-pod-hour-${k}`).html(days_hours[i - 1].time);
    $(`#days-pod-hours-weather-icon-${k}`).attr("src", `http://openweathermap.org/img/wn/${days_hours[i - 1].icon}@2x.png`);
    $(`#days-pod-hours-weather-description-${k}`).html(days_hours[i - 1].description);
    $(`#days-pod-hours-temperature-${k}`).html(days_hours[i - 1].temperature);
    $(`#days-pod-feels-like-${k}`).html(days_hours[i - 1].feelslike);
    $(`#days-pod-wind-${k}`).html(days_hours[i - 1].wind)
}
function updateDaysWeatherHTML(k, i) {
    let h = 0;
    $(`#days-img-${k}`).attr("src", `http://openweathermap.org/img/wn/${days_hours[i - 1].icon}@2x.png`);
    $(`#days-day-${k}`).html(days_hours[i - 1].day);
    $(`#days-description-${k}`).html(days_hours[i - 1].description);
    $(`#days-temperature-${k}`).html(days_hours[i - 1].temperature);
    $(`#btnDay${k}`).click(function () {
        for (let j = 0; j < 5; j++) {
            h++;
            updateHoursWeatherHTML1(h, i + j);
        }
    })

}
let city_name = "Kyiv";
let hours_weather = [];
let days_hours = [];
let current_weather = new CurrentWeather();

NetworkManager.getCurrentWeather(city_name);
NetworkManager.getCurrentWeatherHours(city_name);
NetworkManager.getCurrentWeatherDays(city_name);
$('#btnSearch').click(function () {
    let cityname = $('#search-input').val();
    $('#search-input').val("");
    NetworkManager.getCurrentWeather(cityname);
    NetworkManager.getCurrentWeatherHours(cityname);
    NetworkManager.getCurrentWeatherDays(cityname);
})
