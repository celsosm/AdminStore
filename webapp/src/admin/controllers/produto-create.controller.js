(function(){
'use strict';
angular
  .module('ProdutoCreateControllers',[])
  .config(config)
  .controller('ProdutoCreateController', ProdutoCreateController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.create-produto',{
        url : '/produto/create',
        templateUrl: 'src/admin/controllers/produto-create.html',
        controller : 'ProdutoCreateController',
        controllerAs : 'vm'
      });
  };

  ProdutoCreateController.$inject = ['$location', '$rootScope','$state', '$scope', 'Service'];
  function ProdutoCreateController($location, $rootScope,$state, $scope, Service){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
   
    var vm = this;
     $scope.showMessage = false;
    vm.onlyMoneyVemda = onlyMoneyVemda;
    vm.onlyMoneyCompra = onlyMoneyCompra;
    vm.save = save;
    var produto = {
              valorDeVenda: '',
              valorDeCompra: '',
              quantidadeEstoque: '',
              quantidadeMinimaEstoque: 1,
              ativo: 'Sim' 
    };
    vm.produto = produto;
    vm.limparValorDeVenda = limparValorDeVenda;
    vm.limparValorDeCompra = limparValorDeCompra;
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    
    function limparValorDeVenda(){
      produto.valorDeVenda = '';
    }

    function limparValorDeCompra(){
      produto.valorDeCompra = '';
    }

    function save(){
      Pace.restart();
      if ($scope.formProdutoCreate.$valid) {
          Service
            .produtoCreate(vm.produto)
            .then(ProdutoCreateSuccess);
      
      }else{
        if(!$scope.formProdutoCreate.nomeProduto.$valid)
          $scope.formProdutoCreate.nomeProduto.$pristine = false;

        if(!$scope.formProdutoCreate.quantidadeEstoque.$valid)
          $scope.formProdutoCreate.quantidadeEstoque.$pristine = false;

        if(!$scope.formProdutoCreate.valorDeVenda.$valid)
          $scope.formProdutoCreate.valorDeVenda.$pristine = false;
          $rootScope.messageSuccess = '';
          $rootScope.messageWarning = 'Por favor, informe os campos obrigatórios'; 
      }
    }

    function ProdutoCreateSuccess(response){
      $rootScope.messageWarning = '';
      $rootScope.messageSuccess = response.data.message;
      var produto = {
              valorDeVenda: '',
              valorDeCompra: '',
              quantidadeEstoque: '',
              quantidadeMinimaEstoque: 1,
              ativo: 'Sim' 
      };
      vm.produto = produto;
      //$('.formAdmin')[0].reset();
      //$state.reload();
      //$state.go('app.produto-listar')
    }

    //valor monetario
    function onlyMoneyCompra(e, myValue) {
      var keyCode = (e.which) ? e.which : e.keyCode;
      if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
          e.preventDefault();
      }else{
        vm.produto.valorDeCompra += String.fromCharCode(keyCode);  
        e.preventDefault();
      }
    }

    //valor monetario
    function onlyMoneyVemda(e, myValue) {
      var keyCode = (e.which) ? e.which : e.keyCode;
      if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
          e.preventDefault();
      }else{
        vm.produto.valorDeVenda += String.fromCharCode(keyCode);  
        e.preventDefault();
      }
    }
  }
}());