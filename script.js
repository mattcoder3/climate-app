const API_KEY = '7744721002eaafcda42da9e31874c373';
const searchBar = document.querySelector('.search-bar');
const searchInput = document.querySelector('.search-bar_input');

// DOM
const body = document.querySelector('.body');
const temp = document.querySelector('.info_temperature');
const condition = document.querySelector('.info_condition');
const city = document.querySelector('.info-extra_city');
const humidity = document.querySelector(
	'.info-conditions_humidity-percentage'
);
const wind = document.querySelector(
	'.info-conditions_wind-speed-speed'
);
const country = document.querySelector('.info-extra_country');
const infoImage = document.querySelector('.info_image');
const searchSuggestions = document.querySelector(
	'.search-bar_suggestions'
);

async function getCity(inputText) {
	const query = `https://api.openweathermap.org/geo/1.0/direct?q=${inputText}&limit=5&appid=${API_KEY}`;
	const result = await fetch(query);
	const data = await result.json();
	return data;
}

async function getClimate(event) {
	let input_text;
	if (event?.code === 1) {
		inputText = 'New York';
	} else {
		inputText = event?.target?.input_text.value;
		event?.preventDefault();
	}
	const cityData = await getCity(inputText);
	getClimateFromCoords(cityData[0].lat, cityData[0].lon);
}

searchBar.addEventListener('submit', getClimate);

searchInput.addEventListener('input', async (event) => {
	console.log(event.target.value);
	const inputText = event.target.value;
	const searchResults = await getCity(inputText);
	console.log(searchResults);
	searchSuggestions.innerHTML = '';
	searchResults.map(
		(suggestion) =>
			(searchSuggestions.innerHTML += `
						<option
							class="search-bar_suggestion"
							value="${suggestion.name}">
							${suggestion.name}
						</option>
	`)
	);
});

function updateHTML(climate) {
	infoImage.setAttribute(
		'src',
		`./images/SVG/${WEATHER_ICONS[climate.icon]}.svg`
	);
	temp.innerText = climate.temperature + 'ºC';
	condition.innerText = climate.main;
	city.innerText = climate.name + ', ';
	country.innerText = climate.country;
	humidity.innerText = climate.humidity + '%';
	wind.innerText = climate.wind + 'Km/h';
	body.classList = `body body-${BACKGROUND[climate.icon]}`;
}

const getClimateFromCoords = async (lat, lon) => {
	const query = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	const result = await fetch(query);
	const data = await result.json();
	updateHTML({
		temperature: kelvinToCelcius(data.main.temp),
		main: data.weather[0].main,
		name: data.name,
		humidity: data.main.humidity,
		wind: data.wind.speed,
		country: data.sys.country,
		icon: data.weather[0].icon,
	});
};

navigator.geolocation.getCurrentPosition((position) => {
	getClimateFromCoords(
		position.coords.latitude,
		position.coords.longitude
	);
}, getClimate);
