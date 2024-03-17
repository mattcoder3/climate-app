const API_KEY = '7744721002eaafcda42da9e31874c373';
const searchBar = document.querySelector('.search-bar');
const searchInput = document.querySelector('.search-bar_input');

async function getCity(inputText) {
	const query = `http://api.openweathermap.org/geo/1.0/direct?q=${inputText}&limit=5&appid=${API_KEY}`;
	const result = await fetch(query);
	const data = await result.json();
	return data[0];
}

async function getClimate(event) {
	event.preventDefault();
	const inputText = event.target.input_text.value;
	if (!inputText) return;
	const cityData = await getCity(inputText);
	const query = `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.lon}&appid=${API_KEY}`;
	const result = await fetch(query);
	const data = await result.json();
	console.log(query);
	updateHTML({
		temperature: kelvinToCelcius(data.main.temp),
		main: data.weather[0].main,
		name: cityData.name,
		humidity: data.main.humidity,
		wind: data.wind.speed,
	});
}

searchBar.addEventListener('submit', getClimate);

searchInput.addEventListener('input', (event) => {
	// console.log(event.target.value);
});

function updateHTML(climate) {
	const temp = document.querySelector('.info_temperature');
	const condition = document.querySelector('.info_condition');
	const location = document.querySelector('.info-extra_location');
	const humidity = document.querySelector(
		'.info-conditions_humidity-percentage'
	);
	const wind = document.querySelector(
		'.info-conditions_wind-speed-speed'
	);
	temp.innerText = climate.temperature + 'ºC';
	condition.innerText = climate.main;
	location.innerText = climate.name;
	humidity.innerText = climate.humidity + '%';
	wind.innerText = climate.wind + 'Km/h';
	console.log(climate);
}
