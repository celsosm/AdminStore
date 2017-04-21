(function(){
'use strict';
angular
  .module('ProdutoListControllers',[])
  .config(config)
  .controller('ProdutoListController', ProdutoListController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.produto-listar',{
        url : '/produto/list',
        templateUrl: 'src/admin/controllers/produto-list.html',
        controller : 'ProdutoListController',
        controllerAs : 'vm',
        resolve : {
        	produtoPreService : produtoPreService 
        }
      });

      produtoPreService.$inject = ['Service'];
      function produtoPreService(Service){
      	return Service.getAllProdutos();
      }
  };

  ProdutoListController.$inject = ['$location', '$rootScope','$state', '$scope','Service', 'produtoPreService'];
  function ProdutoListController($location, $rootScope,$state, $scope, Service, produtoPreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = $rootScope.messageSuccess.indexOf('Produto')>=0?$rootScope.messageSuccess:'';
    var vm = this;
    vm.produtos = produtoPreService.data;
    vm.deletar = deletar;
    vm.editar = editar;
    vm.setId = setId;
    
    function deletar() {
      Pace.restart();
      Service
        .deletarProduto($scope.id)
        .then(ProdutoDeleteSuccess);

    }

    function setId(id) {
      $scope.id = id; 
    }

    function editar(id) {
        Pace.restart();
       	$state.go('app.produto-editar', {id : id})
    }

   function ProdutoDeleteSuccess(response){
      $rootScope.messageSuccess = response.data.message;
      $state.reload();
    }
  }
}());