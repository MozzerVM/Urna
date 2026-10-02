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