// Scroll suave para âncoras da nav interna
document.querySelectorAll('.sol-nav-item').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 140; // altura do header + nav
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Destaca item ativo na nav ao rolar
const secoes = document.querySelectorAll('.sol-secao');
const navItems = document.querySelectorAll('.sol-nav-item');

window.addEventListener('scroll', () => {
  let atual = '';
  secoes.forEach(secao => {
    if (window.scrollY >= secao.offsetTop - 200) {
      atual = secao.getAttribute('id');
    }
  });
  navItems.forEach(item => {
    item.style.color = item.getAttribute('href') === `#${atual}` ? '#2ec4b6' : '';
    item.style.borderBottomColor = item.getAttribute('href') === `#${atual}` ? '#2ec4b6' : 'transparent';
  });
});