(function(){
'use strict';
angular
  .module('ProdutoEditControllers',[])
  .config(config)
  .controller('ProdutoEditController', ProdutoEditController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.produto-editar',{
        url : '/produto/edit/:id',
        templateUrl: 'src/admin/controllers/produto-create.html',
        controller : 'ProdutoEditController',
        controllerAs : 'vm',
        resolve : {
        	produtoPreService : produtoPreService 
        }
      });

      produtoPreService.$inject = ['Service', '$stateParams'];
      function produtoPreService(Service, $stateParams){
      	var id = $stateParams.id;
      	return Service.getProdutoById(id);
      }
  };

  ProdutoEditController.$inject = ['$scope', '$location', '$rootScope','$state','Service', 'produtoPreService'];
  function ProdutoEditController($scope, $location, $rootScope,$state, Service, produtoPreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    Pace.restart();
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    var vm = this;
    vm.produto = produtoPreService.data;
    vm.save = save;

    function save(){
      Pace.restart();
      if ($scope.formProdutoCreate.$valid) {
          Service
            .editProduto(vm.produto)
            .then(ProdutoEditSuccess);
      
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

    function ProdutoEditSuccess(response){
      $rootScope.messageWarning = '';
      $rootScope.messageSuccess = response.data.message;
      $state.go('app.produto-listar');
    }
  }
}());