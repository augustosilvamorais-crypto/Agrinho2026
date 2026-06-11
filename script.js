
// MAPA
const map = L.map('map').setView([-15, -47], 4);

// base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// camadas clima (OpenWeather)
let camadaAtual;

const API = "SUA_CHAVE_AQUI";

// trocar camada
function trocarCamada(tipo){

if(camadaAtual){
map.removeLayer(camadaAtual);
}

let url = "";

if(tipo === "temp"){
url = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API}`;
}

if(tipo === "chuva"){
url = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API}`;
}

if(tipo === "vento"){
url = `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API}`;
}

camadaAtual = L.tileLayer(url);
camadaAtual.addTo(map);
}

// cidade
async function irCidade(){

const cidade = document.getElementById("cidade").value;

const res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API}&units=metric`
);

const data = await res.json();

map.setView([data.coord.lat, data.coord.lon], 6);

L.marker([data.coord.lat, data.coord.lon])
.addTo(map)
.bindPopup(`🌡️ ${data.main.temp}°C`)
.openPopup();
}

// inicial
trocarCamada("temp");

const API = "d6fecac939bae8223326915bfd73d62e";
