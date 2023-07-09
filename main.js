// ORDER: cityName, zip, forecast, humidity, high, low, sunrise, sunset

const apiKey = "a1459a628f7e12c17d739567060259a6"

// Get ZIP code
const form = document.querySelector("#submitForm");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    let userZip = document.querySelector("#userZip").value;
    // leaving default as US, country code is kind of a pain for users
    displayForecast(userZip, apiKey)
})


// Take ZIP code, get data
const getData = async(zip, apiKey) =>{
    let latLong = await axios.get(`https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${apiKey}`)
    cityName = latLong.data.name
    lat = latLong.data.lat
    lon = latLong.data.lon

    info = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)

    forecast = info.data.weather["0"].main
    humidity = info.data.main.humidity
    high = info.data.main.temp_max
    low = info.data.main.temp_min
    sunriseRaw = info.data.sys.sunrise 
    sunsetRaw = info.data.sys.sunset

    // converting time
    sunriseTime = new Date(sunriseRaw * 1000)
    sunrise = sunriseTime.toLocaleTimeString("en-US")
    sunsetTime = new Date(sunsetRaw * 1000)
    sunset = sunsetTime.toLocaleTimeString("en-US")
    
    let dataset = [cityName, forecast, humidity, high, low, sunrise, sunset]
    return dataset
}


// Display Data 
const displayForecast = async(userZip, apiKey) =>{
    const info = await getData(userZip, apiKey)
    createGrid(info[0], userZip, info[1], info[2], info[3], info[4], info[5], info[6])
}

const createGrid = (cityName, zip, forecast, humidity, high, low, sunrise, sunset) =>{
    const html = `<div id = ${zip} >
    <ul class="list-group">
        <li class="grid-item">${cityName}</li>
        <li class="grid-item">${zip}</li>
        <li class="grid-item">Forecast: ${forecast}</li>
        <li class="grid-item">Humidity: ${humidity}</li>
        <li class="grid-item" id="high">High: ${high}</li>
        <li class="grid-item" id="low">Low: ${low}</li>
        <li class="grid-item">Sunrise: ${sunrise}</li>
        <li class="grid-item">Sunset: ${sunset}</li>
    </ul>
    <button onclick="removeCity(${zip})">Remove Forecast</button>
    </div>
    `
    document.querySelector([".forecast-info"]).insertAdjacentHTML("beforeend", html)
}

const removeCity = (zip) =>{
    let city = document.getElementById(zip)
    city.remove()
}