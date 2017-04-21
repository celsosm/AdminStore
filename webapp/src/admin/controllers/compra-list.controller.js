(function(){
'use strict';
angular
  .module('CompraListControllers',[])
  .config(config)
  .controller('CompraListController', CompraListController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.compra-list',{
        url : '/compra/list',
        templateUrl: 'src/admin/controllers/compra-list.html',
        controller : 'CompraListController',
        controllerAs : 'vm',
        resolve : {
        	compraPreService : compraPreService 
        }
      });

      compraPreService.$inject = ['Service'];
      function compraPreService(Service){
      	return Service.getAllCompras();
      }
  };

  CompraListController.$inject = ['$location', '$rootScope','$state', '$scope','Service', 'compraPreService'];
  function CompraListController($location, $rootScope,$state, $scope, Service, compraPreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleCompraLst');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = $rootScope.messageSuccess.indexOf('Compra')>=0?$rootScope.messageSuccess:'';
    var vm = this;
    vm.compras = compraPreService.data;
    vm.deletar = deletar;
    vm.editar = editar;
    vm.setId = setId;
    
    function deletar() {
      Pace.restart();
      Service
        .deletarCompra($scope.id)
        .then(CompraDeleteSuccess);
    }

    function editar(id) {
      Pace.restart();
    	$state.go('app.compra-editar', {id : id})
    }

            
   function CompraDeleteSuccess(response){
      $rootScope.messageSuccess = response.data.message;
      $state.reload();
    }

     function setId(id) {
      $scope.id = id; 
    }
  }
}());