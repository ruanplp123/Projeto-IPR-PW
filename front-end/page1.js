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

// ===== APLICAÇÕES =====
const aplicacoesData = [
  {
    num: '01',
    img: 'Imagens/geracao-transmissao.jpg',
    tags: ['Elétrico', 'Estrutural', 'Isolamento'],
    titulo: 'Geração e Transmissão',
    desc: 'Soluções robustas para redes de alta tensão, subestações e sistemas de transmissão de energia elétrica com máxima eficiência.'
  },
  {
    num: '02',
    img: 'Imagens/saneamento.jpg',
    tags: ['Hidráulico', 'Tratamento', 'Distribuição'],
    titulo: 'Saneamento',
    desc: 'Soluções para infraestrutura e tratamento de água com alta durabilidade.'
  },
  {
    num: '03',
    img: 'Imagens/transformadores.jpg',
    tags: ['Alta Tensão', 'Isolação'],
    titulo: 'Transformadores',
    desc: 'Peças de alto desempenho para transformadores com qualidade comprovada.'
  }
];

let aplicAtivo = 0;

function trocarCardPrincipal(idx) {
  aplicAtivo = idx;
  const d = aplicacoesData[idx];
  const cp = document.querySelector('.aplic-card--principal');

  cp.querySelector('img').src = d.img;
  cp.querySelector('.aplic-numero').textContent = d.num;
  cp.querySelector('.aplic-info h3').textContent = d.titulo;
  cp.querySelector('.aplic-info p').textContent = d.desc;
  cp.querySelector('.aplic-tags').innerHTML = d.tags.map(t =>
    `<span class="aplic-tag">${t}</span>`).join('');
}

function navegarAplic(dir) {
  aplicAtivo = (aplicAtivo + dir + aplicacoesData.length) % aplicacoesData.length;
  trocarCardPrincipal(aplicAtivo);
}