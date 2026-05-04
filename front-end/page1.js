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

const botao2 = document.getElementById("btnOrcamento");
botao.addEventListener("click", function() {
    window.location.href = "orcamento.html"; // Redireciona para a nova página
});
// carrossel daqui pra baixo
document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector('.container-cards');
    let cards = document.querySelectorAll('.card');

    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');

    const gap = 30;
    const visibleCards = 3;
    let index = visibleCards;

    // CLONES
    for (let i = 0; i < visibleCards; i++) {
        const firstClone = cards[i].cloneNode(true);
        const lastClone = cards[cards.length - 1 - i].cloneNode(true);

        container.appendChild(firstClone);
        container.insertBefore(lastClone, container.firstChild);
    }

    cards = document.querySelectorAll('.card');

    const cardWidth = cards[0].offsetWidth + gap;

    container.style.transform = `translateX(-${cardWidth * index}px)`;

    next.addEventListener('click', () => {
        index++;
        container.style.transition = "0.5s";
        container.style.transform = `translateX(-${cardWidth * index}px)`;
    });

    prev.addEventListener('click', () => {
        index--;
        container.style.transition = "0.5s";
        container.style.transform = `translateX(-${cardWidth * index}px)`;
    });

    container.addEventListener('transitionend', () => {
        if (index >= cards.length - visibleCards) {
            container.style.transition = "none";
            index = visibleCards;
            container.style.transform = `translateX(-${cardWidth * index}px)`;
        }

        if (index <= 0) {
            container.style.transition = "none";
            index = cards.length - (visibleCards * 2);
            container.style.transform = `translateX(-${cardWidth * index}px)`;
        }
    });

});