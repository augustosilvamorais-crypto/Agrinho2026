
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

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-52, -15]),
    zoom: 4
  })
});

// camada de nuvem (OpenWeather)
function addClouds(apiKey){
  const layer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`
    })
  });
  map.addLayer(layer);
}
