const form = document.getElementById('formulario');
const btnCadastrar = document.getElementById('btnCadastrar');
const cepInput = form.querySelector('#cep');

cepInput.addEventListener('input', function () {
    if (this.value.length === 8) {
        // Chamar a função quando tiver 8 dígitos
        coletarInformacoesCep(this.value);
    } 
});

async function coletarInformacoesCep(cep) {
    try {
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        form.querySelector('#Logradouro').value = resposta.data.logradouro;
        form.querySelector('#Bairro').value = resposta.data.bairro;
        form.querySelector('#Cidade').value = resposta.data.localidade;
        form.querySelector('#UF').value = resposta.data.uf;
    } catch (erro) {
        console.error('Erro ao obter informações do CEP:', erro);
    }
}

async function cadastrar(event) {
  event.preventDefault()
  try {
    const resposta = await axios.post('https://speedmgt-backend.azurewebsites.net/api/v1/auth/users/',{
      username: form.querySelector('#nome').value,
      Logradouro: form.querySelector('#Logradouro').value,
      Numero: form.querySelector('#Numero').value,
        CEP: form.querySelector('#cep').value,
        Cidade: form.querySelector('#Cidade').value,
        UF: form.querySelector('#UF').value,
        Bairro: form.querySelector('#Bairro').value,
        DataNasc: form.querySelector('#dataNascimento').value,
        email: form.querySelector('#email').value,
        password: form.querySelector('#senha').value
        
      });
      alert("Cadastro com sucesso!")
      window.location.href = 'login.html'
      
    } catch (error) {
      for(const erro in error.response.data){
        alert(erro+": "+ error.response.data[erro])
      }
    }
  
}


btnCadastrar.addEventListener('click', cadastrar);