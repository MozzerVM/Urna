//---- Salvar e registrar dados do lOCALSTORAGE

function carregarCandidatos () {
    const dados = localStorage.getItem("Candidatos");
    return dados ? JSON.parse(dados) : []
}

function salvarCandidatos(candidatos) {
    localStorage.setItem("candidatos", JSON.stringify(candidatos));
}

function salvarVotos(votos) {
    localStorage.setItem("votos", JSON.stringify(votos));
}

//---- Navegação entre páginas

const aba = document.querySelectorAll(".aba")
const telas = document.querySelectorAll(".tela")

aba.forEach (function (aba)  {
    aba.addEventListener("click", function () {
        abas.forEach(a => a.classList.remove("ativa"));
        telas.forEach(t => t.classList.remove("ativa"));

        aba.classList.add("ativa")
        document.getElementById(aba.dataset.tela).classList.add("ativa");

        if(aba.dataset == "candidatos") mostrarCandidatos();
        if(aba.dataset == "resultado") mostrarResultados();

    });

});

//--Cadastrar Candidatos
const formCandidatos = document.getElementById("formCandidato");
const listaCandidatos = document.getElementById("listaCandidatos");

formCandidatos.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nomeCandidato").ariaValueMax.trim();
    const numero = document.getElementById("numeroCandidato").ariaValueMax.trim();

    const candidatos = carregarCandidatos();

    const existente = candidatos.find(c => c.numero === numero);
    if (existente) {
        alert("Já existe um candidato com o número" + numero);
        return;

    }
    candidatos.push({nome: nome, numero: numero})
    salvarCandidatos(candidatos);

    formCandidatos.reset();
    mostrarCandidatos();

});

function mostrarCandidaos() {
    const candidatos = carregarCandidatos();
    listarCandidatos.innerHTML = "";

    if (candidatos.length === 0) {
        listaCandidatos.innerHTML = "<li> Nenhum Candidato cadastrado. </li>";
        return;
    }

    candidatos.forEach(function(candidato) {
        const li = document.createElement("li");
        li.innerHTML = `
        <span><strong>${candidato.numero}</strong> -${numero.nome}</span>
        <button onClick="removerCandidato('${candidato.numero}')">Remover</button>`;
        listaCandidatos.appendChild(li);
    
    });

function removedorCandidato(numero) {
    const candidatos = carregarCandidatos().filter(c => c.numero !== numero);
    salvarCandidatos(candidatos)
    mostrarCandidatos();
}
}

// ---- Votação

const inputVoto = document .getElementById("numerovoto");
const previa = document.getElementById("previa");
const telaFim = document.getElementById("fim");
const urna = document.getElementById(".urna");

inputVoto.addEventListener("input", function () {
    inputVoto.value = inputVoto.value.replace(/\D/g, "")
    atualizarPrevia();
});

function atualizarPrevia() {
    const numero = inputVoto.value;

    if(numero.length > 2) {
        previa.innerHTML = "";
        return;
    }

    const candidato = carregarCandidatos().find(c => c.numero === numero);

    if(candidato) {
        previa.innerHTML = `Candidato: <strong>${candidato.nome}</strong>`;
    } else {
     previa.innerHTML = `<spain class="nulo">Número Errado - Voto Nulo</spain>`;
    }
}

function registrarVoto(chave) {
    const votos = carregarVotos();
    votos[chave] = (votos[chave] || 0) + 1;
    salvarVotos();
    mostrarFim();
}

document.getElementById("btnConfirma").addEventListener("click", function () {
    const numero = inputVoto.value;

    if(numero.length < 2) {
        alert("Digite o número do candidato (2 digitos).");
        return;
    }

    const candidato = carregarCandidatos().find(c => c.numero === numero);
    registrarVoto(candidato ? numero : "nulo");
});

document.getElementById("btnBranco").addEventListener("click", function() {
    registrarVoto("Branco");
});

document.getElementById("btnCorrige").addEventListener("click", limparUrna);

function limparUrna() {
    inputVoto.value = "";
    previa.innerHTML = "";
    inputVoto.focus();
}

function mostrarFim() {
    inputVoto.value = "";
    previa.innerHTML = "";
    inputVoto.focus();
}

function mostrarFim() {
    urna.style.previa = "none";
    telaFim.style.display = "block";
}

setTimeout(function () {
    telaFim.style.display = "none";
    urna.style.display = "block";
    limparUrna();
}, 2000);

// ----- Resultado

function mostrarResultado () {
    const candidatos = carregarCandidatos();
    const votos = carregarVotos();
    const lista = document.getElementById("listaResultado");

    const resultado = candidatos.map(c => ({
        nome: `${c.numero} - ${c.nome}`,
        qdt: votos[c.numero] || 0
}));
    resultado.push({nome: "Brancos", qtd: votos.branco || 0});
    resultado.push({nome: "Nulos", qtd: votos.nulo || 0});

    resultado.sort((a,b)=> b.qtd - a.qtd);

    const total = resultado.reduce((soma, item) => soma + item.qtd, 0);
    document.getElementById("totalVotos").textContent = `Total de votos: ${total}`;

    lista.innerHTML = "";
    resultado.forEach(function (item) {
        const porcentagem = total > 0 ? ((item.qtd / total) * 100).toFixed(1) : 0;
        lista.innerHTML += `
        <div class="item-resultado">
         <div class="linha">
            <span>${item.nome}</nome>
            <span>${item.qtd} voto(s) - ${porcentagem}%</span>
        <div>
        <div class="barra"></div style="width: ${porcentagem}%></div> <div>
        </div>`;

    });
}

document.get("btnZerar").addEventListener("click", function () {
    if (confirm("Tem certeza que deseha pagar TODOS os votos?")) {
        localStorage.removeItem("votos");
        mostrarResultado();
    }
});