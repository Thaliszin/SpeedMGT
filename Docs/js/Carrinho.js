
const precoTotal = document.getElementById("totalCompra");

const obterProdutos =  () => {
    try {
      return JSON.parse(localStorage.getItem("carrinho")); 
    } catch (erro) {
      console.error('Erro ao obter produtos:', erro);
      throw erro; 
    }
  };

const exibirProdutos = (produtos) => {
    const listaProdutos = document.getElementById('lista-produtos-comprados');
  
    produtos.forEach((produto,index) => {
      const divPrincipal = document.createElement('div');
      divPrincipal.className = 'flex w-full justify-between border-b-[1px] border-b-black items-center p-2';
      divPrincipal.innerHTML = `
      <div class="flex w-[70%] justify-beetween items-center">
                <img src="${'img/'+produto.imagem}" class="h-[70px] mr-3 lg:w-[100px] lg:h-[100px]"/>
                <div class="flex flex-col items-center w-[80%]">
                    <div class="w-[100%]">
                        <p class="text-sm lg:text-2xl font-semibold w-[100%]">${produto.nome}</p>
                        <p class="text-sm font-medium">Quantidade: ${produto.quantidade}</p>
                    </div>
                    <div class="flex justify-between w-16">
                        <button onclick="atualizarQuantidade(${index},-1)" id="btnDecrementar" class="bg-[#2F2F2F] md:flex  rounded-full shadow-xl text-white font-[Poppins] flex justify-center items-center px-1 hover:bg-red-600"> - </button>
                        <p class="text-sm ">${produto.quantidade}</p>
                        <button onclick="atualizarQuantidade(${index},1)" id="btnAumentar" class="bg-[#2F2F2F] md:flex  rounded-full shadow-xl text-white font-[Poppins] flex justify-center items-center px-1 hover:bg-red-600"> + </button>
                    </div>
                </div>
            </div>
            <div class="flex items-center">
               <p class="text-sm lg:text-2xl text-[#77B725] font-bold mr-2">R$ ${(produto.preco * produto.quantidade).toFixed(2)}</p>
                 <button onclick="removerProduto(${index})" id="btnRemover" class="bg-[#2F2F2F] md:flex  rounded-full shadow-xl text-white font-[Poppins] flex justify-center items-center px-1 hover:bg-red-600"> X </button>
            
            </div>
      `;
      listaProdutos.appendChild(divPrincipal);
    });
  };



  async function atualizarQuantidade(productId,quantidadeInt) {
    const carrinho = await obterProdutos();
    if (carrinho) {
        const atualizadoCartItems = carrinho.map((item, index) => {
            if (index === productId) {
                if (item.quantidade >=1) {
                    if (quantidadeInt <0 && item.quantidade ==1 ) {
                        return { ...item, quantidade: 1 };    
                    }
                    return { ...item, quantidade: item.quantidade + quantidadeInt };
                 
                }
            
                
            }

            return item;
        });
        console.log(atualizadoCartItems);
        localStorage.setItem('carrinho', JSON.stringify(atualizadoCartItems))
        // precoCarrinho(atualizadoCartItems)
        window.location.reload();
        
    }
}
const precoCarrinho = (carrinho) => {
    let total = 0.00
    {
        carrinho.map((item) => {
            total = total + (parseFloat((item.preco).replace(',', '.')) * parseFloat(item.quantidade))
        })
    };
    precoTotal.textContent = `R$ ${total.toFixed(2)}`
    console.log(total);
}

const removerProduto = async (productId) =>{
    const carrinho = await obterProdutos();
    if (carrinho) {
        let novoCarrinho =[]
        carrinho.forEach((element, index)=> {
            if (index !== productId) {
                novoCarrinho.push(element)
            }
        }); 
            
    
        console.log(novoCarrinho);
        localStorage.setItem('carrinho', JSON.stringify(novoCarrinho))
        window.location.reload();
    }
}
const apagarCarrinho = () =>{
    if (localStorage.getItem('carrinho')) {   
        localStorage.removeItem('carrinho')
        alert("Carrinho apagado!")
        window.location.reload()
    }
    else{

        alert("Você não possui um carrinho ainda!")
    }
}

const fazerPedido= async() =>{
    if (localStorage.getItem('carrinho')) {
        try {
            const response = await axios.post('https://speedmgt-backend.azurewebsites.net/api/v1/pedido/', {
                cliente: 1,
                preco_total: null
            }, {
                headers: {
                    Authorization: `JWT ${JSON.parse(localStorage.getItem('tokens')).access}`
                }
            })

            
            var carrinho = JSON.parse(localStorage.getItem('carrinho'))
            carrinho.forEach(async(element) => {
               try {
                    const responseItens = await axios.post('https://speedmgt-backend.azurewebsites.net/api/v1/itenspedido/', {
                        produto: element.id,
                        quantidade: element.quantidade,
                        precoXquantidade: null,
                        pedido: response.data.id
                    }, {
                        headers: {
                            Authorization: `JWT ${JSON.parse(localStorage.getItem('tokens')).access}`
                        }
                    })
                    
                    localStorage.removeItem('carrinho')
                    alert("Pedido feito!")
                    window.location.reload()
               } catch (error) {
                console.log(error)
               }
            });
        } catch (error) {
            if (error.response.status) {
                if (error.response.status == 401) {
                    alert("usuario não Autenticado!")
                }
            }
        }  
    }
    else{

        alert("Você não possui um carrinho ainda!")
    }
    
}


const main = async () => {
    try {
      const produtos = await obterProdutos();
      console.log(produtos);
      exibirProdutos(produtos);
      precoCarrinho(produtos)
      
    } catch (erro) {
      console.error('Erro no fluxo principal:', erro);
    }
  };
  
  document.addEventListener('DOMContentLoaded', main);
  btnAumentar.addEventListener('click',atualizarQuantidade)
  btnDecrementar.addEventListener('click',atualizarQuantidade)
  btnRemover.addEventListener('click',removerProduto)
  btnApagarCarrinho.addEventListener('click',apagarCarrinho)