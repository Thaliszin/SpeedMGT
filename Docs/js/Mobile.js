const btnMobile = document.getElementById('mobile');
const topic = document.getElementById('topic');

function toggleMenu(){
    btnMobile.classList.toggle('active');
    topic.classList.toggle('active');

}

btnMobile.addEventListener('click', toggleMenu);