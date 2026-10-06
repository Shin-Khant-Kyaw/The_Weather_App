API_KEY = "d41a402e63c760d79f11f3ce5e14f8d9";

const degreeFahrenheit = document.getElementById("degreeFahrenheit");
const degreeCelsius = document.getElementById("degreeCelsius");
const locationCity = document.getElementById("location");
const latlon = document.getElementById("lat&long");
const country = document.getElementById("country");
const description = document.getElementById("description");
const subText = document.getElementById("subText");

const subDes = document.getElementById("subDes");
const pressure = document.getElementById("pressure");
const progressBar = document.getElementById("progressBar");

const humidityText = document.getElementById("humidity");
const humidityDes = document.getElementById("humidityDes");
const visibilityText = document.getElementById("visibility");
const visDes = document.getElementById("visDes");
const windText = document.getElementById("wind");
const gustText = document.getElementById("gust");

const searchBar = document.getElementById("searchBar");
const searchCity = document.getElementById("searchCity");

const overlay = document.getElementById("overlay");

searchBar.addEventListener("submit", (event)=>{
    event.preventDefault();

    const cityValue = searchCity.value.trim(); 


    searchCity.value = "";
    getWeather(cityValue);

    
})


async function getWeather(city){
     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
     const response = await fetch(apiUrl);
     var data = await response.json();

     let checkData = data.cod;

     if(checkData == "404"){
        overlay.style = "visibility: visible";

     }else{
        updateData(data);
        renderUIdata(data);
     }

     console.log(data);
     console.log(checkData)
     
     




}
function updateData(data){

    const temp = data.main.temp;
    const tempF = Math.round((temp * 9/5) + 32);

    const city = data.name;
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const nation = data.sys.country;
    const maindes = data.weather[0].main;
    const des = data.weather[0].description;
    const humidity = data.main.humidity;
    const atmoPressure = data.main.pressure;
    const wind = data.wind.speed;
    const gust = data.wind.gust;
    const visibility = data.visibility;

    let tempFeel = "comfortable";
    if (temp >= 32){
        tempFeel = "hot and muggy"
    }else if(temp >= 28){
        tempFeel = "warm and pleasant";
    }else if(temp <= 15){
        tempFeel = "cool and crisp";
    }



    console.log(des);
    degreeFahrenheit.innerText = `/${tempF}°F`;
    degreeCelsius.innerText = `${Math.round(temp)}°C`;
    locationCity.innerText = `${city}`;
    latlon.innerText = `${lat}°N/${lon}°E`;
    country.innerText = nation;
    description.innerText = maindes;

    subDes.innerText = des;
    pressure.innerText = `${atmoPressure} hPa`;

    subText.innerText = `Currently in ${city}, expect ${des} with temperatures around ${Math.round(temp)}°C, ${tempFeel.charAt(0).toUpperCase()}${tempFeel.slice(1)} conditions with ${humidity}% humidity.`

    humidityText.innerText = `${humidity}%`;

    let humidityDescription;
    if(humidity <= 25){
        humidityDescription = "Low Moisture Air";
    }else if(humidity >= 25 && humidity < 50){
        humidityDescription = "Optimal Comfort Level";
    }else if(humidity >= 50  && humidity <= 75 ){
        humidityDescription = "Elevated Mositure Level";
    }else{
        humidityDescription = "Near Saturation Point";
    }
    humidityDes.innerText = humidityDescription;


    windText.innerText = `${wind} m/s`;
    gustText.innerText = `Gusts ${gust} m/s`

    let visikm = (visibility/1000).toFixed(1);
    let visimile = (visibility/1609.34).toFixed(1);

    visibilityText.innerText = `${visikm}km / ${visimile} mile`;

    let visiStatus;
    if(visibility <= 1000){
        visiStatus = "Severely Reduced Visibility";
    }else if(visibility >= 1001 && visibility <= 4000){
        visiStatus = "Moderate Haze / Mist";   
    }else if(visibility >= 4001 && visibility <= 9999){
        visiStatus = "Slightly Hazy Conditions"
    }else if(visibility >= 10000){
        visiStatus = "Optimal Surface Visibility"
    }

    visDes.innerText = visiStatus;

    atmoPressureCal(atmoPressure);
    
}

function atmoPressureCal(hPa){
    const maxhPa = 1050;
    const minhPa = 950;

    const percent = ((hPa - minhPa)/(maxhPa - minhPa) * 100);
    

    progressBar.style = `width: ${percent}%`
}


function renderUIdata(data){
    const iconCode = data.weather[0].icon;
    const idCode = data.weather[0].id;
    
    const fontAwesomeClass =  getFontAwesomeIcon(idCode, iconCode);

    const weatherIconContainer = document.getElementById("weatherIconContainer");
    weatherIconContainer.innerHTML = `<i class=" ${fontAwesomeClass} fa-lg text-primary"></i>`

    console.log(fontAwesomeClass)


}

function getFontAwesomeIcon(weatherCode, iconCode) {
    const isNight = iconCode ? iconCode.endsWith('n') : false;

    // 2xx: Thunderstorm
    if (weatherCode >= 200 && weatherCode < 300) {
        return "fa-solid fa-cloud-bolt";
    } 
    // 3xx: Drizzle
    else if (weatherCode >= 300 && weatherCode < 400) {
        return "fa-solid fa-cloud-rain";
    } 
    // 5xx: Rain
    else if (weatherCode >= 500 && weatherCode < 600) {
        return weatherCode >= 502 ? "fa-solid fa-cloud-showers-heavy" : "fa-solid fa-cloud-sun-rain";
    } 
    // 6xx: Snow
    else if (weatherCode >= 600 && weatherCode < 700) {
        return "fa-solid fa-snowflake";
    } 
    // 7xx: Atmosphere (Fog, Smog, Tornado)
    else if (weatherCode >= 700 && weatherCode < 800) {
        return weatherCode === 781 ? "fa-solid fa-tornado" : "fa-solid fa-smog";
    } 
    // 800: Clear sky
    else if (weatherCode === 800) {
        return isNight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    } 
    // 801-802: Few/Scattered Clouds
    else if (weatherCode === 801 || weatherCode === 802) {
        return isNight ? "fa-solid fa-cloud-moon" : "fa-solid fa-cloud-sun";
    } 
    // 803-804: Broken/Overcast Clouds
    else if (weatherCode >= 803) {
        return "fa-solid fa-cloud";
    }

    return "fa-solid fa-cloud-sun";
}

function clearWarning(){
    overlay.style = "visibility:hidden";
}

getWeather("New York");

