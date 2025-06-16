const addimg = document.getElementsByClassName('addimg')[0];

// Salva caixas de imagem no localStorage
function salvarCaixasImagemLocalStorage() {
    const caixas_img = [...document.querySelectorAll('.resizableContainer.imageBox')].map((box_img) => {
        const img = box_img.querySelector("img");
        return { 
            id: box_img.dataset.id,
            src: img?.src || null,
            top: box_img.style.top,
            left: box_img.style.left,
            width: box_img.style.width,
            height: box_img.style.height
        };
    });
    localStorage.setItem("caixasImagem", JSON.stringify(caixas_img));
}

// Carrega caixas de imagem do localStorage
function carregarCaixasImagemLocalStorage() {
    const data_img = localStorage.getItem("caixasImagem");
    if (!data_img) return;
    const caixas_img = JSON.parse(data_img);
    caixas_img.forEach(caixa_img => criarCaixaImagem_img(caixa_img));
}

// Cria uma nova caixa de imagem
function criarCaixaImagem_img(data_img = {}) {
    const box_img = document.createElement("div");
    box_img.className = "resizableContainer";
    box_img.classList.add("imageBox");
    const uniqueId_img = data_img.id || `caixa-${Date.now()}`;
    box_img.dataset.id = uniqueId_img;

    const resizeObserver = new ResizeObserver(() => {
        salvarCaixasImagemLocalStorage(); // Salva no localStorage
    });
    resizeObserver.observe(box_img);

    // Estilo inicial
    box_img.style.width = data_img.width || "200px"; // Largura padrão se não existir
    box_img.style.height = data_img.height || "100px"; // Altura padrão se não existir
    box_img.style.top = data_img.top || "100px";
    box_img.style.left = data_img.left || "100px";

    const inputId_img = `upload-${uniqueId_img}`;
    const input_img = document.createElement("input");
    input_img.type = "file";
    input_img.accept = "image/*";
    input_img.id = inputId_img;
    input_img.style.display = "none";

    const label_img = document.createElement("label");
    label_img.className = "label";
    label_img.setAttribute("for", inputId_img);
    label_img.textContent = "Selecionar Imagem";

    const imgPreview = document.createElement("img");
    imgPreview.style.display = data_img.src ? "block" : "none";
    if (data_img.src) {
        imgPreview.src = data_img.src;
        label_img.style.display = "none"; // Oculta o label se a imagem já estiver carregada
    }

    const remove_img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    remove_img.setAttribute("height", "24px");
    remove_img.setAttribute("viewBox", "0 -960 960 960");
    remove_img.setAttribute("width", "24px");
    remove_img.setAttribute("fill", "var(--svg)");
    remove_img.setAttribute("id", "remove");
    const removePath_img = document.createElementNS("http://www.w3.org/2000/svg", "path");
    removePath_img.setAttribute("d", "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z");
    remove_img.appendChild(removePath_img);

    const edit_img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    edit_img.setAttribute("height", "24px");
    edit_img.setAttribute("viewBox", "0 -960 960 960");
    edit_img.setAttribute("width", "24px");
    edit_img.setAttribute("fill", "var(--svg)");
    edit_img.setAttribute("id", "edit");
    const editPath_img = document.createElementNS("http://www.w3.org/2000/svg", "path");
    editPath_img.setAttribute("d", "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z");
    edit_img.appendChild(editPath_img);

    const handle_img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    handle_img.setAttribute("width", "24");
    handle_img.setAttribute("height", "24");
    handle_img.setAttribute("viewBox", "0 0 24 24");
    handle_img.setAttribute("fill", "none");
    handle_img.setAttribute("stroke", "var(--svg)");
    handle_img.setAttribute("stroke-width", "2");
    handle_img.setAttribute("stroke-linecap", "round");
    handle_img.setAttribute("stroke-linejoin", "round");
    handle_img.setAttribute("id", "resizableBoxMove");
    const handlePath_img = document.createElementNS("http://www.w3.org/2000/svg", "path");
    handlePath_img.setAttribute("d", "M5.2 9l-3 3 3 3M9 5.2l3-3 3 3M15 18.9l-3 3-3-3M18.9 9l3 3-3 3M3.3 12h17.4M12 3.2v17.6");
    handle_img.appendChild(handlePath_img);

    input_img.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imgPreview.src = event.target.result;
                imgPreview.style.display = "block";
                label_img.style.display = "none";
                salvarCaixasImagemLocalStorage();
            };
            reader.readAsDataURL(file);
        }
    });

    remove_img.addEventListener("click", () => {
        resizeObserver.unobserve(box_img);
        box_img.remove();
        salvarCaixasImagemLocalStorage();
    });

    const focusColor = '#ff0000';
    
    const rootStyles = getComputedStyle(document.documentElement);
    const borderColor = rootStyles.getPropertyValue('--background-color').trim();

    let resizeAtivo_img = false;

    edit_img.addEventListener("click", () => {
    resizeAtivo_img = !resizeAtivo_img;
    
    // Ativa/desativa resize e overflow
    box_img.style.resize = resizeAtivo_img ? "both" : "none";
    box_img.style.overflow = resizeAtivo_img ? "auto" : "visible";
    
    // Torna o icone para mover a caixa invisivel caso o resize esteja ativo
    handle_img.style.display = resizeAtivo_img ? "none" : "flex";
    
    // Muda a cor da borda conforme o estado
    box_img.style.border = resizeAtivo_img 
        ? `2px solid ${focusColor}`          // Modo edição (destaque)
        : `2px solid var(--border)`; // Volta ao padrão CSS
      
    salvarCaixasTextoLocalStorage();
});

    let isDragging_img = false, offsetX_img, offsetY_img;

    handle_img.addEventListener('mousedown', function (e) {
        isDragging_img = true;
        const rect = box_img.getBoundingClientRect();
        offsetX_img = e.clientX - rect.left;
        offsetY_img = e.clientY - rect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging_img) return;
        const muralRect = mural.getBoundingClientRect();
        const boxRect_img = box_img.getBoundingClientRect();
        let x = e.clientX - offsetX_img;
        let y = e.clientY - offsetY_img;
        x = Math.max(muralRect.left, Math.min(x, muralRect.right - boxRect_img.width));
        y = Math.max(muralRect.top, Math.min(y, muralRect.bottom - boxRect_img.height));
        box_img.style.left = (x - muralRect.left) + 'px';
        box_img.style.top = (y - muralRect.top) + 'px';
        box_img.style.position = 'absolute';
    });

    document.addEventListener('mouseup', function () {
        if (isDragging_img) {
            isDragging_img = false;
            salvarCaixasImagemLocalStorage();
        }
    });

    box_img.appendChild(input_img);
    box_img.appendChild(label_img);
    box_img.appendChild(imgPreview);
    box_img.appendChild(remove_img);
    box_img.appendChild(edit_img);
    box_img.appendChild(handle_img);
    mural.appendChild(box_img);
}

// Botão de adicionar imagem
addimg.addEventListener("click", () => {
    criarCaixaImagem_img(); // nova caixa de imagem
    salvarCaixasImagemLocalStorage();
});
 
// Ao carregar a página
window.addEventListener("DOMContentLoaded", carregarCaixasImagemLocalStorage);
