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