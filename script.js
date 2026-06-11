// MAPA
const map = L.map('map').setView([-20, -50], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);


// ====== OPENWEATHER API ======
const OPENWEATHER_API_KEY = "COLE_SUA_CHAVE_AQUI";

async function clima(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`🌡️ ${data.main.temp}°C`)
        .openPopup();
}

// exemplo Brasil
clima(-15.78, -47.93);


// ===== VAQUINHA IA (backend futuramente) =====
async function perguntar(){
    const texto = document.getElementById("inputChat").value;

    const resposta = await fetch("/api/vaquinha",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({pergunta:texto})
    });

    const data = await resposta.json();

    document.getElementById("resposta").innerHTML =
        "🐄 Muuuu! " + data.resposta;
}


// ===== MERCADO LIVRE =====
function pesquisar(){
    const q = document.getElementById("busca").value;
    window.open("https://lista.mercadolivre.com.br/" + q);
}


// ===== SOLO =====
function analisarSolo(){
    const texto = document.getElementById("soloInput").value.toLowerCase();

    let pontos = 0;

    if(texto.includes("rotação")) pontos++;
    if(texto.includes("adubo")) pontos++;
    if(texto.includes("cobertura")) pontos++;
    if(texto.includes("orgânico")) pontos++;

    let resultado = "";

    if(pontos >= 3){
        resultado = "Solo saudável 🌱 ótimo manejo!";
    } else {
        resultado = "Solo precisa de melhorias ⚠️";
    }

    const OPENWEATHER_API_KEY = "d6fecac939bae8223326915bfd73d62e";
    document.getElementById("resultadoSolo").innerText = resultado;
}
