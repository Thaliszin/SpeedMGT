
const apiUrl = "https://speedmgt-backend.azurewebsites.net/api/v1/pedido/";

async function atualizar_pagamento(parametro, id) {
  if (parametro == '') {
    alert('Selecione uma Opção!')
  } else {
    try {
      const response = await axios.patch(apiUrl+id+"/", {metodo: parametro}, {
        headers: {
          Authorization: `JWT ${JSON.parse(localStorage.getItem('tokens')).access}`
        }
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  window.location.reload()
}

function editarPagamento(id) {
  const metodo_pagamento = document.getElementById('metodo_pagamento')

  var comboBox = document.createElement('select')

  let vazio = document.createElement('option')
  vazio.value = ''
  vazio.text = ''
  comboBox.add(vazio)

  let pix = document.createElement('option')
  pix.value = 'P'
  pix.text = 'Pix'
  comboBox.add(pix)

  let boleto = document.createElement('option')
  boleto.value = 'B'
  boleto.text = 'Boleto'
  comboBox.add(boleto)

  let cartao = document.createElement('option')
  cartao.value = 'C'
  cartao.text = 'Cartão credito/débito'
  comboBox.add(cartao)

  
  metodo_pagamento.parentNode.replaceChild(comboBox, metodo_pagamento)
  
  comboBox.addEventListener('change', () => atualizar_pagamento(comboBox.value, id))


}

const exibirPedidos = (pedidos) => {
    const listaPedidos = document.getElementById('lista-pedidos');
  
    pedidos.forEach((pedido,index) => {
      const divPrincipal = document.createElement('div');
      divPrincipal.className = 'flex w-full justify-between border-b-[1px] border-b-black items-center p-2';
      divPrincipal.innerHTML = `
      <div class="flex w-[70%] justify-beetween items-center">
                <div class="flex flex-col items-center w-[80%]">
                    <div class="w-[100%]">
                        <p class="text-sm lg:text-2xl font-semibold w-[100%]">Status do pedido: ${pedido.status_pedido=="A"? "Aguardando":
                        pedido.status_pedido=="E"? "Entregue": pedido.status_pedido=="C"?"Cancelado": pedido.status_pedido=="T"?"Transporte":
                        "Preparação"}</p>
                        <p class="text-sm font-medium">Data do pedido: ${pedido.data_pedido}</p>
                    </div>
                </div>
                <p id="metodo_pagamento" class="text-sm font-medium">Metodo pagamento: ${pedido.metodo == "P"? "PIX": pedido.metodo == "B"? "Boleto": pedido.metodo == 'C'? "Cartão credito/débito" : "ALO"}</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="flex">
                <p class="text-sm lg:text-2xl text-[#77B725] font-bold mr-2">R$ ${pedido.preco_total}</p>
                <button onclick="apagarPedidos(${pedido.id})" id="btnRemoverPedido" class="bg-[#2F2F2F] md:flex  rounded-full shadow-xl text-white font-[Poppins] flex justify-center items-center px-1 hover:bg-red-600"> X </button>
              </div>
                 <button onclick="editarPagamento(${pedido.id})">Editar</button>
            
            </div>
      `;
      listaPedidos.appendChild(divPrincipal);
    });
  };
  const obterPedidos = async () =>{
    try {
        const resposta = await axios.get(apiUrl, {
          headers: {
            Authorization: `JWT ${JSON.parse(localStorage.getItem('tokens')).access}`
        }
        });
        console.log(resposta.data);
        return resposta.data; 
      } catch (error) {
        if(error.response.status){
          if (error.response.status == 401) {
            alert("usuario não Autenticado!")
            window.location.href = 'login.html'
          }
        }
      }
  }

  const apagarPedidos = async (pedidoIndex) =>{
    try {
        const resposta = await axios.delete(apiUrl+pedidoIndex+"/", {
          headers: {
            Authorization: `JWT ${JSON.parse(localStorage.getItem('tokens')).access}`
        }
        });
        console.log(resposta.data);
        alert("Pedido apagado com sucesso")
        window.location.reload()
      } catch (erro) {
        console.error('Erro ao apagar pedido', erro);
        throw erro; 
      }
  }

  const executar = async () => {
    try {
      const pedidos = await obterPedidos();
      exibirPedidos(pedidos);
      
    } catch (erro) {
      console.error('Erro no fluxo principal:', erro);
    }
  };
  
  document.addEventListener('DOMContentLoaded', executar);
  btnRemoverPedido.addEventListener('click',apagarPedidos)