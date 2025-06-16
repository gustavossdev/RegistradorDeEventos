//Função para abrir e fechar Menu
let navbar = document.querySelector('#navbar');
let menu = document.querySelector('#menu-icon');

let close = menu.textContent;
let open = "close";

function toggleMenu(){
    navbar.classList.toggle('open'); 

    if (menu.textContent === close) {
        menu.textContent = open;
    } else{
        menu.textContent = close;
    }
}

//Darkmode

let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
}

if(darkmode === "active") enableDarkmode();

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
})

const rootStyles = getComputedStyle(document.documentElement);
const focusColor = rootStyles.getPropertyValue('--focus').trim();
const borderColor = rootStyles.getPropertyValue('--border').trim();

document.addEventListener('DOMContentLoaded', function() {
    const mural = document.getElementById('mural');
    const addEventBtn = document.getElementById('addEvent').querySelector('button');

    // Função para criar um novo card
    function createCard(title, content, id = null) {
        const cardId = id || `card-${Date.now()}`;
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = cardId;

        // Cria o link para a página do card
        const cardLink = document.createElement('a');
        cardLink.href = `card.html?id=${cardId}`;
        cardLink.className = 'card-link';

        // Conteúdo do card
        cardLink.innerHTML = `
            <h3>${title}</h3>
            <p>${content}</p>
        `;

        // Botão de remoção
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-card';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('Remover este card?')) {
                card.remove();
            }
        });

        card.appendChild(cardLink);
        card.appendChild(removeBtn);
        return card;
    }

    // Função para adicionar novo card
    function addNewCard() {
        const title = prompt('Título do card:');
        if (!title) return;
        
        const content = prompt('Conteúdo do card:');
        if (!content) return;

        const card = createCard(title, content);
        mural.appendChild(card);
        
        // Salva no localStorage
        saveCardToStorage(card.dataset.id, title, content);
    }

    // Função para salvar no localStorage
    function saveCardToStorage(id, title, content) {
        const cards = JSON.parse(localStorage.getItem('cards')) || {};
        cards[id] = { title, content };
        localStorage.setItem('cards', JSON.stringify(cards));
    }

    // Evento do botão
    addEventBtn.addEventListener('click', addNewCard);

    // Carrega cards existentes
    function loadCards() {
        const cards = JSON.parse(localStorage.getItem('cards')) || {};
        Object.entries(cards).forEach(([id, cardData]) => {
            mural.appendChild(createCard(cardData.title, cardData.content, id));
        });
    }

    loadCards();
});