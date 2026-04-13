window.addEventListener("scroll", function() {
    const header = document.querySelector(".header");

    if (window.scrollY > 50) {
        header.style.backgroundColor = "#111";
    } else {
        header.style.backgroundColor = "transparent";
    }
});

const botao = document.getElementById("btnOrcamento");

botao.addEventListener("click", function(event) {
    event.preventDefault(); // evita recarregar a página

    alert("Orçamento solicitado com sucesso!");
});