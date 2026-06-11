// Variável global para gerenciar a instância do mapa Leaflet
let mapaInstancia = null;

function obterDataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${dia} de ${meses[data.getMonth()]} de 2026`;
}

// Converte os códigos técnicos de clima da API (WMO) para texto claro em português
function interpretarCodigoClima(codigo) {
    const codigos = {
        0: "Céu Limpo - Condições ideais para aplicação de insumos.",
        1: "Principalmente Limpo.",
        2: "Parcialmente Nublado.",
        3: "Nublado - Redução de radiação solar direta.",
        45: "Nevoeiro presente.",
        48: "Nevoeiro com depósito de geada.",
        51: "Chuvisco Leve.",
        53: "Chuvisco Moderado.",
        55: "Chuvisco Intenso.",
        61: "Chuva Leve - Favorável à infiltração controlada.",
        63: "Chuva Moderada.",
        65: "Chuva Forte - Atenção a possíveis focos de erosão.",
        80: "Pancadas de Chuva Leves.",
        81: "Pancadas de Chuva Moderadas.",
        82: "Pancadas de Chuva Violentas.",
        95: "Tempestade - Risco de descargas elétricas, suspender atividades no campo."
    };
    return codigos[codigo] || "Condições meteorológicas estáveis.";
}

// Função Principal que conecta as APIs de Geolocalização, Clima e o Mapa de Satélite
async function executarMonitoramento() {
    const cidadeInput = document.getElementById('city-input').value.trim();
    const feedbackDiv = document.getElementById('loading-feedback');
    const resultadoDiv = document.getElementById('monitoramento-resultado');

    if (cidadeInput === "") {
        alert("Por favor, digite o nome de uma cidade ou região.");
        return;
    }

    feedbackDiv.classList.remove('hide');
    resultadoDiv.classList.add('hide');

    try {
        // Passo 1: Requisição de Geolocalização (Busca as coordenadas geográficas reais da cidade)
        const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidadeInput)}&count=1&language=pt&format=json`;
        const respostaGeocoding = await fetch(urlGeocoding);
        const dadosGeocoding = await respostaGeocoding.json();

        if (!dadosGeocoding.results || dadosGeocoding.results.length === 0) {
            alert("Cidade não localizada. Verifique a ortografia.");
            feedbackDiv.classList.add('hide');
            return;
        }

        const localizacao = dadosGeocoding.results[0];
        const lat = localizacao.latitude;
        const lon = localizacao.longitude;
        const nomeFormatado = `${localizacao.name}, ${localizacao.admin1 || ''} - Brasil`;

        // Passo 2: Requisição de Dados Meteorológicos em Tempo Real baseados nas coordenadas obtidas
        const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`;
        const respostaWeather = await fetch(urlWeather);
        const dadosWeather = await respostaWeather.json();
        
        const dadosAtuais = dadosWeather.current;

        // Atualização dos dados na interface do usuário
        document.getElementById('clima-cidade').innerText = nomeFormatado;
        document.getElementById('clima-data').innerText = obterDataAtual();
        document.getElementById('clima-temp').innerText = `${dadosAtuais.temperature_2m}°C`;
        document.getElementById('clima-umidade').innerText = `${dadosAtuais.relative_humidity_2m}%`;
        document.getElementById('clima-condicao').innerText = interpretarCodigoClima(dadosAtuais.weather_code);

        feedbackDiv.classList.add('hide');
        resultadoDiv.classList.remove('hide');

        // Passo 3: Inicialização e atualização do Mapa de Satélite Real (Camada Esri World Imagery)
        // É necessário destruir o mapa anterior se o usuário fizer uma nova busca
        if (mapaInstancia !== null) {
            mapaInstancia.remove();
        }

        // Renderiza o mapa focado nas coordenadas da cidade com zoom aproximado para áreas rurais (nível 13)
        mapaInstancia = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Imagens &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, e a Comunidade de Usuários GIS'
        }).addTo(mapaInstancia);

        // Adiciona um marcador técnico no centro da cidade procurada
        L.marker([lat, lon]).addTo(mapaInstancia)
            .bindPopup(`<b>Área de Cobertura:</b><br>${localizacao.name}`)
            .openPopup();

        // Correção de renderização do Leaflet em containers dinâmicos
        setTimeout(() => {
            mapaInstancia.invalidateSize();
        }, 200);

    } catch (error) {
        console.error("Erro no processamento das APIs externas:", error);
        alert("Ocorreu uma falha ao conectar com os servidores de monitoramento. Tente novamente mais tarde.");
        feedbackDiv.classList.add('hide');
    }
}

function verificarPlantio() {
    const mes = document.getElementById('mes-select').value;
    const resultadoDiv = document.getElementById('plantio-resultado');
    const listaCulturas = document.getElementById('lista-culturas');
    
    listaCulturas.innerHTML = "";

    if (mes === "") {
        resultadoDiv.classList.add('hide');
        return;
    }

    const culturasPorMes = {
        janeiro: ["Milho Safrinha", "Soja (ciclo tardio)", "Feijão"],
        fevereiro: ["Milho Safrinha", "Sorgo florestal", "Girassol"],
        marco: ["Trigo (preparo de solo)", "Aveia preta para cobertura", "Nabo forrageiro"],
        abril: ["Trigo", "Cevada cervejeira", "Centeio"],
        maio: ["Trigo", "Aveia branca", "Pastagens de inverno (Azevém)"],
        junho: ["Hortaliças consorciadas", "Manejo de pastagem de inverno"],
        julho: ["Preparo de solo para safra de verão", "Adubação verde pioneira"],
        agosto: ["Plantio antecipado de Milho", "Fumo (transplante)"],
        setembro: ["Soja (abertura de safra)", "Milho Verão", "Feijão das águas"],
        outubro: ["Soja (pico do plantio regional)", "Milho", "Arroz de sequeiro"],
        novembro: ["Soja", "Feijão segunda safra", "Algodão"],
        dezembro: ["Soja (conclusão do plantio)", "Culturas de cobertura pós-colheita precoce"]
    };

    const culturas = culturasPorMes[mes] || ["Consulte as recomendações técnicas locais."];

    culturas.forEach(cultura => {
        const li = document.createElement('li');
        li.innerText = cultura;
        listaCulturas.appendChild(li);
    });

    resultadoDiv.classList.remove('hide');
}

function analisarSolo() {
    const ph = parseFloat(document.getElementById('solo-ph').value);
    const umidade = parseFloat(document.getElementById('solo-umidade').value);
    const resultadoDiv = document.getElementById('solo-resultado');
    const diagnosticoP = document.getElementById('solo-diagnostico');

    if (isNaN(ph) || isNaN(umidade)) {
        alert("Por favor, informe valores válidos para a análise de solo.");
        return;
    }

    let parecerTecnico = "";

    if (ph < 5.5) {
        parecerTecnico += "Solo Ácido. Há necessidade de correção da acidez via calagem (aplicação de calcário) para neutralizar o alumínio tóxico e disponibilizar Fósforo e Cálcio. ";
    } else if (ph >= 5.5 && ph <= 6.5) {
        parecerTecnico += "pH em Faixa Ideal. Disponibilidade química de macronutrientes equilibrada, propícia para o desenvolvimento radicular saudável. ";
    } else {
        parecerTecnico += "Solo Alcalino. Risco de fixação e deficiência de micronutrientes (como Ferro e Manganês). Monitore a condutividade elétrica. ";
    }

    if (umidade < 30) {
        parecerTecnico += "Déficit Hídrico Detectado. Recomenda-se acionar sistemas de irrigação artificial ou priorizar o plantio direto com alta cobertura morta para reter a umidade.";
    } else if (umidade >= 30 && umidade <= 60) {
        parecerTecnico += "Umidade do Solo Adequada. Condições físicas excelentes para atividades mecânicas e absorção de nutrientes.";
    } else {
        parecerTecnico += "Solo Saturado. Risco elevado de anoxia radicular (falta de oxigênio nas raízes). Ev    // Limpa resultados anteriores
    listaCulturas.innerHTML = "";

    if (mes === "") {
        resultadoDiv.classList.add('hide');
        return;
    }

    // Banco de dados interno da lógica de plantio por sazonalidade
    const culturasPorMes = {
        janeiro: ["Milho Safrinha", "Soja (ciclo tardio)", "Feijão"],
        fevereiro: ["Milho Safrinha", "Sorgo", "Girassol"],
        marco: ["Trigo (preparo)", "Aveia preta", "Cobertura de solo"],
        abril: ["Trigo", "Cevada", "Centeio"],
        maio: ["Trigo", "Aveia branca", "Pastagens de inverno"],
        junho: ["Hortaliças de inverno", "Manejo de pastagem"],
        julho: ["Preparo de solo para safra de verão", "Adubação verde"],
        agosto: ["Plantio pioneiro de Milho", "Fumo"],
        setembro: ["Soja (início da safra principal)", "Milho", "Feijão das águas"],
        outubro: ["Soja (pico de plantio)", "Milho", "Arroz irrigado"],
        novembro: ["Soja", "Feijão segunda safra", "Algodão"],
        dezembro: ["Soja (conclusão)", "Feijão", "Culturas de cobertura"]
    };

    const culturas = culturasPorMes[mes] || ["Consulte a secretaria de agricultura para variedades específicas"];

    culturas.forEach(cultura => {
        const li = document.createElement('li');
        li.innerText = cultura;
        listaCulturas.appendChild(li);
    });

    resultadoDiv.classList.remove('hide');
}

// 3. Controle do Módulo de Análise Analítica de Solo
function analisarSolo() {
    const ph = parseFloat(document.getElementById('solo-ph').value);
    const umidade = parseFloat(document.getElementById('solo-umidade').value);
    const resultadoDiv = document.getElementById('solo-resultado');
    const diagnosticoP = document.getElementById('solo-diagnostico');

    if (isNaN(ph) || isNaN(umidade)) {
        alert("Por favor, preencha todos os parâmetros do solo.");
        return;
    }

    let parecerTecnico = "";

    // Lógica algorítmica para diagnóstico de solo
    if (ph < 5.5) {
        parecerTecnico += "Solo Ácido. Recomendamos aplicação de calcário (calagem) para elevar o pH e otimizar a absorção de nutrientes. ";
    } else if (ph >= 5.5 && ph <= 6.5) {
        parecerTecnico += "Faixa de pH Ideal para a maioria das culturas comerciais. Estrutura química equilibrada. ";
    } else {
        parecerTecnico += "Solo Alcalino. Monitore a disponibilidade de micronutrientes, que pode estar retida. ";
    }

    if (umidade < 30) {
        parecerTecnico += "Alerta de Estresse Hídrico Crítico. Acione o sistema de irrigação monitorada ou técnicas de cobertura morta.";
    } else if (umidade >= 30 && umidade <= 60) {
        parecerTecnico += "Teor de Umidade Adequado. Condições excelentes para o desenvolvimento radicular.";
    } else {
        parecerTecnico += "Saturação Hídrica. Risco de hipóxia radicular. Garanta a eficiência dos canais de drenagem.";
    }

    diagnosticoP.innerText = parecerTecnico;
    resultadoDiv.classList.remove('hide');
}

// 4. Controle do Módulo de Simulação de Satélite
function simularSatelite() {
    const resultadoDiv = document.getElementById('satelite-resultado');
    
    // Simula dados de telemetria baseados em sensores espaciais
    document.getElementById('sat-ndvi').innerText = "0.78 (Vegetação densa e saudável)";
    document.getElementById('sat-chuva').innerText = "Ausência de frentes frias extremas nas próximas 72 horas";

    resultadoDiv.classList.remove('hide');
}
