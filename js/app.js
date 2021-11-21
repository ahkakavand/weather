const RECENT_SEARCH = 'RECENT_SEARCH'

const debounce = _.debounce(searchCities, 500)

let DIRECTION = {
    1: 'N',

    2: 'NNE',

    3: 'NE',

    4: 'ENE',

    5: 'E',

    6: 'ESE',

    7: 'SE',

    8: 'SSE',

    9: 'S',

    10: 'SSW',

    11: 'SW',

    12: 'WSW',

    13: 'W',

    14: 'WNW',

    15: 'NW',

    16: 'NNW',

    17: 'N',
}

function handleInputChange() {
    debounce()
}

async function searchCities() {
    const searchInputElement = document.getElementsByClassName('search__input')[0]
    const foundedCities = await getCities(searchInputElement.value);
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0]


    toggleSuggestion(searchInputElement.value.length)


    if (foundedCities.length) {
        loadSuggestions(foundedCities)
        setRecentSearch(foundedCities)
    } else {
        const emptyElement = `<div class="empty__message"><span>${searchInputElement.value} is not founded...</span><span>     Please search city</span></div>`
        suggestionElement.innerHTML = emptyElement
    }
}

function handelInputBlur() {
    setTimeout(() => toggleSuggestion(false), 200)
}

function handleInputFocus() {
    const recentCities = JSON.parse(localStorage.getItem(RECENT_SEARCH))
    if (recentCities && recentCities.length) {
        loadSuggestions(recentCities)
        toggleSuggestion(true)
    }
}

async function selectCity(cityName) {
    const searchInputElement = document.getElementsByClassName('search__input')[0]
    const city = cityName.name

    searchInputElement.value = city

    let response = await getCurrentWeather(cityName.id)
    let fiveDays = await getFiveDaysWeather(cityName.id)
    chengCurrentWaetherInfo(response)
    chengFiveDays(fiveDays)
}

function loadSuggestions(cities) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0]
    let items = document.getElementsByName('search__items')[0]
    items && items.remove()
    // let items = "<ul class='search__items'>"
    const ul = document.createElement('ul')
    ul.classList.add('search__items')

    cities.forEach(city => {
        let element = document.createElement('li')
        element.classList.add('search__item')
        element.onclick = () => selectCity(city)
        element.innerText = city.name
        ul.appendChild(element)
        // items += itemElement;
    });
    // items += '</ul>'
    // suggestionElement.innerHTML = items;
    suggestionElement.appendChild(ul)
}

function toggleSuggestion(isShow) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0]
    isShow ?
        suggestionElement.classList.add('search__suggestion--active') :
        suggestionElement.classList.remove('search__suggestion--active');

    !isShow && (() => {
        suggestionElement.innerHTML = ' '
    })();
}

function setRecentSearch(cities) {
    let data = cities.slice(0, 4)
    data = JSON.stringify(data)
    localStorage.setItem(RECENT_SEARCH, data)
}

function chengCurrentWaetherInfo(weather) {
    const cityEl = document.querySelector('.city-temprature__title');
    const degreeEl = document.querySelector('.temprature__current-degree');
    const dayEl = document.querySelector('.city-temprature__current-day');
    const pressureEl = document.querySelector('.pressure');
    const windEl = document.querySelector('.wind');
    const humidityEl = document.querySelector('.humidity');
    const iconEl = document.querySelector('.weathe__icon');

    cityEl.innerHTML = `${weather.name}, ${weather.sys.country}`
    degreeEl.innerHTML = `${Math.round(weather.main.temp - 273)} °C`
    iconEl.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
    dayEl.innerHTML = moment(weather.dt, 'X').format('dddd');
    humidityEl.innerHTML = `${weather.main.humidity}%`
    pressureEl.innerHTML = `${weather.main.pressure} hPa`
    const deg = Math.round((weather.wind.deg / 22.5) + 1)
    console.log(DIRECTION[3]);
    windEl.innerHTML = `${DIRECTION[deg]}, ${weather.wind.speed} m/s`
}

function chengFiveDays(weathers) {
    let allDays = weathers.list.filter((i , index) => index % 8 === 0)
    console.log(allDays);
}
