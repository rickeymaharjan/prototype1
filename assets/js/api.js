const defaultUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=selma&appid=5480a404286fbc31475b385b051b4cf2&units=metric";

let currentWeather = document.querySelector(".current-weather-card");
let highlightList = document.querySelector(".highlight-list");
const searchField = document.querySelector(".search-field");
const errorElement = document.querySelector(".error-content");

const currentDate = new Date();

// Get month name
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const month = monthNames[currentDate.getMonth()];

// Get date
const date = currentDate.getDate();

// Get day name
const dayNames = [
  "Sunday",
  "Monday",
  "Tueday",
  "Wednesday",
  "Thurday",
  "Friday",
  "Saturday",
];

const day = dayNames[currentDate.getDay()];

async function defaultCity() {
  const response = await fetch(defaultUrl);
  const data = await response.json();
  updateWeather(data);

  searchCity();
}

function updateWeather(data) {
  const { temp } = data.main;
  const { name } = data;
  const { country } = data.sys;
  const { description, icon } = data.weather[0];
  const { humidity } = data.main;
  const { pressure } = data.main;
  const { feels_like } = data.main;
  const { visibility } = data;
  const { lon, lat } = data.coord;

  // Current Weather
  currentWeather.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>

      <div class="wrapper">
        <p class="heading">${Math.round(temp)}&deg;<sup>c</sup></p>

        <img
          src="./assets/images/weather_icons/${icon}.png"
          alt="${description}"
          width="64"
          height="64"
          class="weather-icon"
        />
      </div>

      <p class="body-3">${description}</p>

      <ul class="meta-list">
        <li class="meta-item">
          <span class="m-icon">calendar_today</span>
          <p class="title-3 meta-text">${day} ${date}, ${month}</p>
        </li>
        <li class="meta-item">
          <span class="m-icon">location_on</span>
          <p class="title-3 meta-text">${name}, ${country}</p>
        </li>
      </ul>
      `;

  // Highlights

  document.querySelector(".humidity").innerHTML = `${humidity}<sub>%</sub>`;
  document.querySelector(".pressure").innerHTML = `${pressure}<sub>hPa</sub>`;
  document.querySelector(".feels-like").innerHTML = `${Math.round(
    feels_like
  )}<sub>&deg;c</sub>`;

  document.querySelector(".visibility").innerHTML = `${
    visibility / 1000
  }<sub>km</sub>`;

  // Air quality Index

  fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=5480a404286fbc31475b385b051b4cf2`
  )
    .then((response) => response.json())
    .then((data) => {
      const { so2 } = data.list[0].components;
      const { no2 } = data.list[0].components;
      const { pm2_5 } = data.list[0].components;
      const { o3 } = data.list[0].components;

      document.querySelector(".aqi-pm").textContent = pm2_5;
      document.querySelector(".aqi-so2").textContent = so2;
      document.querySelector(".aqi-no2").textContent = no2;
      document.querySelector(".aqi-o3").textContent = o3;
    });

  // Sunrise and Sunset time
  const { sunrise } = data.sys;
  const { sunset } = data.sys;

  const sunriseTime = new Date(sunrise * 1000);
  const sunsetTime = new Date(sunset * 1000);

  let sunriseHour = sunriseTime.getHours();
  let sunriseMinute = sunriseTime.getMinutes();
  sunriseMinute = sunriseMinute < 10 ? "0" + sunriseMinute : sunriseMinute;

  let sunsetHour = sunsetTime.getHours();
  sunsetHour = sunsetHour % 12;

  let sunsetMinute = sunsetTime.getMinutes();
  sunsetMinute = sunsetMinute < 10 ? "0" + sunsetMinute : sunsetMinute;

  const sunriseElement = document.querySelector(".sunrise-time");
  const sunsetElement = document.querySelector(".sunset-time");

  sunriseElement.textContent = `${sunriseHour}:${sunriseMinute} AM`;
  sunsetElement.textContent = `${sunsetHour}:${sunsetMinute} PM`;
}

function searchCity() {
  searchField.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      const city = searchField.value;
      getWeatherData(city);
      searchField.value = "";
    }
  });
}

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=5480a404286fbc31475b385b051b4cf2&units=metric`
    );

    if (response.status === 404) {
      throw new Error("Not Found");
    }

    const data = await response.json();

    updateWeather(data);
  } catch (error) {
    if (error.message === "Not Found") {
      errorElement.style.display = "flex";
      goHome();
    } else {
      return;
    }
  }
}

function goHome() {
  const goHomeBtn = document.querySelector(".go-home-btn");
  goHomeBtn.addEventListener("click", () => {
    errorElement.style.display = "none";
    defaultCity();
  });
}

defaultCity(defaultUrl);
