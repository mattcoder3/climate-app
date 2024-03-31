const API_KEY = '7744721002eaafcda42da9e31874c373';
const searchBar = document.querySelector('.search-bar');
const searchInput = document.querySelector('.search-bar_input');

// DOM
const body = document.querySelector('.body');
const gradient = document.querySelector('.gradient');
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

async function getClimateFromSuggestion(event) {
	const cityData = await getCity(event.innerText);
	searchSuggestions.innerHTML = '';
	getClimateFromCoords(cityData[0].lat, cityData[0].lon);
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

document.addEventListener('keydown', (event) => {
	if (searchSuggestions.innerHTML === '') return;
	const numberOfChildren = searchSuggestions.children.length;
	if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
		const numberSelector =
			1 * (event.key === 'ArrowDown') - 1 * (event.key === 'ArrowUp');
		if (document.activeElement.id === 'input') {
			document
				.getElementById(
					`suggestion_${
						numberSelector === 1 ? 0 : numberOfChildren - 1
					}`
				)
				.focus();
		} else if (
			document.activeElement.classList.contains(
				'search-bar_suggestion'
			)
		) {
			const currentIndex = Number(
				document.activeElement.id.slice(-1)
			);
			document
				.getElementById(
					`suggestion_${
						(currentIndex + numberSelector + numberOfChildren) %
						numberOfChildren
					}`
				)
				.focus();
		}
	}
	if (
		event.key === 'Enter' &&
		document.activeElement.classList.contains('search-bar_suggestion')
	) {
		document.activeElement.click();
	}
});

searchInput.addEventListener('input', async (event) => {
	const inputText = event.target.value;
	const searchResults = await getCity(inputText);
	searchSuggestions.innerHTML = '';
	searchResults.map((suggestion, index) => {
		return (searchSuggestions.innerHTML += `
						<li id="suggestion_${index}"
							class="search-bar_suggestion" onclick="getClimateFromSuggestion(this)"
							tabindex="0"
							value="${suggestion.name}" style="top: ${`${index * 2.5}rem;`}">
							${suggestion.name}
						</li>
	`);
	});
});

function changeBackground(background) {
	const root = document.documentElement;
	const isBefore = gradient.classList.contains('is-before');
	const varName = `--${isBefore ? 'color' : 'before'}-gradient`;
	for (let i = 0; i < 4; i++) {
		root.style.setProperty(
			`${varName}-${i + 1}`,
			THEMES[background][i]
		);
	}
	gradient.classList.toggle('is-before');
}

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
	changeBackground(BACKGROUND[climate.icon]);
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
