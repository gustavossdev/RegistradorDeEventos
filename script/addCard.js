document.addEventListener('DOMContentLoaded', function() {
    // Constantes
    const STORAGE_KEY = 'savedCards';
    const cardsContainer = document.getElementById('cardsContainer');
    const addCardBtn = document.getElementById('addCardBtn');

    // Função para criar o ícone SVG de remoção
    function createRemoveIcon() {
        const removeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        removeIcon.setAttribute("height", "24px");
        removeIcon.setAttribute("viewBox", "0 -960 960 960");
        removeIcon.setAttribute("width", "24px");
        removeIcon.setAttribute("fill", "var(--svg)");
        removeIcon.classList.add('remove-icon');
        
        const removePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        removePath.setAttribute("d", "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z");
        
        removeIcon.appendChild(removePath);
        return removeIcon;
    }

    // Função para criar um novo card
    function createCard(title = 'Novo Card', description = 'Clique para editar...', id = null, imageUrl = null) {
        const cardId = id || `card-${Date.now()}`;
        const card = document.createElement('div');
        card.className = 'editCard';
        card.dataset.id = cardId;
        
        // Cria o container do botão de remoção
        const removeWrapper = document.createElement('div');
        removeWrapper.className = 'remove-wrapper';
        
        const removeBtn = createRemoveIcon();
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('Deseja realmente remover este card?')) {
                card.remove();
                saveCardsToStorage();
            }
        });
        
        removeWrapper.appendChild(removeBtn);
        card.appendChild(removeWrapper);

        // Cria o ícone de edição (fundo) ou a imagem
        const cardImgContainer = document.createElement('div');
        cardImgContainer.className = 'editCard-img-container';
        
        if (imageUrl) {
            // Se há imagem, cria elemento img
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = title;
            imgElement.className = 'card-image';
            cardImgContainer.appendChild(imgElement);
        } else {
            // Se não há imagem, cria o SVG de edição
            const cardImg = document.createElement('span');
            cardImg.className = 'editCard-img';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '24px');
            svg.setAttribute('viewBox', '0 -960 960 960');
            svg.setAttribute('width', '24px');
            svg.setAttribute('fill', 'var(--svg)');
            svg.classList.add('edit-icon');
            svg.style.cursor = 'pointer';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z');
            
            svg.appendChild(path);
            cardImg.appendChild(svg);
            cardImgContainer.appendChild(cardImg);

            // Adiciona evento para upload de imagem
            svg.addEventListener('click', function(e) {
                e.stopPropagation();
                openImageUploadDialog(card, cardImgContainer);
            });
        }
        
        card.appendChild(cardImgContainer);

        // Cria o conteúdo do card
        const cardContent = document.createElement('div');
        cardContent.className = 'editCard-content';
        
        // Cria o título
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.contentEditable = true;
        
        // Cria a descrição
        const descElement = document.createElement('p');
        descElement.textContent = description;
        descElement.contentEditable = true;
        
        // Configura o salvamento automático
        const saveOnEdit = debounce(saveCardsToStorage, 500);
        titleElement.addEventListener('input', saveOnEdit);
        descElement.addEventListener('input', saveOnEdit);
        
        cardContent.appendChild(titleElement);
        cardContent.appendChild(descElement);
        card.appendChild(cardContent);
        
        return card;
    }

    // Função para abrir dialog de upload de imagem
    function openImageUploadDialog(card, imgContainer) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Remove o conteúdo atual do container
                    imgContainer.innerHTML = '';
                    
                    // Cria a nova imagem
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    imgElement.className = 'card-image';
                    imgElement.alt = 'Imagem do card';
                    
                    imgContainer.appendChild(imgElement);
                    
                    // Atualiza o localStorage
                    saveCardsToStorage();
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    // Função debounce para otimizar o salvamento
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Salva todos os cards no localStorage
    function saveCardsToStorage() {
        const cards = Array.from(document.querySelectorAll('.editCard')).map(card => {
            const imgElement = card.querySelector('.card-image');
            return {
                id: card.dataset.id,
                title: card.querySelector('h3').textContent,
                description: card.querySelector('p').textContent,
                imageUrl: imgElement ? imgElement.src : null
            };
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }

    // Carrega os cards do localStorage
    function loadCardsFromStorage() {
        const savedCards = localStorage.getItem(STORAGE_KEY);
        if (savedCards) {
            try {
                const cardsData = JSON.parse(savedCards);
                cardsData.forEach(cardData => {
                    const card = createCard(
                        cardData.title, 
                        cardData.description, 
                        cardData.id, 
                        cardData.imageUrl
                    );
                    cardsContainer.appendChild(card);
                });
            } catch (e) {
                console.error('Erro ao carregar cards:', e);
            }
        }
    }

    // Evento para adicionar novo card
    addCardBtn.addEventListener('click', () => {
        const card = createCard();
        cardsContainer.appendChild(card);
        card.scrollIntoView({ behavior: 'smooth' });
        saveCardsToStorage();
    });

    // Carrega os cards ao iniciar
    loadCardsFromStorage();

    // Salva quando a página for fechada
    window.addEventListener('beforeunload', saveCardsToStorage);
});