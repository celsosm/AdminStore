(function(){
'use strict';
angular
  .module('ClienteListControllers',[])
  .config(config)
  .controller('ClienteListController', ClienteListController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.cliente-list',{
        url : '/cliente/list',
        templateUrl: 'src/admin/controllers/cliente-list.html',
        controller : 'ClienteListController',
        controllerAs : 'vm',
        resolve : {
        	clientePreService : clientePreService 
        }
      });

      clientePreService.$inject = ['Service'];
      function clientePreService(Service){
      	return Service.getAllClientes();
      }
  };

  ClienteListController.$inject = ['$location', '$rootScope','$state', '$scope','Service', 'clientePreService'];
  function ClienteListController($location, $rootScope,$state, $scope, Service, clientePreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = $rootScope.messageSuccess.indexOf('Cliente')>=0?$rootScope.messageSuccess:'';
    var vm = this;
    vm.clientes = clientePreService.data;
    vm.deletar = deletar;
    vm.editar = editar;
    vm.setId = setId;
    
    function deletar() {
      Pace.restart();
      Service
        .deletarCliente($scope.id)
        .then(ClienteDeleteSuccess);
    }

    function editar(id) {
      Pace.restart();
    	$state.go('app.cliente-editar', {id : id})
    }

            
   function ClienteDeleteSuccess(response){
      $rootScope.messageSuccess = response.data.message;
      $state.reload();
    }

     function setId(id) {
      $scope.id = id; 
    }
  }
}());