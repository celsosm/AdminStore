(function(){
'use strict';
angular
  .module('ClienteEditControllers',[])
  .config(config)
  .controller('ClienteEditController', ClienteEditController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.cliente-editar',{
        url : '/cliente/edit/:id',
        templateUrl: 'src/admin/controllers/cliente-create.html',
        controller : 'ClienteEditController',
        controllerAs : 'vm',
        resolve : {
        	clientePreService : clientePreService 
        }
      });

      clientePreService.$inject = ['Service', '$stateParams'];
      function clientePreService(Service, $stateParams){
      	var id = $stateParams.id;
      	return Service.getClienteById(id);
      }
  };

  ClienteEditController.$inject = ['$scope','$location', '$rootScope','$state','Service', 'clientePreService'];
  function ClienteEditController($scope, $location, $rootScope,$state, Service, clientePreService){
    if("undefined" === typeof $rootScope.userLogado){
      $location.path('/');//redireciona para login
   
    } else {
      var isOK = Service.verificaPermissao($rootScope.userLogado, 'roleVendaCad');
     if(!isOK){
        $location.path('/');//redireciona para login
     }
    }
    Pace.restart();
    var vm = this;
    vm.cliente = clientePreService.data;
    $rootScope.messageWarning = '';
    $rootScope.messageSuccess = '';
    vm.save = save;

    function save(){
      Pace.restart();
      if ($scope.formClienteCreate.$valid) {
          Service
            .editCliente(vm.cliente)
            .then(ClienteEditSuccess);
      }else{
        if(!$scope.formClienteCreate.nomeCliente.$valid)
          $scope.formClienteCreate.nomeCliente.$pristine = false;
          $rootScope.messageSuccess = '';
          $rootScope.messageWarning = 'Por favor, informe os campos obrigatórios'; 
      }
    }

    function ClienteEditSuccess(response){
      $rootScope.messageSuccess = response.data.message;
      $state.go('app.cliente-list');
    }
  }
}());