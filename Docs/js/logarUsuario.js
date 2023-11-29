const form = document.getElementById('formulario');
const btnLogar = document.getElementById('btnLogar');


async function logarUsuario(event){
    event.preventDefault()
    try {
        const resposta = await axios.post(`https://speedmgt-backend.azurewebsites.net/api/v1/auth/jwt/create/`, {
            email: form.querySelector('#email').value,
            password: form.querySelector('#senha').value
        });
        localStorage.setItem('tokens', JSON.stringify(resposta.data))
        alert("Usuario logado com sucesso!")
        window.location.href = 'produtos.html'
    } catch (error) {
        console.log(error)
    }
}

btnLogar.addEventListener('click', logarUsuario);