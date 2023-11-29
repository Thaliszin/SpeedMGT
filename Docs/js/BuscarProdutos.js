
const apiUrl = 'https://speedmgt-backend.azurewebsites.net/api/v1/produto/';
const btnComprar = document.getElementById("btnComprar");


const obterProdutos = async () => {
    try {
      const resposta = await axios.get(apiUrl);
      console.log(resposta.data);
      return resposta.data; 
    } catch (erro) {
      console.error('Erro ao obter produtos:', erro);
      throw erro; 
    }
};


const exibirProdutos = (produtos) => {
  const listaProdutos = document.getElementById('lista-produtos');

  produtos.forEach((produto,index) => {
    const divPrincipal = document.createElement('div');
    divPrincipal.className = 'w-[200px] h-[350px] rounded-3xl bg-[#1E2833] flex flex-col items-center pt-4 m-10';
    divPrincipal.innerHTML = `
    <img src="${'img/'+produto.Foto}" class="w-[150px] h-[180px] rounded-lg" alt="">
    <div class="text-center text-white h-[40%] flex flex-col justify-around items-center">
        <p class="text-xs font-[Kadwa]">${produto.Nome}</p>
        <h2 class="text-2xl text-[#77B725] font-bold">R$ ${produto.Preco}</h2>
        <button onclick="comprar(${index})" id="btnComprar" class="w-[130px] h-[40px] bg-[#448F3E] rounded-3xl shadow-xl">Comprar</button>
    </div>
    `;
    listaProdutos.appendChild(divPrincipal);
  });
};

async function comprar(produtoIndex) {
  var carrinho = [];  
  let produtos = await obterProdutos();
  const produto = {
    id: produtos[produtoIndex].id,
    nome: produtos[produtoIndex].Nome,
    preco: produtos[produtoIndex].Preco,
    imagem: produtos[produtoIndex].Foto,
    quantidade: 1
  };

  if (localStorage.getItem("carrinho")) {
    carrinho = JSON.parse(localStorage.getItem("carrinho"));

    let produtoExistente = false;
    for (let i = 0; i < carrinho.length; i++) {
      if (carrinho[i].nome == produto.nome) {
        carrinho[i].quantidade++;
        produtoExistente = true;
        break;
      }
    }

    if (!produtoExistente) {
      carrinho.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Item adicionado ao carrinho")
  } else {
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Item adicionado ao carrinho")
  }
}


const main = async () => {
  try {
    const produtos = await obterProdutos();
    console.log(produtos);
    exibirProdutos(produtos);
  } catch (erro) {
    console.error('Erro no fluxo principal:', erro);
  }
};

document.addEventListener('DOMContentLoaded', main);
btnComprar.addEventListener('click',comprar)