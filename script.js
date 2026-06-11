// MAPA BASE (FUNCIONANDO)
const map = L.map('map').setView([-15, -47], 4);

// OpenStreetMap base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

// MARCADOR EXEMPLO
let marker;

// BUSCAR CIDADE
async function buscarCidade(){

const cidade = document.getElementById("cidade").value;

// API CLIMA
const apiKey = "SUA_CHAVE_AQUI";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric`;

const res = await fetch(url);
const data = await res.json();

const lat = data.coord.lat;
const lon = data.coord.lon;

// centraliza mapa
map.setView([lat, lon], 6);

// remove marcador antigo
if(marker){
map.removeLayer(marker);
}

// novo marcador
marker = L.marker([lat, lon])
.addTo(map)
.bindPopup(
"Clima: " + data.main.temp + "°C"
)
.openPopup();
}
