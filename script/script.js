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