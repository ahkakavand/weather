const BASE_URL = 'api.openweathermap.org/data/2.5'
const API_KEY = '9ab1bae7b1dfa0551b6a11cc054737a2'

function getCurrentWeather(cityId) {
    return fetch(`https://${BASE_URL}/weather?id=${cityId}&appid=${API_KEY}&units=metric&lang=fa`)
        .then(async response => await response.json())
        .then(error => error)
}

function getFiveDaysWeather(cityId) {
    return fetch(`https://${BASE_URL}/forecast?id=${cityId}&appid=${API_KEY}&units=metric&lang=fa`)
        .then(async response => await response.json())
        .then(error => error)
}