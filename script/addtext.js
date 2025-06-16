const addtext = document.getElementsByClassName('addtext')[0];
const mural = document.getElementById('mural');

// Salva caixas de texto no localStorage 
function salvarCaixasTextoLocalStorage() {
    const caixas_txt = [...document.querySelectorAll('.resizableContainer.textBox')].map((box_txt) => {
        const texto = box_txt.querySelector(".resizableBox").textContent;
        return {
            id: box_txt.dataset.id,
            texto: texto,
            top: box_txt.style.top,
            left: box_txt.style.left,
            width: box_txt.style.width,
            height: box_txt.style.height
        };
    });
    localStorage.setItem("caixasTexto", JSON.stringify(caixas_txt));
}

// Carrega caixas de texto do localStorage
function carregarCaixasTextoLocalStorage() {
    const data_txt = localStorage.getItem("caixasTexto");
    if (!data_txt) return;
    const caixas_txt = JSON.parse(data_txt);
    caixas_txt.forEach(caixa_txt => criarCaixaTexto_text(caixa_txt));
}

// Cria uma nova caixa de texto
function criarCaixaTexto_text(data_txt = {}) {
    const box_txt = document.createElement("div");
    box_txt.className = "resizableContainer";
    box_txt.classList.add("textBox");
    const uniqueId_txt = data_txt.id || `caixa-${Date.now()}`;
    box_txt.dataset.id = uniqueId_txt;

    // Observa mudanças no tamanho da caixa
    const resizeObserver = new ResizeObserver(() => {
        salvarCaixasTextoLocalStorage(); // Salva no localStorage
    });
    resizeObserver.observe(box_txt);

    box_txt.style.width = data_txt.width || "150px";  // Largura padrão
    box_txt.style.height = data_txt.height || "120px"; // Altura padrão
    box_txt.style.top = data_txt.top || "0px";
    box_txt.style.left = data_txt.left || "0px";

    const resizableBox = document.createElement("p");
    resizableBox.className = "resizableBox";
    resizableBox.textContent = data_txt.texto || "Escreva aqui";
    resizableBox.setAttribute("contenteditable", "false");

    const remove_txt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    remove_txt.setAttribute("height", "24px");
    remove_txt.setAttribute("viewBox", "0 -960 960 960");
    remove_txt.setAttribute("width", "24px");
    remove_txt.setAttribute("fill", "var(--svg)");
    remove_txt.setAttribute("id", "remove");
    const removePath_txt = document.createElementNS("http://www.w3.org/2000/svg", "path");
    removePath_txt.setAttribute("d", "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z");
    remove_txt.appendChild(removePath_txt);

    const edit_txt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    edit_txt.setAttribute("height", "24px");
    edit_txt.setAttribute("viewBox", "0 -960 960 960");
    edit_txt.setAttribute("width", "24px");
    edit_txt.setAttribute("fill", "var(--svg)");
    edit_txt.setAttribute("id", "edit");
    const editPath_txt = document.createElementNS("http://www.w3.org/2000/svg", "path");
    editPath_txt.setAttribute("d", "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z");
    edit_txt.appendChild(editPath_txt);

    const handle_txt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    handle_txt.setAttribute("width", "24");
    handle_txt.setAttribute("height", "24");
    handle_txt.setAttribute("viewBox", "0 0 24 24");
    handle_txt.setAttribute("fill", "none");
    handle_txt.setAttribute("stroke", "var(--svg)");
    handle_txt.setAttribute("stroke-width", "2");
    handle_txt.setAttribute("stroke-linecap", "round");
    handle_txt.setAttribute("stroke-linejoin", "round");
    handle_txt.setAttribute("id", "resizableBoxMove");
    const handlePath_txt = document.createElementNS("http://www.w3.org/2000/svg", "path");
    handlePath_txt.setAttribute("d", "M5.2 9l-3 3 3 3M9 5.2l3-3 3 3M15 18.9l-3 3-3-3M18.9 9l3 3-3 3M3.3 12h17.4M12 3.2v17.6");
    handle_txt.appendChild(handlePath_txt);

    remove_txt.addEventListener("click", () => {
        resizeObserver.unobserve(box_txt);
        box_txt.remove();
        salvarCaixasTextoLocalStorage();
    });

    const focusColor = '#ff0000';
    
    const rootStyles = getComputedStyle(document.documentElement);
    const borderColor = rootStyles.getPropertyValue('--background-color').trim();

    let resizeAtivo_txt = false;
    let editAtivo_txt = false;

    edit_txt.addEventListener("click", () => {
    resizeAtivo_txt = !resizeAtivo_txt;

    editAtivo_txt = resizeAtivo_txt;

    //Ativa/desativa o contenteditable
    resizableBox.setAttribute("contenteditable", editAtivo_txt ? "true" : "false");
    
    // Ativa/desativa resize e overflow
    box_txt.style.resize = resizeAtivo_txt ? "both" : "none";
    box_txt.style.overflow = resizeAtivo_txt ? "auto" : "visible";
    
    // Torna o icone para mover a caixa invisivel caso o resize esteja ativo
    handle_txt.style.display = resizeAtivo_txt ? "none" : "flex";
    
    // Muda a cor da borda conforme o estado
    box_txt.style.border = resizeAtivo_txt 
        ? `2px solid ${focusColor}`    // Modo edição (destaque)
        : `2px solid var(--border)`; // Volta ao padrão CSS
      
    salvarCaixasTextoLocalStorage();
});

    let isDragging_txt = false, offsetX_txt, offsetY_txt;

    handle_txt.addEventListener('mousedown', function (e) {
        isDragging_txt = true;
        const rect = box_txt.getBoundingClientRect();
        offsetX_txt = e.clientX - rect.left;
        offsetY_txt = e.clientY - rect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging_txt) return;
        const muralRect = mural.getBoundingClientRect();
        const boxRect_txt = box_txt.getBoundingClientRect();
        let x = e.clientX - offsetX_txt;
        let y = e.clientY - offsetY_txt;
        x = Math.max(muralRect.left, Math.min(x, muralRect.right - boxRect_txt.width));
        y = Math.max(muralRect.top, Math.min(y, muralRect.bottom - boxRect_txt.height));
        box_txt.style.left = (x - muralRect.left) + 'px';
        box_txt.style.top = (y - muralRect.top) + 'px';
        box_txt.style.position = 'absolute';
    });

    document.addEventListener('mouseup', function () {
        if (isDragging_txt) {
            isDragging_txt = false;
            salvarCaixasTextoLocalStorage();
        }
    });

    resizableBox.addEventListener("input", salvarCaixasTextoLocalStorage);

    box_txt.appendChild(resizableBox);
    box_txt.appendChild(remove_txt);
    box_txt.appendChild(edit_txt);
    box_txt.appendChild(handle_txt);
    mural.appendChild(box_txt);
}

// Botão de adicionar texto
addtext.addEventListener("click", () => {
    criarCaixaTexto_text(); // nova caixa de texto
    salvarCaixasTextoLocalStorage();
});
 
// Ao carregar a página
window.addEventListener("DOMContentLoaded", carregarCaixasTextoLocalStorage);
