// Função auxiliar para formatar a data atual em 2026
function obterDataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const mesTextual = meses[data.getMonth()];
    // Força o ano do projeto para o contexto de 2026
    return `${dia} de ${mesTextual} de 2026`;
}

// 1. Controle do Módulo de Clima
function buscarClima() {
    const cidadeInput = document.getElementById('city-input').value.trim();
    const resultadoDiv = document.getElementById('clima-resultado');
    
    if (cidadeInput === "") {
        alert("Por favor, informe a região para prosseguir.");
        return;
    }

    // Simulação de banco de dados climático baseado no contexto paranaense
    document.getElementById('clima-cidade').innerText = `Região de ${cidadeInput}`;
    document.getElementById('clima-data').innerText = obterDataAtual();
    document.getElementById('clima-temp').innerText = "24°C";
    document.getElementById('clima-condicao').innerText = "Ensolarado com poucas nuvens - Ideal para tratos culturais";
    document.getElementById('clima-umidade').innerText = "65%";

    resultadoDiv.classList.remove('hide');
}

// 2. Controle do Módulo de Calendário de Plantio
function verificarPlantio() {
    const mes = document.getElementById('mes-select').value;
    const resultadoDiv = document.getElementById('plantio-resultado');
    const listaCulturas = document.getElementById('lista-culturas');
    
    // Limpa resultados anteriores
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
