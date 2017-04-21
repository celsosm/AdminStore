(function(){
'use strict';
  angular
    .module('Services',[])
    .factory('Service', Service);

  Service.$inject = ['$http'];

  function Service($http){
    var service = this;
    service.produtoCreate = produtoCreate;
    service.getAllProdutos = getAllProdutos;
    service.deletarProduto = deletarProduto;
    service.getProdutoById = getProdutoById;
    service.editProduto = editProduto;
    service.clienteCreate = clienteCreate;
    service.deletarCliente = deletarCliente;
    service.editCliente = editCliente;
    service.getAllClientes = getAllClientes;
    service.getClienteById = getClienteById;
    service.vendaCreate = vendaCreate;
    service.getAllVendas = getAllVendas;
    service.deletarVenda = deletarVenda;
    service.editVenda = editVenda;
    service.listProdutoVenda = listProdutoVenda;
    service.listClienteVenda = listClienteVenda;
    service.getProdutoByIdForVenda = getProdutoByIdForVenda;
    service.findUser = findUser;
    service.verificaPermissao = verificaPermissao;
    service.compraCreate = compraCreate;
    service.getAllCompras = getAllCompras;
    service.deletarCompra = deletarCompra;
    service.getCompraById = getCompraById;
    service.editCompra = editCompra;
    service.listProdutosAVencer = listProdutosAVencer;
    service.listProdutoEstoqueBaixo = listProdutoEstoqueBaixo;
    service.getVendaById = getVendaById;
    return service;

    function verificaPermissao(user, tela){
      var isOK = false;
      angular.forEach(user, function(value, key) {
        if(key == tela && value) 
          isOK = true;
        //this.push(key + ': ' + value);
      },isOK); //, role);

      return isOK;
    }


    function compraCreate(compra){
      var method = 'POST'
        , url = '/app/compra/cadastrar';
      return $http({
        url : url,
        method : method,
        data : compra
      }).then(function(response){
        return response;
      });
    }

    function produtoCreate(produto){
      var method = 'POST'
      	,	url = '/app/produto/cadastrar';
      return $http({
        url : url,
        method : method,
        data : produto
      }).then(function(response){
        return response;
      });
    }

    function produtoCreate(produto){
      var method = 'POST'
        , url = '/app/produto/cadastrar';
      return $http({
        url : url,
        method : method,
        data : produto
      }).then(function(response){
        return response;
      });
    }

     function vendaCreate(venda){
      var method = 'POST'
        , url = '/app/venda/cadastrar';
      return $http({
        url : url,
        method : method,
        data : venda
      }).then(function(response){
        return response;
      });
    }

    function clienteCreate(cliente){
      var method = 'POST'
        , url = '/app/cliente/cadastrar';
      return $http({
        url : url,
        method : method,
        data : cliente
      }).then(function(response){
        return response;
      });
    }

    function findUser(user){
      var method = 'POST'
        , url = '/app/user/findUser';
      return $http({
        url : url,
        method : method,
        data : user
      }).then(function(response){
        return response;
      });
    }


    function getAllProdutos(){
      var method = 'GET'
        , url = '/app/listar';
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function getAllCompras(){
      var method = 'GET'
        , url = '/app/compra/listar';
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    
    function listProdutoVenda(){
      var method = 'GET'
        , url = '/app/produto/listProdutoVenda';
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function listProdutosAVencer(){
      var method = 'GET'
        , url = '/app/produto/listProdutosAVencer';
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }


     function listProdutoEstoqueBaixo(){
      var method = 'GET'
        , url = '/app/produto/listProdutoEstoqueBaixo';
      return $http({
        url : url,
        method : method
      }).then(function(response){

        var results = [];
      angular.forEach(response.data, function(produto, index) {
        if(produto.quantidadeEstoque <= produto.quantidadeMinimaEstoque) 
          results.push(produto);
        //this.push(key + ': ' + value);
      },results); //, role);
        return results;
      });
    }

    function listClienteVenda(){
      var method = 'GET'
        , url = '/app/cliente/listClienteVenda';
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function getAllVendas(){
      var method = 'GET'
        , url = '/app/venda/listar';
      return $http({
        url : url,
        method : method
      }).then(function(response){
       //console.log(response);
        return response;
      });
    }

     function getAllClientes(){
      var method = 'GET'
        , url = '/app/cliente/listar';
      return $http({
        url : url,
        method : method
      }).then(function(response){
       // console.log("aqui");
        return response;
      });
    }

    function getProdutoById(id){
      var method = 'GET'
        , url = '/app/listarById/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        console.log(response);
        return response;
      });
    }

     function getProdutoByIdForVenda(id){
      var method = 'GET'
        , url = '/app/listarById/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
       // console.log(response.data);
        return response.data;
      });
    }

    function getClienteById(id){
      var method = 'GET'
        , url = '/app/cliente/edit/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function getCompraById(id){
      var method = 'GET'
        , url = '/app/compra/edit/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function getVendaById(id){
      var method = 'GET'
        , url = '/app/venda/edit/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }
   

    function deletarProduto(id){
      var method = 'DELETE'
        , url = '/app/delete/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function deletarVenda(id){
      var method = 'DELETE'
        , url = '/app/venda/delete/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function deletarCompra(id){
      var method = 'DELETE'
        , url = '/app/compra/delete/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }


     function deletarCliente(id){
      var method = 'DELETE'
        , url = '/app/cliente/delete/' + id;
      return $http({
        url : url,
        method : method
      }).then(function(response){
        return response;
      });
    }

    function editProduto(produto){
      var method = 'PUT'
        , url = '/app/produto/editar';
      return $http({
        url : url,
        method : method,
        data : produto
      }).then(function(response){
        return response;
      });
    }

    function editVenda(venda){
      var method = 'PUT'
        , url = '/app/venda/editar';
      return $http({
        url : url,
        method : method,
        data : venda
      }).then(function(response){
        return response;
      });
    }

    function editCompra(compra){
      var method = 'PUT'
        , url = '/app/compra/editar';
      return $http({
        url : url,
        method : method,
        data : compra
      }).then(function(response){
        return response;
      });
    }

    function editCliente(cliente){
      var method = 'PUT'
        , url = '/app/cliente/editar';
      return $http({
        url : url,
        method : method,
        data : cliente
      }).then(function(response){
        return response;
      });
    }
    
  }
}());
